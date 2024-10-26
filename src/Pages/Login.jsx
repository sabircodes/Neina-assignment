// src/pages/Login.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';

const Login = () => {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' }); // Change to username only

  const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Logging in with credentials:', credentials); // Log credentials for debugging
  
    try {
      const response = await fetch('http://localhost:7000/api/auth/v1/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
  
      // Log the status and response for debugging
      console.log('Response status:', response.status);
      const responseBody = await response.json();
      console.log('Response body:', responseBody); // Log the response body
  
      if (!response.ok) {
        console.error('Login failed:', responseBody.message || 'Unknown error');
        return;
      }
  
      // Extract user and token from the response
      const { data: user, token } = responseBody; // Adjusted destructuring
  
      // Save the token to local storage and set user context
      localStorage.setItem('token', token);
      setUser(user); // Set user details in context
      navigate('/'); // Redirect to home on successful login
    } catch (error) {
      console.error('Error during login:', error);
    }
  };
  

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 rounded shadow-md">
        <h2 className="text-xl font-semibold">Login</h2>
        <input
          name="username" // Change to username
          placeholder="Username"
          value={credentials.username} // Change to username
          onChange={handleChange}
          className="border rounded p-2 w-full"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={credentials.password}
          onChange={handleChange}
          className="border rounded p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">Login</button>
      </form>
    </div>
  );
};

export default Login;
