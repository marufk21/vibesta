import { User } from '../models/user_model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import getDataUri from '../utils/datauri.js';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post_model.js';
import { getCookieOptions } from '../utils/cookieOptions.js';

const isDatabaseConnected = () => mongoose.connection.readyState === 1;

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(401).json({
        message: 'Something is missing, please check!',
        success: false,
      });
    }
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        message: 'Database is not connected. Please check MongoDB.',
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: 'Try different email',
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: 'Account created successfully.',
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Registration failed. Please try again.',
      success: false,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: 'Something is missing, please check!',
        success: false,
      });
    }
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        message: 'Database is not connected. Please check MongoDB.',
        success: false,
      });
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: 'Incorrect email or password',
        success: false,
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: 'Incorrect email or password',
        success: false,
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: '1d',
    });

    // populate each post if in the posts array
    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );
    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
    };
        return res
      .cookie('token', token, getCookieOptions())
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Login failed. Please try again.',
      success: false,
    });
  }
};
export const logout = async (_, res) => {
    try {
    return res
      .cookie('token', '', { ...getCookieOptions(), maxAge: 0 })
      .json({
        message: 'Logged out successfully.',
        success: true,
      });
  } catch (error) {
    console.log(error);
  }
};

// Login with a random demo/test user. Picks one seeded user and logs them in
// directly so the "Sign in as Test User" button always works.
export const testLogin = async (req, res) => {
  try {
    if (!isDatabaseConnected()) {
      return res.status(503).json({
        message: 'Database is not connected. Please check MongoDB.',
        success: false,
      });
    }
    const randomUsers = await User.aggregate([
      { $sample: { size: 1 } },
      { $project: { password: 0 } },
    ]);
    let randomUser = randomUsers[0];

    if (!randomUser) {
      // Auto-create a test user if database has no users yet
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      const newTestUser = await User.create({
        username: 'test_user',
        email: 'testuser@vibesta.com',
        password: hashedPassword,
        profilePicture:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop',
        bio: 'Welcome to Vibesta! 🚀',
        gender: 'female',
      });
      randomUser = newTestUser.toObject();
    }

    const token = await jwt.sign(
      { userId: randomUser._id },
      process.env.SECRET_KEY,
      { expiresIn: '1d' }
    );

    const populatedPosts = await Promise.all(
      (randomUser.posts || []).map(async (postId) => {
        const post = await Post.findById(postId);
        if (post && post.author.equals(randomUser._id)) {
          return post;
        }
        return null;
      })
    );

    const user = {
      _id: randomUser._id,
      username: randomUser.username,
      email: randomUser.email,
      profilePicture: randomUser.profilePicture,
      bio: randomUser.bio,
      followers: randomUser.followers || [],
      following: randomUser.following || [],
      posts: populatedPosts.filter(Boolean),
    };

        return res
      .cookie('token', token, getCookieOptions())
      .json({
        message: `Welcome back @${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Demo login failed. Please try again.',
      success: false,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
      .populate({ path: 'posts', createdAt: -1 })
      .populate('bookmarks');
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
        success: false,
      });
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: 'Profile updated.',
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};
export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      '-password'
    );
    if (!suggestedUsers) {
      return res.status(400).json({
        message: 'Currently do not have any users',
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getFollowersList = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('followers');
    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
        success: false,
      });
    }
    const followers = await User.find({
      _id: { $in: user.followers || [] },
    }).select('username profilePicture bio');

    return res.status(200).json({ success: true, users: followers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Failed to get followers list',
      success: false,
    });
  }
};

export const getFollowingList = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('following');
    if (!user) {
      return res.status(404).json({
        message: 'User not found.',
        success: false,
      });
    }
    const following = await User.find({
      _id: { $in: user.following || [] },
    }).select('username profilePicture bio');

    return res.status(200).json({ success: true, users: following });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Failed to get following list',
      success: false,
    });
  }
};
export const followOrUnfollow = async (req, res) => {
  try {
    const followKrneWala = req.id; // patel
    const jiskoFollowKrunga = req.params.id; // shivani
    if (String(followKrneWala) === String(jiskoFollowKrunga)) {
      return res.status(400).json({
        message: 'You cannot follow/unfollow yourself',
        success: false,
      });
    }

    const user = await User.findById(followKrneWala);
    const targetUser = await User.findById(jiskoFollowKrunga);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: 'User not found',
        success: false,
      });
    }

    const followKrneWalaObjId = new mongoose.Types.ObjectId(followKrneWala);
    const jiskoFollowKrungaObjId = new mongoose.Types.ObjectId(jiskoFollowKrunga);

    // mai check krunga ki follow krna hai ya unfollow
    const isFollowing = (user.following || []).some(
      (id) => String(id) === String(jiskoFollowKrunga)
    );
    if (isFollowing) {
      // unfollow logic ayega
      await Promise.all([
        User.updateOne(
          { _id: followKrneWalaObjId },
          { $pull: { following: { $in: [jiskoFollowKrungaObjId, jiskoFollowKrunga] } } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrungaObjId },
          { $pull: { followers: { $in: [followKrneWalaObjId, followKrneWala] } } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: 'Unfollowed successfully', success: true });
    } else {
      // follow logic ayega ($addToSet to avoid duplicates)
      await Promise.all([
        User.updateOne(
          { _id: followKrneWalaObjId },
          { $addToSet: { following: jiskoFollowKrungaObjId } }
        ),
        User.updateOne(
          { _id: jiskoFollowKrungaObjId },
          { $addToSet: { followers: followKrneWalaObjId } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: 'followed successfully', success: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: 'Failed to follow/unfollow user',
      success: false,
    });
  }
};
