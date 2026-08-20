import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { User } from '../models/user_model.js';
import { Post } from '../models/post_model.js';
import { Comment } from '../models/comment_model.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const totalUsers = await User.countDocuments();
    const maleCount = await User.countDocuments({ gender: 'male' });
    const femaleCount = await User.countDocuments({ gender: 'female' });
    const postCount = await Post.countDocuments();
    const commentCount = await Comment.countDocuments();

    const totalFollowers = await User.aggregate([
      { $project: { followerCount: { $size: '$followers' } } },
      {
        $group: {
          _id: null,
          total: { $sum: '$followerCount' },
          avg: { $avg: '$followerCount' },
          max: { $max: '$followerCount' },
        },
      },
    ]);

    const usersWithPosts = await User.countDocuments({
      posts: { $not: { $size: 0 } },
    });

    console.log('----------------------------------------');
    console.log('  DATABASE VERIFICATION');
    console.log('----------------------------------------');
    console.log(`  Total Users:       ${totalUsers}`);
    console.log(`  Male Users:        ${maleCount}`);
    console.log(`  Female Users:      ${femaleCount}`);
    console.log(`  Users with posts:  ${usersWithPosts}`);
    console.log(`  Total Posts:       ${postCount}`);
    console.log(`  Total Comments:    ${commentCount}`);
    const stats = totalFollowers[0] || { total: 0, avg: 0, max: 0 };
    console.log(
      `  Total follows:     ${stats.total} (avg ${stats.avg.toFixed(
        1
      )}, max ${stats.max})`
    );
    console.log('----------------------------------------');

    console.log('\nSample users:');
    const samples = await User.find()
      .limit(3)
      .select('-password')
      .lean();
    for (const u of samples) {
      console.log(
        `  ${u.username} <${u.email}> [${u.gender}] posts:${u.posts.length} followers:${u.followers.length} following:${u.following.length}`
      );
      console.log(`    bio: "${u.bio.substring(0, 60)}..."`);
      console.log(`    profile: ${u.profilePicture}`);
    }

    console.log('\nSample post with comments:');
    const samplePost = await Post.findOne()
      .populate('author', 'username')
      .populate('likes', 'username')
      .populate('comments', 'text')
      .lean();
    if (samplePost) {
      console.log(
        `  author: ${samplePost.author.username} | likes: ${samplePost.likes.length} | comments: ${samplePost.comments.length}`
      );
      console.log(`  caption: "${samplePost.caption.substring(0, 60)}..."`);
      console.log(`  image: ${samplePost.image}`);
      if (samplePost.comments.length > 0) {
        console.log(`  first comment: "${samplePost.comments[0].text.substring(0, 60)}..."`);
      }
    }

    await mongoose.disconnect();
    console.log('\nDisconnected.');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

main();
