import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../../../store/authSlice";
import { FiLogOut, FiTrash2 } from "react-icons/fi"; // Import icons

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const result = await axios.post(
      "http://localhost:3000/user/logout",
      {},
      { withCredentials: true }
    );
    if (result.status === 200) {
      dispatch(logout());
      navigate("/");
    }
  };

  const handleDelete = async () => {
    const result = await axios.delete("http://localhost:3000/user/delete", {
      withCredentials: true,
    });
    if (result.status === 200) {
      navigate("/");
    }
  };

  return (
    <header className="bg-gradient-to-r from-indigo-700 via-purple-600 to-pink-500 text-white py-5 px-8 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* App Title */}
        <h1 className="text-3xl font-extrabold tracking-wide">🚀 Todo App</h1>

        {/* Buttons Container */}
        <div className="flex gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-2 text-lg font-semibold rounded-full shadow-md transition duration-300 
            bg-white text-indigo-700 hover:bg-gray-200 hover:scale-105 transform"
          >
            <FiLogOut className="text-xl" /> Logout
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-6 py-2 text-lg font-semibold rounded-full shadow-md transition duration-300 
            bg-red-600 text-white hover:bg-red-700 hover:scale-105 transform"
          >
            <FiTrash2 className="text-xl" /> Delete Account
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
