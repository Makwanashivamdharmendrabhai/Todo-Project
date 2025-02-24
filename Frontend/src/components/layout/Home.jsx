import { useNavigate } from "react-router-dom";
export default function Home() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Welcome to Your Todo App
        </h1>
        <p className="text-gray-600 text-lg max-w-md">
          Stay organized and productive. Add, delete, mark as completed, sort,
          and filter your tasks effortlessly.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4">
        <button
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
          onClick={() => navigate("/signup")}
        >
          Sign Up
        </button>
        <button
          className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition"
          onClick={() => navigate("/login")}
        >
          Log In
        </button>
      </div>

      {/* Features Section */}
      <div className="mt-12 w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            📝 Add & Delete Tasks
          </h2>
          <p className="text-gray-600 mt-2">
            Easily add and remove tasks as you go.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            ✅ Mark as Completed
          </h2>
          <p className="text-gray-600 mt-2">
            Keep track of your progress by marking tasks done.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            🔍 Sort & Filter
          </h2>
          <p className="text-gray-600 mt-2">
            Organize tasks by date, priority, or status.
          </p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800">
            📅 Stay Productive
          </h2>
          <p className="text-gray-600 mt-2">
            Manage your tasks and boost productivity.
          </p>
        </div>
      </div>
    </div>
  );
}
