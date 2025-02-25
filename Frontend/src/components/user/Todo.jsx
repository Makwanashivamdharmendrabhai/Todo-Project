import { useState } from "react";
import axios from "axios";

function Todo({ todos, setFlag, selectedOption, setTodos, date }) {
  async function handleCheckChange(todo) {
    const todoId = todo._id;
    const result = await axios.put(
      `http://localhost:3000/user/todo/${todoId}`,
      {},
      {
        withCredentials: true,
      }
    );
    let url = "";
    if (result.status === 200) {
      if (selectedOption) {
        if (date) {
          url = `http://localhost:3000/user/todo/filter/${date}/sort/${selectedOption}`;
        } else {
          url = `http://localhost:3000/user/todo/sort/${selectedOption}`;
        }
      } else {
        if (date) {
          url = `http://localhost:3000/user/todo/filter/${date}`;
        } else {
          setFlag((prev) => !prev);
          return;
        }
      }
      const res = await axios.get(url, {
        withCredentials: true,
      });
      setTodos(res.data.data);
    }
  }

  async function handleDelete(todo) {
    const todoId = todo._id;
    const result = await axios.delete(
      `http://localhost:3000/user/todo/${todoId}/delete`,
      {
        withCredentials: true,
      }
    );
    let url = "";
    if (result.status === 200) {
      if (selectedOption) {
        if (date) {
          url = `http://localhost:3000/user/todo/filter/${date}/sort/${selectedOption}`;
        } else {
          url = `http://localhost:3000/user/todo/sort/${selectedOption}`;
        }
      } else {
        if (date) {
          url = `http://localhost:3000/user/todo/filter/${date}`;
        } else {
          setFlag((prev) => !prev);
          return;
        }
      }
      const res = await axios.get(url, {
        withCredentials: true,
      });
      setTodos(res.data.data);
    }
  }
  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        My Todos
      </h1>
      {todos.length > 0 ? (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="p-3 bg-blue-100 text-gray-800 rounded-lg shadow-sm flex items-center justify-between"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={todo.isCompleted}
                onChange={() => handleCheckChange(todo)}
                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
              />

              {/* Todo Text */}
              <span
                className={`text-lg flex-grow mx-3 ${
                  todo.isCompleted ? "line-through text-gray-500" : ""
                }`}
              >
                {todo.text}
              </span>

              {/* Priority (Larger & Styled) */}
              <span className="text-lg font-bold text-white bg-blue-600 px-3 py-1 rounded-md mr-3">
                {todo.priority}
              </span>

              {/* Delete Button */}
              <button
                className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => handleDelete(todo)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center">No todos available.</p>
      )}
    </div>
  );
}

export default Todo;
