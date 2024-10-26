// src/components/Navbar.js
import { useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
 

  return (
    <nav className="p-4 bg-gray-900 text-white flex gap-12 py-4">
      <Link to={"/login"} className="text-xl">Login</Link>
      <Link to={"/register"} className="text-xl">Register</Link>
      <Link to={"/" }className="text-xl">Home</Link>
      <Link to={"/"} className="text-xl">pop-up</Link>
    </nav>
  );
};

export default Navbar;
