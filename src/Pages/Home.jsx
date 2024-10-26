// src/pages/Home.js
import { useState, useEffect, useContext } from 'react';
import { Modal, Box, Typography, Button, CircularProgress, LinearProgress } from '@mui/material';
import LeaderBoard from './LeaderBoard';
import { UserContext } from '../contexts/UserContext';
import Weeks from '../components/Weeks';

const Home = () => {
  const [friends, setFriends] = useState([]);
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState({ name: '', email: '' });
  const [history, setHistory] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingModalOpen, setLoadingModalOpen] = useState(false);
  const handleClose = () => setModalOpen(false);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetch('http://localhost:7000/api/user/v1/get-users', {
          method: 'GET',
        });
        const data = await response.json();
        console.log(data);
        setFriends(data.data.sort((a, b) => b.Points - a.Points).slice(0, 10) || []);
      } catch (error) {
        console.error('Error fetching friends:', error);
      }
    };

    fetchFriends();

    const interval = setInterval(() => {
      fetchFriends();
    }, 2000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const claimPoints = async (username) => {
   
    try {
        setLoadingModalOpen(true);
        const response = await fetch(`http://localhost:7000/api/user/v1/claim-points`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username }), // Send username; Points will be handled on the backend
        });

        if (response.ok) {
            const data = await response.json(); // Get the updated user data from the response
            setLoadingModalOpen(false);
            // Update the state with the new user data after claiming points
            setFriends(prevFriends =>
                prevFriends.map(friend =>
                    friend.username === username ? { ...friend, Points: data.data.Points } : friend
                )
            );
            console.log(`${data.data.Points} points claimed successfully!`);
        } else {
            console.error('Failed to update points');
        }
    } catch (error) {
        console.error('Error updating points:', error);
    }
};


const showHistory = async (username) => {
    try {
      const response = await fetch('http://localhost:7000/api/user/v1/your-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) throw new Error('Failed to fetch history');

      const data = await response.json();
      console.log("Fetched history data:", data.data); // Debug: check structure of data.data
      setHistory(data.data); // Set history to data.data
      setModalOpen(true);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleSvgClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col my-40 mx-80 bg-white ">
      {/* blue part */}
      <div className="w-full  bg-blue-600 flex justify-around">{
          <div className='w-full'>{user&&(
              <div className="flex flex-col gap-2 m-5 text-white font-medium ">
                  <div>{user.Points} Today</div>
                  <div>₹ {user.Points} </div>
              </div>
          )}</div>
          
      }
      <div className="flex gap-2 my-4 w-full justify-end p-2 items-center">
          <h2>Leader Board</h2>
          <div className='cursor-pointer' onClick={() => setIsModalOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>

          </div>
      </div>
      
      </div>
  {/* dail weekl wal part */}
      <div>
          <Weeks/>
      </div>
      <LeaderBoard/>
       
        <ul className="p-5">
          {friends.map((friend,index) => (
            <div key={friend._id} className="flex justify-between p-2  hover:bg-gray-300 "  >
                  <div className="flex justify-center items-center gap-4">
                  <div >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6" onClick={() => handleSvgClick(friend)}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
  </svg>

                  </div>
                  <div className='flex flex-col'>
                
                 <div className='cursor-pointer' onClick={()=>showHistory(friend.username)}>{friend.firstName}</div> 
                 <div>  Rank:{index+1}</div> 
                 </div>
                  </div>


                  <div className='flex text-center text-orange-500 '> prize: ₹{friend.Points} </div>
              <div >
              <button onClick={() => claimPoints(friend.username)} className="text-green-700 pr-8" >
               {friend.Points}
              </button>
              </div>
            </div>
          ))}
        </ul>
{/* modal for user info */}
        <Modal open={isModalOpen} onClose={closeModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
            <Typography variant="h6" component="h2" >
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography sx={{ mt: 2 }}>
              {user?.email}
            </Typography>
            <Button onClick={closeModal}>Close</Button>
          </Box>
        </Modal>

    {/* modal for history  */}

    <Modal open={modalOpen} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            height: 500,
            maxHeight:'80vh',
            overflowY:'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
         <button onClick={handleClose} className="mt-2 bg-blue-500 text-white px-2 py-1 ">
            Close
          </button>
          <Typography variant="h6" component="h2">
            Points History
          </Typography>
          {history && history.length ? (
            history.map((item, index) => (
              <Typography key={index}>{`Points Awarded: ${item.pointsAwarded}, Date: ${item.date}`}</Typography>
            ))
          ) : (
            <Typography>No history available.</Typography>
          )}
         
        </Box>
      </Modal>


{/* loading modal */}
<Modal open={loadingModalOpen} onClose={() => setLoadingModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '10%', right: '0%', width: 300,  background:'white' ,border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography variant="h6" component="h2">
            Claiming Point...
          </Typography>
          <LinearProgress sx={{ mt: 2, bgcolor: 'green',position: 'relative',bottom:'0'}} />
        </Box>
      </Modal>




      </div>
  );
};

export default Home;
