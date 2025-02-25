import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";

function ForgetPass() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const [flag, setFlag] = useState(false);
  const [serverError, setServerError] = useState("");

  const onSubmit = async (data) => {
    setServerError(""); // Reset server error message
    setFlag(false);

    try {
      const result = await axios.post("http://localhost:3000/sendMail", data);

      if (result.status === 200) {
        setFlag(true);
        reset(); // Clear input after successful submission
      } else {
        setServerError(result.data.message);
      }
    } catch (err) {
      setServerError("Failed to send email. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-600 font-medium mb-1"
            >
              Enter your registered email
            </label>
            <input
              type="email"
              id="email"
              placeholder="example@mail.com"
              {...register("email", {
                required: "Email is required!",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {serverError && <p className="text-red-500 text-sm">{serverError}</p>}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending Email..." : "Send Email"}
          </button>
        </form>

        {flag && (
          <h2 className="text-green-600 text-sm text-center mt-4">
            A new password has been sent to your registered email address.
          </h2>
        )}

        <Link
          to="/login"
          className="block text-center text-black-500  mt-4"
        >
          ← Back to Login
        </Link>
      </div>
    </div>
  );
}

export default ForgetPass;
