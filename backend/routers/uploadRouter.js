import multer from 'multer';
import express from 'express';
import multerS3 from 'multer-s3'
import aws from 'aws-sdk'
import dotenv from 'dotenv';
import { isAuth } from '../utils.js';

dotenv.config()

const uploadRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.jpg`);
  },
});

const upload = multer({ storage });

uploadRouter.post('/', isAuth, upload.single('image'), (req, res) => {
  res.send(`/${req.file.path}`);
});

aws.config.update({
  accessKeyId: process.env.S3_KEY_ID,
  secretAccessKey: process.env.S3_ACCESSS_KEY
})

const s3 = new aws.S3()
const storageS3 = multerS3({
  s3,
  bucket: 'pagineazzurre2',
  acl: 'public-read',
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key(req, file, cb){
    cb(null, file.originalname)
  }
})

const uploadS3 = multer({ storage: storageS3 })
uploadRouter.post('/s3', uploadS3.single('image'), (req, res) => {
  res.send(req.file.location)
})
export default uploadRouter;
