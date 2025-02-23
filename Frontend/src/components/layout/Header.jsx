import { useState } from "react";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleAuth = () => {
    setIsLoggedIn(!isLoggedIn);
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 text-white py-5 px-8 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-wide">
          🚀 Todo App
        </h1>

        <button
          onClick={handleAuth}
          className="px-6 py-2 text-lg font-semibold rounded-full shadow-md transition duration-300 
          bg-white text-indigo-700 hover:bg-gray-200 hover:scale-105 transform"
        >
          {isLoggedIn ? "Logout" : "Login"}
        </button>
      </div>
    </header>
  );
}

export default Header;
