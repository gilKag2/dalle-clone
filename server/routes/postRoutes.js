import express from 'express';

import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

import Post from '../mongodb/models/post.js';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const router = express.Router();



router.route('/')
  .get(async (req, res) => {
    try {
      const posts = await getAllPosts();
      res.json(posts);
    } catch (err) {
      res.status(500).send(err);
    }
  })
  .post(async (req, res) => {
    const { name, prompt, photo } = req.body;

    try {

      const newPost = await uploadPhoto(name, prompt, photo);
      res.status(201).json(newPost);
    } catch (err) {
      console.error(err);
      res.status(500).send(err.message);
    }
  });

const getAllPosts = async () => {
  return await Post.find({});
};

const uploadPhoto = async (name, prompt, photo) => {
  const photoUrl = await cloudinary.uploader.upload(photo);

  const newPost = await Post.create({
    name,
    prompt,
    photo: photoUrl.url
  });
  return newPost;
};

export default router;