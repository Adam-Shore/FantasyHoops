import React from 'react';
import Header from "./Header.jsx";
// import GameScores from './GameScores';
// import TopPlayers from './TopPlayers';
// import News from './News';
import LoginForm from "./LoginForm";
import { UserProvider } from './UserContext';


const Home = () => {
  return (
    <div className="Home">
      <Header />
      <h1>Welcome to the home page!</h1>
      <img src="illillillill.jpg" alt="article" className="articlenews" />
    </div>
  );
};

export default Home;
