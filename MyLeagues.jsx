import React, { useState } from "react";
import "./MyLeagues.css";

const MyLeagues = () => {
  const [joinedLeagues, setJoinedLeagues] = useState([]);

  const leaguesArray = [
    { name: "League A", passcode: "1234" },
    { name: "League B", passcode: "5678" },
    { name: "League C", passcode: "1234" },
    { name: "League D", passcode: "5678" },
    // Add more leagues as needed for testing
  ];

  const handleJoinLeague = (e) => {
    e.preventDefault();
    const leagueName = e.target.leagueName.value;
    const passcode = e.target.passcode.value;

    // Check if the entered league name and passcode match any existing league
    const matchingLeague = leaguesArray.find(
      (league) => league.name === leagueName && league.passcode === passcode
    );

    if (matchingLeague) {
      // Add the league to the list of joined leagues
      setJoinedLeagues((prevLeagues) => [...prevLeagues, matchingLeague]);
      // Clear the form inputs after successful join
      e.target.reset();
    } else {
      alert("Invalid league name or passcode. Please try again.");
    }
  };

  return (
    <div className="MyLeagues">
      {/* Left side (My Leagues) */}
      <div className="left-side">
        <h1>My Leagues</h1>
        {/* Display joined leagues */}
        {joinedLeagues.length === 0 ? (
          <p>No leagues joined yet.</p>
        ) : (
            <div className="league-buttons">
            {joinedLeagues.map((league) => (
              <button key={league.name} className="league-button">
                {league.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right side (Join League Form) */}
      <div className="right-side">
        <h1>Join League</h1>
        {/* Join League Form */}
        <form onSubmit={handleJoinLeague}>
          <label>
            League Name:
            <input type="text" name="leagueName" required />
          </label>
          <label>
            Passcode:
            <input type="password" name="passcode" required />
          </label>
          <button type="submit">Join League</button>
        </form>
      </div>
    </div>
  );
};


export default MyLeagues;
