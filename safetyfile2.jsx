import React from "react";
import "./FantasyDraft.css";
import {useState} from "react";
import {useEffect} from "react";
import { createRoot } from "react-dom/client";
import TeamContainer from "./TeamContainer";



const yourPlayerData = [
  { id: 1, name: "Player 1", position: "Guard", points: 50 },
  { id: 2, name: "Player 2", position: "Guard", points: 55 },
  { id: 3, name: "Player 3", position: "Forward", points: 45 },
  { id: 4, name: "Player 4", position: "Forward", points: 60 },
  { id: 5, name: "Player 5", position: "Center", points: 70 },
  { id: 6, name: "Player 6", position: "Guard", points: 58 },
  { id: 7, name: "Player 7", position: "Guard", points: 53 },
  { id: 8, name: "Player 8", position: "Forward", points: 48 },
  { id: 9, name: "Player 9", position: "Forward", points: 52 },
];


const FantasyDraft = () => {
  const [playerData, setPlayerData] = useState([]);

  const guards = yourPlayerData.filter((player) => player.position === "Guard");
  const forwards = yourPlayerData.filter((player) => player.position === "Forward");
  const centers = yourPlayerData.filter((player) => player.position === "Center");
  
  const maxSlots = 8;
  const maxGuards = Math.min(guards.length, 3);
  const maxForwards = Math.min(forwards.length, 3);
  const maxCenters = Math.min(centers.length, 2);

  useEffect(() => {
    fetch("/output.json")
      .then((res) => res.json())
      .then((data) => {
        setPlayerData(data.PlayerData); // Access the 'players' array from the fetched JSON data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []); // Empty dependency array to fetch data only once on component mount

  const handleDraftPlayer = (playerId) => {
    // Implement your draft logic here
    console.log(`Player with ID ${playerId} drafted!`);
  };

  return (
    <div className="team-management">
      <h1>Welcome to the Draft!</h1>
      <TeamContainer />

      <h2>Available Players</h2>
      <div className="scrollable-container">
        {playerData.map((player) => (
          <div key={player.id} className="player-grid">
            <div className="player-slot">
              <div className="left-section">
                <h3>{player.name}</h3>
                <p className="player-team-attribute">Team: {player.team}</p>
                <p className="player-position-attribute">Position: {player.position}</p>
              </div>
              <div className="middle-section">
                <p className="player-points-attribute">Points Per Game: {player.points_per_game}</p>
                <p className="player-rebounds-attribute">Rebounds Per Game: {player.rebounds_per_game}</p>
                <p className="player-assists-attribute">Assists Per Game: {player.assists_per_game}</p>
                <p className="player-steals-attribute">Steals Per Game: {player.steals_per_game}</p>
                <p className="player-blocks-attribute">Blocks Per Game: {player.blocks_per_game}</p>
              </div>
              <div className="right-section">
                <p className="player-gamesplayed-attribute">Games Played: {player.games_played}</p>
                <p className="player-minutes-attribute">Minutes Per Game: {player.minutes_per_game}</p>
                <p className="player-fgmade-attribute">FG Made Per Game: {player.field_goals_made_per_game}</p>
                <p className="player-fga-attribute">FG Attempted Per Game: {player.field_goals_attempted_per_game}</p>
                <p className="player-fgp-attribute">FG%: {player.field_goal_percentage}</p>
                <p className="player-3pmade-attribute">3PTS Made Per Game: {player.three_pointers_made_per_game}</p>
                <p className="player-3pa-attribute">3PTS Attempted Per Game: {player.three_pointers_attempted_per_game}</p>
                <p className="player-3pp-attribute">3PTS%: {player.three_point_percentage}</p>
                <p className="player-ftmade-attribute">FT Made Per Game: {player.free_throws_made_per_game}</p>
                <p className="player-fta-attribute">FT Attempted Per Game: {player.free_throws_attempted_per_game}</p>
                <p className="player-ftp-attribute">FT%: {player.free_throw_percentage}</p>
              </div>
              <div className="draft-button-section">
                <button
                  className="draft-button"
                  onClick={() => handleDraftPlayer(player.id)}
                >
                  Draft
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default FantasyDraft;
