import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
const app = express();
const port = 3000;

// connecting to db
main()
  .then(() => console.log("db connected successfully"))
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
}

// importing parser to parse cookie and body
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//graning access for cross origin requests
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// importing auth methods

import {
  getEncryptedPassword,
  comparePassword,
  sendToken,
  verifyToken,
} from "./auth/auth.js";

// imporing models
import { User, Todo } from "./models/index.js";

app.listen(port, () => {
  console.log("listening on port " + port);
});

app.get("/", (req, res) => {
  res.send("root here!");
});

app.post("/user/signup", async (req, res) => {
  try {
    const userData = req.body;
    userData.password = await getEncryptedPassword(userData.password);
    const user = new User(userData);
    user
      .save()
      .then((data) => res.status(201).send("Successfully saved to database"))
      .catch((err) => res.status(500).send("failed to save to database"));
  } catch (err) {
    console.log("error while adding user to database:" + err.message);
  }
});

app.post("/user/todo/new", async (req, res) => {
  try {
    const todoData = req.body;
    const todo = new Todo(todoData);
    todo
      .save()
      .then((data) => res.status(201).send("Successfully saved to database"))
      .catch((err) => res.status(500).send("failed to save to database"));
  } catch (error) {
    console.log("error while adding todo to database:" + err.message);
  }
});

app.get("/user/todo/all", (req, res) => {
  try {
    Todo.find()
      .then((data) => res.send(data))
      .catch((err) => console.log("error while fetching todos : " + err));
  } catch (error) {
    console.log("error while fetching todos : " + error);
  }
});

app.get("*", (req, res) => {
  res.send("you have made request to wrong route!");
});
