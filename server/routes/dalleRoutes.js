import express from 'express';

import * as dotenv from 'dotenv';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const router = express.Router();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

router.route('/')
  .get((req, res) => {
    res.send({});
  })
  .post(async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt || prompt.length === 0) {
        return res.status(404).send('no prompt available');
      }
      const aiResponse = await openai.createImage({
        prompt: prompt,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json'
      });
      const img = aiResponse.data.data[ 0 ].b64_json;
      res.json({ photo: img });
    } catch (err) {
      console.error(err?.response.data.error.message);
      res.status(500).send(err?.response.data.error.message);
    }
  })
  ;


export default router;