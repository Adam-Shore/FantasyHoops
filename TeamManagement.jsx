import React from "react";
import "./TeamManagement.css"; // Import the CSS file for styling
import { useState, useEffect } from "react";


const TeamManagement = () => {
  const [playerData, setplayerData] = useState([]);

  // Fetch data from API
  useEffect(() => {
    fetch("/db.json")
      .then((res) => res.json())
      .then((data) => {
        setplayerData(data.yourPlayers); // Access the 'players' array from the fetched JSON data
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Filter players by position
  const guards = playerData.filter((player) => player.position === "Guard");
  const forwards = playerData.filter((player) => player.position === "Forward");
  const centers = playerData.filter((player) => player.position === "Center");

  // Calculate the number of available slots for each category
  const maxSlots = 8;
  const maxGuards = Math.min(guards.length, 3);
  const maxForwards = Math.min(forwards.length, 3);
  const maxCenters = Math.min(centers.length, 2);

  const renderPlayerGrid = (playerData, maxSlots) => {
    return Array.from({ length: maxSlots }, (_, index) => {
      const player = playerData[index];
      return player ? (
        <div key={index} className="super-unique-players-slot">
          <strong>Name:</strong> {player.name}, <strong>Points:</strong>{" "}
          {player.points}
        </div>
      ) : (
        <div key={index} className="super-unique-emptys-slot"></div>
      );
    });
  };

  return (
    <div className="super-unique-team-managements">
      <h1 className="super-unique-team-management-titles">Welcome to the Team Management!</h1>
      <div className="super-unique-grids-containers">
        <div className="super-unique-grid-items super-unique-grid-items-guards">
          <h2 className="super-unique-grid-items-title">Guards (Slots: {maxGuards}/3)</h2>
          <div className="super-unique-player-grids super-unique-player-grid-guards">
            {renderPlayerGrid(guards, maxGuards)}
          </div>
        </div>
        <div className="super-unique-grid-items super-unique-grid-items-forwards">
          <h2 className="super-unique-grid-items-title">Forwards (Slots: {maxForwards}/3)</h2>
          <div className="super-unique-player-grids super-unique-player-grid-forwards">
            {renderPlayerGrid(forwards, maxForwards)}
          </div>
        </div>
        <div className="super-unique-grid-items super-unique-grid-items-centers">
          <h2 className="super-unique-grid-items-title">Centers (Slots: {maxCenters}/2)</h2>
          <div className="super-unique-player-grids super-unique-player-grid-centers">
            {renderPlayerGrid(centers, maxCenters)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamManagement;
