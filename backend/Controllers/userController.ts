import mysql from "mysql";
import express, { Application, Request, Response } from "express";
const app: Application = express();
import bcryptjs from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: "root",
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

async function registerUser(req: Request, res: Response) {
  const { username, first_name, last_name, email, password, profile_pic } =
    req.body;
  const checkQuery = `SELECT * FROM USERS WHERE EMAIL = '${email}'`;

  connection.query(checkQuery, async (error, result) => {
    if (error) {
      throw error;
    }

    if (result.length > 0) {
      return res.status(400).send("User already exists.");
    }

    const hashedPassword = await bcryptjs.hash(password, 10);
    const insertQuery = `INSERT INTO USERS (username, first_name, last_name, email, password, profile_pic) VALUES (?, ?, ?, ?, ?, ?)`;
    const insertValues = [
      username,
      first_name,
      last_name,
      email,
      hashedPassword,
      profile_pic,
    ];

    connection.query(insertQuery, insertValues, (error) => {
      if (error) {
        throw error;
      }

      const token = jsonwebtoken.sign({ email }, "your-secret-key", {
        expiresIn: "5d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      });

      return res.send("User registered successfully.");
    });
  });
}

async function loginUser(req: Request, res: Response) {
  const { email, password } = req.body;
  const checkQuery = `SELECT * FROM USERS WHERE EMAIL = '${email}'`;

  connection.query(checkQuery, async (error, result) => {
    if (error) {
      throw error;
    }

    if (result.length < 1) {
      return res.status(400).send("User does not exist.");
    }

    const comparePassword = await bcryptjs.compare(
      password,
      result[0].password
    );
    if (comparePassword) {
      const token = jsonwebtoken.sign({ email }, "your-secret-key", {
        expiresIn: "5d",
      });

      res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      });

      return res.status(200).send("User logged in successfully.");
    } else {
      return res.status(200).send("Invalid ID/Password.");
    }
  });
}

async function logout(req: Request, res: Response) {
  res.cookie("token", null, {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  return res.json("User logged out.");
}

export { registerUser, loginUser, logout };
