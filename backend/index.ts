import express, { Application, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import mysql from "mysql";
import { router } from "./Routes/userRoutes";
const cloudinary = require("cloudinary").v2;
const Multer = require("multer");
const storage = new Multer.memoryStorage();
cloudinary.config({
  cloud_name: "dhxeo4rvc",
  api_key: "893466947189135",
  api_secret: "d4PxfO7xK_WdQ1gqELCJ2JJB87E",
});
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: "root",
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

connection.connect(function (err) {
  if (err) {
    throw err;
  }
  console.log("Connected!");
});

dotenv.config();
const app: Application = express();
app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use("/", router);
async function handleUpload(file: string) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: "image",
  });
  return res;
}

const upload = Multer({
  storage,
});

app.post(
  "/upload",
  upload.single("my_file"),
  async (req: Request, res: Response) => {
    try {
      const b64 = Buffer.from((req as any).file.buffer).toString("base64");
      let dataURI = "data:" + (req as any).file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
      res.json({
        public_id: cldRes.public_id,
        ...cldRes,
      });
    } catch (error: any) {
      res.send({
        message: error.message,
      });
    }
  }
);

app.listen(process.env.PORT, () => {
  console.log(`PORT LISTENING ON ${process.env.PORT}`);
});
