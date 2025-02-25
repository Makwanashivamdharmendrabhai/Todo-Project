import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
function Complete() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    async function fetchCompletedTodos() {
      try {
        const result = await axios.get(
          "http://localhost:3000/user/todo/complete",
          { withCredentials: true }
        );
        setTodos(result.data.data);
      } catch (error) {
        console.error("Error fetching completed todos:", error);
      }
    }
    fetchCompletedTodos();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6 mt-4">
      <h1 className="text-3xl font-bold bg-white text-white py-3 px-6 flex items-center justify-between w-full">
        {/* Back Button at Extreme Left */}
        <div>
          <Link
            to="/user/dashboard"
            className="text-sm flex items-center bg-gray-600 text-white px-2 py-1 rounded-md shadow hover:bg-gray-500 transition"
          >
            ⬅️ Back
          </Link>
        </div>

        {/* Centered Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 bg-gray-800 py-1 px-6 rounded-lg shadow-md">
          <span>Completed Tasks ✅</span>
        </div>
      </h1>

      {todos.length === 0 ? (
        <h2 className="text-lg text-gray-600 mt-4">No Todos Are Completed</h2>
      ) : (
        <ul className="mt-4 w-full max-w-lg">
          {todos.map((todo) => (
            <li
              key={todo._id}
              className="bg-white shadow-lg rounded-lg p-4 my-2 flex items-center justify-between transition-transform transform hover:scale-105"
            >
              <span className="text-gray-800 text-lg font-medium">
                {todo.text}
              </span>
              <span className="text-green-600 font-semibold">✔</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Complete;
