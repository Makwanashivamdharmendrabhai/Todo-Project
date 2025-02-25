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

app.post("/user/signin", async (req, res) => {
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

// todo routes
app.post("/user/todo/new", verifyToken, async (req, res) => {
  try {
    const todoData = req.body;

    // Fetching user ID from the verified token
    const userId = req.id;
    todoData.author = userId;

    // Fetching the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Creating a new todo
    const todo = new Todo(todoData);
    const savedTodo = await todo.save(); // Save todo first

    // Add todo ID to the user's todos array
    user.todos.push(savedTodo._id);
    await user.save(); // Save the updated user

    res
      .status(201)
      .send({ message: "Successfully saved to database", data: savedTodo });
  } catch (error) {
    console.error("Error while adding todo to database:", error);
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

app.get("/user/todo/filter/:date", verifyToken, async (req, res) => {
  try {
    const selectedDate = req.params.date; // User-selected date
    console.log("Selected date: " + selectedDate);
    if (!selectedDate) {
      res.status(404).send("enter valid date");
      return;
    }
    const startOfDay = new Date(selectedDate);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day

    // Mongoose query
    const results = await Todo.find({
      author: req.id,
      isCompleted: false,
      isDeleted: false,
      createdAt: {
        $gte: startOfDay, // Start of the selected date
        $lt: endOfDay, // End of the selected date
      },
    });
    res.status(200).send({message:"todos fetched successfully",data:results});
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
      const selectedDate = req.params.date; // User-selected date
      let order = req.params.order;
      if (order === "asc") order = 1;
      else order = -1;

      if (!selectedDate) {
        res.status(404).send("enter valid date");
        return;
      }
      const startOfDay = new Date(selectedDate);
      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999); // Set to the end of the day

      // Mongoose query
      const results = await Todo.find({
        author: req.id,
        isCompleted: false,
        isDeleted: false,
        createdAt: {
          $gte: startOfDay, // Start of the selected date
          $lt: endOfDay, // End of the selected date
        },
      }).sort({ priority: order });

      if (results.length == 0) {
        res.send("no todos found");
        return;
      }

      console.log("results: " + results);
      res.status(200).send({message:"todos fetched successfully",data:results});
    } catch (error) {
      console.error("Filter error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

app.put("/user/todo/:todoId", verifyToken, async function (req, res) {
  try {
    const todo = await Todo.findById(req.params.todoId);
    todo.isCompleted = true;
    todo.completedAt = Date.now();
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
