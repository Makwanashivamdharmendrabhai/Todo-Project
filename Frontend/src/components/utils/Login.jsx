import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [check, setCheck] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleCheckChange = (e) => {
    setCheck((prev) => !prev);
  };

  const signin = async (data) => {
    console.log("Form Data:", data);
    try {
      const response = await axios.post(
        "http://localhost:3000/user/signin",
        data,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        navigate("/user")
      } else {
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          Log In
        </h2>
        <form onSubmit={handleSubmit(signin)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-gray-600 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter like hello123@gmail.com"
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

          <div>
            <label
              htmlFor="password"
              className="block text-gray-600 font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                {...register("password", {
                  required: "Password is required!",
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/,
                    message:
                      "Password must be at least 8 characters long, including uppercase letters, numbers, and special characters.",
                  },
                })}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              />

              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-2 text-gray-600"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Link to="#">Forget Password</Link>
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Remember me</label>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Login"}
          </button>
        </form>
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?
          <Link
            to="http://localhost:5173/signup"
            className="text-blue-500 hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
