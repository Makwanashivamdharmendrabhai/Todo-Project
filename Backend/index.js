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
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));

// importing auth methods

import {
  getEncryptedPassword,
  comparePassword,
  sendToken,
  verifyToken,
} from "./auth/auth.js";

import sendMail from "./helper/mail.js";
// imporing models
import { User, Todo } from "./models/index.js";
import generatePassword from "./helper/genPass.js";

app.listen(port, () => {
  console.log("listening on port " + port);
});

app.get("/", (req, res) => {
  res.send("root here!");
});

// user routes
app.post("/user/signup", async (req, res) => {
  try {
    const userData = req.body;
    const email = req.body.email;
    const dbUser = await User.findOne({ email: email });
    if (dbUser) {
      res.status(500).send({ message: "email is already registered" });
      return;
    }
    userData.password = await getEncryptedPassword(userData.password);
    const user = new User(userData);
    user
      .save()
      .then((data) => {
        const token = sendToken(data._id, data.email);
        res.cookie("token", token, {
          // httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 day
          sameSite: "lax", // Allows cookies in cross-origin requests with navigation
        });
        res.status(200).send({ message: "cookie generated successfully" });
      })
      .catch((err) =>
        res.status(500).send({ message: "error saving user", err: err })
      );
  } catch (err) {
    console.log("error while adding user to database:" + err);
  }
});

app.post("/user/login", async (req, res) => {
  const userData = req.body;
  try {
    // verifying user data with database
    // step 1 : fetching user data from database
    const dbUser = await User.findOne({ email: userData.email });
    // checking if user exist or not
    if (dbUser) {
      // step 2 : checking if password is correct or not
      if (await comparePassword(userData.password, dbUser.password)) {
        const token = sendToken(dbUser._id, userData.email);
        // sending cookie
        res.cookie("token", token, {
          // httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // 1 day
          sameSite: "lax", // Allows cookies in cross-origin requests with navigation
        });

        res.status(200).send({ message: "cooki sent successfully" });
      } else {
        res.status(500).send({ message: "password not match" });
      }
    } else {
      console.log("user not found");
      return null;
    }
  } catch (error) {
    console.log("error while sign in :" + error);
  }
});

app.post("/user/logout", verifyToken, async (req, res) => {
  res.clearCookie("token");
  res.status(200).send({ message: "user logged out succesfully" });
});

app.delete("/user/delete", verifyToken, async (req, res) => {
  try {
    const result = await Todo.deleteMany({ author: req.id });
    const user = await User.findByIdAndDelete(req.id);
    res.status(200).send({message:"user deleted successfully"});
  } catch (error) {
    console.log("error while deleting user", error);
  }
});

