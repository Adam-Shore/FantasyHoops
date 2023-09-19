import React, { useState, useEffect } from "react";
import "./TeamContainer.css"; // Import the original CSS file for styling


const TeamContainer = () => {
  const [yourPlayerData, setYourPlayerData] = useState([]);

  useEffect(() => {
    fetch("/db.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setYourPlayerData(data.yourPlayers);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Filter players by position
  const guards = yourPlayerData.filter((player) => player.position === "Guard");
  const forwards = yourPlayerData.filter((player) => player.position === "Forward");
  const centers = yourPlayerData.filter((player) => player.position === "Center");

  // Calculate the number of available slots for each category
  const maxSlots = 8;
  const maxGuards = Math.min(guards.length, 3);
  const maxForwards = Math.min(forwards.length, 3);
  const maxCenters = Math.min(centers.length, 2);

  const renderPlayerGrid = (yourPlayerData, maxSlots) => {
    return Array.from({ length: maxSlots }, (_, index) => {
      const player = yourPlayerData[index];
      return player ? (
        <div key={index} className="super-quirky-players-slot">
          <strong>Name:</strong> {player.name}, <strong>Points:</strong>{" "}
          {player.points}
        </div>
      ) : (
        <div key={index} className="super-quirky-emptys-slot"></div>
      );
    });
  };

  return (
    <div className="super-quirky-team-managements">
      <h1 className="super-quirky-team-management-titles">Your Team:</h1>
      <div className="super-quirky-grids-containers">
        <div className="super-quirky-grid-items super-quirky-grid-items-guards">
          <h2 className="super-quirky-grid-items-title">
            Guards (Slots: {maxGuards}/3)
          </h2>
          <div className="super-quirky-player-grids super-quirky-player-grid-guards">
            {renderPlayerGrid(guards, maxGuards)}
          </div>
        </div>
        <div className="super-quirky-grid-items super-quirky-grid-items-forwards">
          <h2 className="super-quirky-grid-items-title">
            Forwards (Slots: {maxForwards}/3)
          </h2>
          <div className="super-quirky-player-grids super-quirky-player-grid-forwards">
            {renderPlayerGrid(forwards, maxForwards)}
          </div>
        </div>
        <div className="super-quirky-grid-items super-quirky-grid-items-centers">
          <h2 className="super-quirky-grid-items-title">
            Centers (Slots: {maxCenters}/2)
          </h2>
          <div className="super-quirky-player-grids super-quirky-player-grid-centers">
            {renderPlayerGrid(centers, maxCenters)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamContainer;
