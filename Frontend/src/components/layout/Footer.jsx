
function Footer() {
  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-300 py-6 px-6 text-center shadow-inner">
      <div className="container mx-auto">
        <p className="text-lg font-semibold">🌟 Stay Organized, Stay Productive!</p>
        
        <div className="flex justify-center space-x-6 mt-3">
          <a href="#" className="hover:text-white transition">About</a>
          <a href="#" className="hover:text-white transition">Contact</a>
          <a href="#" className="hover:text-white transition">Privacy Policy</a>
        </div>

        <div className="mt-4 flex justify-center space-x-4">
          <a href="#" className="text-blue-400 hover:text-blue-500 transition">
            <i className="fab fa-facebook text-2xl"></i>
          </a>
          <a href="#" className="text-pink-400 hover:text-pink-500 transition">
            <i className="fab fa-instagram text-2xl"></i>
          </a>
          <a href="#" className="text-blue-300 hover:text-blue-400 transition">
            <i className="fab fa-twitter text-2xl"></i>
          </a>
        </div>

        <p className="mt-4 text-sm">© {new Date().getFullYear()} Todo App | Built with ❤️ by You</p>
      </div>
    </footer>
  );
}

export default Footer;
