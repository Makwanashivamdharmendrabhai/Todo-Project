import React, { useState, useEffect } from "react";
import axios from "axios";
import InputForm from "./InputForm";
import Todo from "./Todo";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function User() {
  const [flag, setFlag] = useState(false);
  const [todos, setTodos] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [date, setDate] = useState("");
  let url = "";
  const authStatus = useSelector((state) => state.auth.status);

  const handleSelect = async (option) => {
    if (selectedOption === option) {
      setSelectedOption("");
      url = date ? `http://localhost:3000/user/todo/filter/${date}` : null;
    } else {
      url = date
        ? `http://localhost:3000/user/todo/filter/${date}/sort/${option}`
        : `http://localhost:3000/user/todo/sort/${option}`;

      setSelectedOption(option);
    }
    if (url) {
      const result = await axios.get(url, {
        withCredentials: true,
      });
      setTodos(result.data.data);
    } else {
      setFlag((prev) => !prev);
      return;
    }
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    if (date) {
      if (selectedOption)
        url = `http://localhost:3000/user/todo/filter/${date}/sort/${selectedOption}`;
      else url = `http://localhost:3000/user/todo/filter/${date}`;
      setDate(date);
    } else {
      if (selectedOption)
        url = `http://localhost:3000/user/todo/sort/${selectedOption}`;
      else {
        setFlag((prev)=>!prev);
        return;
      };
      setDate("");
    }
    const result = await axios.get(url, {
      withCredentials: true,
    });
    console.log("result of filter on sort" + result.data.data);
    setTodos(result.data.data);
  };

  useEffect(() => {
    async function fetchTodos() {
      try {
        const result = await axios.get("http://localhost:3000/user/todo/all", {
          withCredentials: true,
        });
        setTodos(result.data.data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }
    fetchTodos();
    console.log(authStatus);
  }, [flag]);

  return (
    <>
      <header className="w-full py-4 px-6 flex justify-between items-center">
        {/* Completed Todos Button */}
        <div>
          <Link
            to="/user/complete"
            className="text-lg font-medium bg-gray-200 text-gray-800 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300 transition"
          >
            Show Completed Todos
          </Link>
        </div>
        <div className="flex gap-4 mt-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedOption === "asc"}
              onChange={() => handleSelect("asc")}
              className="w-5 h-5 accent-blue-600"
            />
            <span
              className={
                selectedOption === "asc" ? "text-blue-600" : "text-gray-600"
              }
            >
              Sort Asc
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedOption === "desc"}
              onChange={() => handleSelect("desc")}
              className="w-5 h-5 accent-blue-600"
            />
            <span
              className={
                selectedOption === "desc" ? "text-blue-600" : "text-gray-600"
              }
            >
              Sort Desc
            </span>
          </label>
        </div>

        <div className="p-4">
          <label className="block text-lg font-medium mb-2">
            Select a Date:
          </label>
          <input
            type="date"
            value={date}
            onChange={handleDateChange}
            className="border rounded-lg p-2 w-full"
          />
          {date && <p className="mt-2 text-gray-700">Selected Date: {date}</p>}
        </div>
      </header>

      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-10">
        {/* Input Form - Full Width */}
        <div className="w-full max-w-2xl">
          <InputForm
            setFlag={setFlag}
            selectedOption={selectedOption}
            setTodos={setTodos}
          />
        </div>

        {/* Space between InputForm and Todo */}
        <div className="h-6"></div>

        {/* Todo List - Full Width */}
        <div className="w-full max-w-2xl">
          <Todo
            todos={todos}
            setFlag={setFlag}
            selectedOption={selectedOption}
            setTodos={setTodos}
            date={date}
          />
        </div>
      </div>
    </>
  );
}

export default User;
