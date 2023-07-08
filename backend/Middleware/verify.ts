import mysql from "mysql";
import dotenv from "dotenv";
import express, { Application, Request, Response, NextFunction } from "express";
import jsonwebtoken from "jsonwebtoken";
dotenv.config();
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: "root",
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});
interface customRequest extends Request {
  user?: any;
}
async function verify(req: customRequest, res: Response, next: NextFunction) {
  const cookieString = req.headers.cookie;
  const cookies = cookieString ? cookieString.split("; ") : [];
  let token = null;
  for (const cookie of cookies) {
    if (cookie.startsWith("token=")) {
      token = cookie.split("=")[1];
      break;
    }
  }
  if (!token) {
    return res.status(500).send("No token.");
  }
  jsonwebtoken.verify(token, "your-secret-key", (error, result) => {
    if (error) {
      throw error;
    }
    req.user = result;
    return res.status(200).json(req.user);
  });
}

export { verify };
