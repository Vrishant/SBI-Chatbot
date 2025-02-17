import React from 'react';
import Chatbot from '../components/chatbot';
import SBI1 from '../assets/SBI1.jpg'; 



const Home = () => {
  return (
    <div>
        <div style={{
        backgroundImage: `url(${SBI1})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        fontSize: '2rem',
        textAlign: 'center',
        }}>
        </div>
      <Chatbot />
    </div>
  );
};

export default Home;