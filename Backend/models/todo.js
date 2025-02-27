import mongoose from "mongoose";
const { Schema } = mongoose;

const todoSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
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
    default: Date.now, // Stores UTC (✅ Correct)
  },
  createdAt: {
    type: Date,
    default: Date.now, // Stores UTC (✅ Correct)
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});


const Todo = mongoose.model("Todo", todoSchema);
export default Todo;
