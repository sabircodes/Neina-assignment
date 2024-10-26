// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Register from './Pages/Register';
import Login from './Pages/Login';
import Home from './Pages/Home';
import LeaderBoard from './Pages/LeaderBoard';
import Navbar from './components/Navbar';
import { UserProvider } from './contexts/UserContext';
function App() {
  return (
    <Router>
  <UserProvider>  
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/leaderboard" element={<LeaderBoard />} />
      </Routes>
    </UserProvider>
    </Router>
  );
}

export default App;
