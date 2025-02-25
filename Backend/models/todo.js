import mongoose from "mongoose";
const { Schema } = mongoose;

// Helper function to get the current time in IST
const getISTTime = () => {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC +5:30
  return new Date(now.getTime() + istOffset);
};

const todoSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 5, // Fix typo from "defalut"
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: getISTTime, // Stores IST time by default
  },
  createdAt: {
    type: Date,
    default: getISTTime, // Stores IST time by default
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
