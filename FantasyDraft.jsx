import React from "react";
import "./FantasyDraft.css";
import { useState } from "react";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import TeamContainer from "./TeamContainer";
import PlayerFilter from "./PlayerFilter";



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
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [teamFilter, setTeamFilter] = useState("All");
  const [sortCategory, setSortCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [positionFilter, setPositionFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const handlePositionFilterChange = (selectedPosition) => {
    if (selectedPosition === "All") {
      setFilteredPlayers(playerData);
    } else {
      const filtered = playerData.filter((player) => player.position === selectedPosition);
      setFilteredPlayers(filtered);
    }
    setPositionFilter(selectedPosition); // Set the position filter state to the selected position
  };

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

  const handleFilterChange = (teamFilter) => {
    if (teamFilter === "All") {
      setFilteredPlayers(playerData);
    } else {
      const filtered = playerData.filter((player) => player.team === teamFilter);
      setFilteredPlayers(filtered);
    }
  };

  const handleSort = (category, order) => {
    setSortCategory(category);
    setSortOrder(order);

    if (category && order) {
      const sorted = filteredPlayers.slice().sort((a, b) => {
        if (order === "asc") {
          return a[category] - b[category];
        } else {
          return b[category] - a[category];
        }
      });
      setFilteredPlayers(sorted);
    }
  };

  let filteredPlayersBySearch = playerData.filter((player) =>
        player.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  useEffect(() => {
    // Apply team and position filter
    const applyFilter = () => {
      let filtered = playerData.slice(); // Make a copy of playerData to avoid mutating the original data

      if (teamFilter !== "All") {
        filtered = filtered.filter((player) => player.team === teamFilter);
      }

      if (positionFilter !== "All") {
        filtered = filtered.filter((player) => player.position === positionFilter);
      }

      // Apply search filter
      if (searchQuery.trim() !== "") {
        filtered = filtered.filter((player) =>
          player.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply sorting based on sortCategory and sortOrder
      if (sortCategory && sortOrder) {
        filtered.sort((a, b) => {
          if (sortOrder === "asc") {
            return a[sortCategory] - b[sortCategory];
          } else {
            return b[sortCategory] - a[sortCategory];
          }
        });
      }

      setFilteredPlayers(filtered);
    };

    applyFilter();
  }, [teamFilter, positionFilter, searchQuery, sortCategory, sortOrder, playerData]);


  useEffect(() => {
    // Apply sorting based on sortCategory and sortOrder
    if (sortCategory) {
      const sorted = filteredPlayers.slice().sort((a, b) => {
        if (sortOrder === "asc") {
          return a[sortCategory] - b[sortCategory];
        } else {
          return b[sortCategory] - a[sortCategory];
        }
      });
      setFilteredPlayers(sorted);
    }
  }, [sortCategory, sortOrder, filteredPlayers]);


  return (
    <div className="team-management">
      <h1>Welcome to the Draft!</h1>
      <TeamContainer />
      <h2>Available Players</h2>
      <PlayerFilter
        playerData={playerData}
        onFilterChange={setTeamFilter}
        onSortCategoryChange={setSortCategory}
        onSortOrderChange={setSortOrder}
        onSort={handleSort}
        onPositionFilterChange={handlePositionFilterChange}
        searchQuery={searchQuery} // Pass the searchQuery state as a prop
        onSearchQueryChange={setSearchQuery} // Pass the setSearchQuery function as a prop
      />
      <div className="scrollable-container">
        {filteredPlayers.map((player) => (
          <div key={player.id} className="player-info">
            <img src={player.imagelink} alt="" className="blank" />
            <div classname="right-stuff">
              <div className="player-header">
                <h3 className="player-header-1">{player.name}</h3>
                <p className="player-header-2">School: {player.team}</p>
                <p className="player-header-3">Pos: {player.position}</p>
              </div>
              <table className="player-table">
                <thead>
                  <tr>
                    <td>PTS</td>
                    <td>REB</td>
                    <td>AST</td>
                    <td>STL</td>
                    <td>BLK</td>
                    <td>GP</td>
                    <td>MIN</td>
                    <td>FGM</td>
                    <td>FGA</td>
                    <td>FG%</td>
                    <td>3PM</td>
                    <td>3PA</td>
                    <td>3P%</td>
                    <td>FTM</td>
                    <td>FTA</td>
                    <td>FT%</td>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{player.points_per_game}</td>
                    <td>{player.rebounds_per_game}</td>
                    <td>{player.assists_per_game}</td>
                    <td>{player.steals_per_game}</td>
                    <td>{player.blocks_per_game}</td>
                    <td>{player.games_played}</td>
                    <td>{player.minutes_per_game}</td>
                    <td>{player.field_goals_made_per_game}</td>
                    <td>{player.field_goals_attempted_per_game}</td>
                    <td>{player.field_goal_percentage}</td>
                    <td>{player.three_pointers_made_per_game}</td>
                    <td>{player.three_pointers_attempted_per_game}</td>
                    <td>{player.three_point_percentage}</td>
                    <td>{player.free_throws_made_per_game}</td>
                    <td>{player.free_throws_attempted_per_game}</td>
                    <td>{player.free_throw_percentage}</td>
                  </tr>
                </tbody>
              </table>
              <div className="draft-button-section">
                <button className="draft-button" onClick={() => handleDraftPlayer(player.id)}>
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
