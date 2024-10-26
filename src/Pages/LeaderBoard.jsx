import { useState, useEffect } from 'react';
import { Modal, Box, Typography } from '@mui/material';

const LeaderBoard = () => {
  const [leaders, setLeaders] = useState([]);
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchLeaders = async () => {
    try {
      const response = await fetch('http://localhost:7000/api/user/v1/get-users', { method: 'GET' });
      if (!response.ok) throw new Error('Failed to fetch leaders');

      const data = await response.json();
      setLeaders(data.data.sort((a, b) => b.Points - a.Points).slice(0, 3));
    } catch (error) {
      setError(error.message);
      console.error('Error fetching leaders:', error);
    }
  };

  useEffect(() => {
    fetchLeaders();

    const interval = setInterval(() => {
      fetchLeaders();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

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

  const handleClose = () => setModalOpen(false);

  return (
    <div className="">
      <div className="flex justify-around text-center py-10">
        {leaders.map((leader) => (
          <div key={leader._id} onClick={() => showHistory(leader.username)} className="flex cursor-pointer">
            <div className="flex flex-col">
              <div className="font-normal text-black">{leader.firstName}</div>
              <div className="text-thin text-black">{leader.Points}</div>
              <div className="text-thin text-orange-500">Prize:₹  {leader.Points}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for displaying history */}
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
    </div>
  );
};

export default LeaderBoard;
