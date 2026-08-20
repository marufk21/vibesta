import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { faker } from '@faker-js/faker';
import { User } from '../models/user_model.js';
import { Post } from '../models/post_model.js';
import { Comment } from '../models/comment_model.js';
import { Conversation } from '../models/conversation_model.js';
import { Message } from '../models/message_model.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

const clearDatabase = async () => {
  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});
  await Conversation.deleteMany({});
  await Message.deleteMany({});
};

const generateUsers = async (count = 100) => {
  const users = [];
  for (let i = 1; i <= count; i++) {
    const gender = faker.helpers.arrayElement(['male', 'female']);
    const firstName = faker.person.firstName(gender);
    const lastName = faker.person.lastName();
    const username = `${firstName}.${lastName}${i}`.toLowerCase();
    const email = `${firstName}.${lastName}${i}@example.com`.toLowerCase();

    users.push({
      username,
      email,
      password: await bcrypt.hash('Password123!', 10),
      profilePicture: faker.image.avatar(),
      bio: faker.lorem.sentences(2),
      gender,
    });
  }
  return users;
};

const setupFollowRelationships = async (users) => {
  const allUserIds = users.map((u) => u._id);
  const operations = [];

  for (const user of users) {
    const numToFollow = faker.number.int({ min: 5, max: 20 });
    const otherUsers = allUserIds.filter((id) => !id.equals(user._id));
    const toFollow = faker.helpers.arrayElements(otherUsers, numToFollow);

    operations.push({
      updateOne: {
        filter: { _id: user._id },
        update: { $addToSet: { following: { $each: toFollow } } },
      },
    });

    for (const followedId of toFollow) {
      operations.push({
        updateOne: {
          filter: { _id: followedId },
          update: { $addToSet: { followers: user._id } },
        },
      });
    }
  }

  await User.bulkWrite(operations);

  const totalFollowers = await User.aggregate([
    { $project: { _id: 1, followerCount: { $size: '$followers' } } },
  ]);

  const avgFollowers = (
    totalFollowers.reduce((sum, u) => sum + u.followerCount, 0) /
    totalFollowers.length
  ).toFixed(1);
  const totalFollows = totalFollowers.reduce(
    (sum, u) => sum + u.followerCount,
    0
  );
  console.log(
        `Follow relationships created: ${totalFollows} total follows (avg ${avgFollowers} per user)`
  );
};

const generatePosts = async (users) => {
  const posts = [];
  const allUserIds = users.map((u) => u._id);

  for (const user of users) {
    const numPosts = faker.number.int({ min: 1, max: 10 });
    for (let j = 1; j <= numPosts; j++) {
      const numLikes = faker.number.int({ min: 0, max: allUserIds.length - 1 });
      const likedBy = faker.helpers.arrayElements(
        allUserIds.filter((id) => !id.equals(user._id)),
        numLikes
      );

      posts.push({
        caption: faker.lorem.sentences(faker.number.int({ min: 1, max: 4 })),
        image: `https://picsum.photos/seed/${faker.string.uuid()}/600/600`,
        author: user._id,
        likes: likedBy,
      });
    }
  }

  const createdPosts = await Post.insertMany(posts);

  const postOwnerMap = {};
  for (const post of createdPosts) {
    const authorId = post.author.toString();
    if (!postOwnerMap[authorId]) postOwnerMap[authorId] = [];
    postOwnerMap[authorId].push(post._id);
  }

  const postOps = Object.entries(postOwnerMap).map(([authorId, postIds]) => ({
    updateOne: {
      filter: { _id: authorId },
      update: { $addToSet: { posts: { $each: postIds } } },
    },
  }));
  await User.bulkWrite(postOps);

  console.log(`Posts created: ${createdPosts.length}`);
  return createdPosts;
};

const generateComments = async (posts, users) => {
  const comments = [];
  const allUserIds = users.map((u) => u._id);

  for (const post of posts) {
    if (Math.random() < 0.4) {
      const numComments = faker.number.int({ min: 1, max: 8 });
      for (let j = 0; j < numComments; j++) {
        const authorId = faker.helpers.arrayElement(allUserIds);
        comments.push({
          text: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
          author: authorId,
          post: post._id,
        });
      }
    }
  }

  const createdComments = await Comment.insertMany(comments);

  const commentOwnerMap = {};
  for (const comment of createdComments) {
    const postId = comment.post.toString();
    if (!commentOwnerMap[postId]) commentOwnerMap[postId] = [];
    commentOwnerMap[postId].push(comment._id);
  }

  const commentOps = Object.entries(commentOwnerMap).map(
    ([postId, commentIds]) => ({
      updateOne: {
        filter: { _id: postId },
        update: { $addToSet: { comments: { $each: commentIds } } },
      },
    })
  );
  await Post.bulkWrite(commentOps);

    console.log(`Comments created: ${createdComments.length}`);
};

const main = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await connectDB();
    console.log('Connected to MongoDB.\n');

    console.log('Clearing all collections...');
    await clearDatabase();
    console.log('Database cleared.\n');

    console.log('Generating 100 fake users...');
    const users = await generateUsers(100);
    console.log('User data generated.\n');

    console.log('Inserting users into database...');
    const createdUsers = await User.insertMany(users);
    console.log(`Inserted ${createdUsers.length} users.\n`);

    console.log('Setting up follow relationships...');
    await setupFollowRelationships(createdUsers);
    console.log('Follow relationships set up.\n');

    console.log('Generating posts...');
    const createdPosts = await generatePosts(createdUsers);
    console.log('Posts and user-post links created.\n');

    console.log('Generating comments...');
    await generateComments(createdPosts, createdUsers);
    console.log('Comments and post-comment links created.\n');

    const finalCount = await User.countDocuments();
    const maleCount = await User.countDocuments({ gender: 'male' });
    const femaleCount = await User.countDocuments({ gender: 'female' });
    const postCount = await Post.countDocuments();
    const commentCount = await Comment.countDocuments();

    console.log('----------------------------------------');
    console.log('  SEED COMPLETE: Database Summary');
    console.log('----------------------------------------');
    console.log(`  Total Users:       ${finalCount}`);
    console.log(`  Male Users:        ${maleCount}`);
    console.log(`  Female Users:      ${femaleCount}`);
    console.log(`  Total Posts:       ${postCount}`);
    console.log(`  Total Comments:    ${commentCount}`);
    console.log('----------------------------------------');

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB.');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

main();