// todo routes
app.post("/user/todo/new", verifyToken, async (req, res) => {
  try {
    let todoData = req.body;
    todoData.author = req.id;

    // Fetch user
    const user = await User.findById(req.id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const todo = new Todo(todoData);
    const savedTodo = await todo.save();
    // Add todo ID to the user's todos array
    user.todos.push(savedTodo._id);
    await user.save();

    res
      .status(201)
      .send({ message: "Todo successfully added", data: savedTodo });
  } catch (error) {
    console.error("Error while adding todo:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

app.get("/user/todo/all", verifyToken, async (req, res) => {
  try {
    // Fetch only todos belonging to the logged-in user
    const todos = await Todo.find({
      author: req.id,
      isCompleted: false,
      isDeleted: false,
    }).sort({
      createdAt: -1,
    });

    if (!todos.length) {
      return res.status(200).send({ message: "No todos found", data: [] });
    }
    res
      .status(200)
      .send({ message: "Todos fetched successfully", data: todos });
  } catch (error) {
    console.error("Error while fetching todos:", error);
    res
      .status(500)
      .send({ message: "Error fetching todos", error: error.message });
  }
});

app.get("/user/todo/sort/:order", verifyToken, async (req, res) => {
  try {
    let order = req.params.order;
    if (order === "asc") order = 1;
    else order = -1;

    const sortedTodos = await Todo.find({
      author: req.id,
      isCompleted: false,
      isDeleted: false,
    }).sort({ priority: order });

    if (!sortedTodos.length) {
      return res.status(200).send({ message: "No todos found", data: [] });
    }
    res.status(200).send({
      message: "sorted Todos fetched successfully",
      data: sortedTodos,
    });
  } catch (error) {
    console.log("error while fetching sorted todos", error);
  }
});

import moment from "moment-timezone";

app.get("/user/todo/filter/:date", verifyToken, async (req, res) => {
  try {
    const selectedDate = req.params.date;
    console.log("Selected date (IST):", selectedDate);

    if (!selectedDate) {
      return res.status(400).send({ message: "Enter a valid date" });
    }

    // Convert the selected IST date to the UTC range
    const startOfDayUTC = moment
      .tz(selectedDate, "Asia/Kolkata")
      .startOf("day")
      .utc()
      .toDate();
    const endOfDayUTC = moment
      .tz(selectedDate, "Asia/Kolkata")
      .endOf("day")
      .utc()
      .toDate();

    console.log("Querying from:", startOfDayUTC, "to", endOfDayUTC);

    // Fetch todos within the UTC range
    const results = await Todo.find({
      author: req.id,
      isCompleted: false,
      isDeleted: false,
      createdAt: { $gte: startOfDayUTC, $lt: endOfDayUTC },
    }).sort({ createdAt: -1 });

    res
      .status(200)
      .send({ message: "Todos fetched successfully", data: results });
  } catch (error) {
    console.error("Filter error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get(
  "/user/todo/filter/:date/sort/:order",
  verifyToken,
  async function (req, res) {
    try {
      const selectedDate = req.params.date;
      let order = req.params.order;

      order = order === "asc" ? 1 : -1;

      if (!selectedDate) {
        return res.status(400).send({ message: "Enter a valid date" });
      }

      const startOfDayUTC = moment
        .tz(selectedDate, "Asia/Kolkata")
        .startOf("day")
        .utc()
        .toDate();
      const endOfDayUTC = moment
        .tz(selectedDate, "Asia/Kolkata")
        .endOf("day")
        .utc()
        .toDate();

      console.log(
        `Querying from ${startOfDayUTC} to ${endOfDayUTC}, Order: ${order}`
      );

      // Mongoose query to filter by date and sort by priority
      const results = await Todo.find({
        author: req.id,
        isCompleted: false,
        isDeleted: false,
        createdAt: { $gte: startOfDayUTC, $lt: endOfDayUTC },
      }).sort({ priority: order });

      if (results.length === 0) {
        return res.status(200).send({ message: "No todos found", data: [] });
      }

      res
        .status(200)
        .send({ message: "Todos fetched successfully", data: results });
    } catch (error) {
      console.error("Filter error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.put("/user/todo/:todoId", verifyToken, async function (req, res) {
  try {
    const todo = await Todo.findById(req.params.todoId);
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
    const istDate = new Date(now.getTime() + istOffset);
    todo.isCompleted = true;

    todo.completedAt = istDate;
    await todo.save();
    return res.status(200).send({ message: "todo marked as completed" });
  } catch (error) {
    console.log("error while marking todo as completed:" + error);
  }
});

app.delete("/user/todo/:todoId/delete", verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.todoId);
    todo.isDeleted = true;
    todo
      .save()
      .then(() => res.status(200).send({ message: "todo deletd successfully" }))
      .catch((err) => console.log(err));
  } catch (error) {
    console.log("error while deleting todo: ", error);
  }
});

app.get("/user/todo/complete", verifyToken, async (req, res) => {
  try {
    const completedTodos = await Todo.find({ isCompleted: true }).sort({
      completedAt: -1,
    });

    if (!completedTodos) {
      console.log("can not fetch completed todos");
    }

    if (completedTodos.length > 0) {
      res.status(200).send({
        message: "successfully fetch completed todos",
        data: completedTodos,
      });
    } else {
      res.status(200).send({ message: "no todos are completed yet", data: [] });
    }
  } catch (error) {
    console.log("errore while fetching completed todos:", error);
  }
});

// sending mail
app.post("/sendMail", async (req, res) => {
  const email = req.body.email;
  const dbUser = await User.findOne({ email: email });
  console.log(dbUser);
  if (dbUser) {
    const to = email;
    const subject = "Forgot Password";
    const password = generatePassword();
    const text = ` ${password} is the new password for you`;

    // adding new password to db
    const encryptedPassword = await getEncryptedPassword(password);
    dbUser.password = encryptedPassword;
    await dbUser.save();

    const success = await sendMail(to, subject, text);

    if (success) {
      res.status(200).send({ message: "email sent successfully" });
    } else {
      res.status(500).send({ message: " Error sending email." });
    }
  } else {
    res.status(404).send({ message: "User is not Registered." });
  }
});

app.get("*", (req, res) => {
  res.send("you have made request to wrong route!");
});
