import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

function InputForm({ setFlag, selectedOption, setTodos }) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const add = async (data) => {
    try {
      const result = await axios.post(
        "http://localhost:3000/user/todo/new",
        data,
        {
          withCredentials: true,
        }
      );
      if (selectedOption) {
        try {
          const result = await axios.get(
            `http://localhost:3000/user/todo/sort/${selectedOption}`,
            {
              withCredentials: true,
            }
          );
          setTodos(result.data.data);
        } catch (error) {
          console.log("error while fetching sorted todos : " + error);
        }
      } else {
        setFlag((prev) => !prev);
      }
      if (result.status == 201) {
        reset();
      } else {
        console.log("fail to add ");
      }
    } catch (error) {
      console.log("error while adding :" + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-4">
      {" "}
      {/* Reduced padding */}
      <form
        onSubmit={handleSubmit(add)}
        className="bg-white p-4 shadow-lg rounded-lg w-full max-w-md"
      >
        {/* Input and Button in same row */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            {...register("text", { required: "Text is required" })}
            placeholder="Enter your text ..."
            className="flex-grow p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-900 text-white rounded-md shadow-md hover:bg-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "...Submitting" : "Add "}
          </button>
        </div>

        {/* Error Message */}
        {errors.text && (
          <p className="text-red-500 mt-1">{errors.text.message}</p>
        )}

        {/* Priority Slider */}
        <div className="mt-4">
          <label htmlFor="priority" className="block text-gray-600">
            <b> Priority: {watch("priority", 3)}</b>
          </label>
          <input
            type="range"
            id="priority"
            {...register("priority")}
            min="1"
            max="5"
            defaultValue="3"
            className="w-full"
          />
        </div>
      </form>
    </div>
  );
}

export default InputForm;
