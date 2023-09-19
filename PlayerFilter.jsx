import React, { useState } from "react";
import "./PlayerFilter.css";

const PlayerFilter = ({ playerData, onFilterChange, onSort, onPositionFilterChange }) => {
  const [teamFilter, setTeamFilter] = useState("All");
  const [sortCategory, setSortCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [positionFilter, setPositionFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const positions = ["G", "F", "C"];

  const handlePositionFilterChange = (event) => {
    const selectedPosition = event.target.value;
    setPositionFilter(selectedPosition);
    onPositionFilterChange(selectedPosition);
  };

  
  const teams = [...new Set(playerData.map((player) => player.team))].sort();

  const handleTeamFilterChange = (event) => {
    const selectedTeam = event.target.value;
    setTeamFilter(selectedTeam);
    onFilterChange(selectedTeam);
  };

  const handleSortCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setSortCategory(selectedCategory);
    setSortOrder("desc"); // Reset sort order when changing category
    onSort(selectedCategory, "desc");
  };

  const handleSortOrderChange = (event) => {
    const selectedOrder = event.target.value;
    setSortOrder(selectedOrder);
    onSort(sortCategory, selectedOrder);
  };

  const handleSearchQueryChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearchQueryChange(query);
    // The search filter will be applied when the user types in the search box.
    // We don't need to call any function here as it will be handled in the rendering logic.
  };

  const filteredPlayersBySearch = playerData.filter((player) =>
    player.name.toLowerCase().includes(searchQuery.toLowerCase())
  );


return (
    <div className="player-filter">
      <label htmlFor="team-filter" className="filter-label">
        Filter by Team:
      </label>
      <select
        id="team-filter"
        value={teamFilter}
        onChange={handleTeamFilterChange}
        className="filter-select"
      >
        <option value="All">All</option>
        {teams.map((team) => (
          <option key={team} value={team}>
            {team}
          </option>
        ))}
      </select>
      <label htmlFor="position-filter" className="filter-label">
        Filter by Position:
      </label>
      <select
        id="position-filter"
        value={positionFilter}
        onChange={handlePositionFilterChange}
        className="filter-select"
      >
        <option value="All">All</option>
        {positions.map((position) => (
          <option key={position} value={position}>
            {position}
          </option>
        ))}
      </select>
      <label htmlFor="search-filter" className="filter-label">
        Search by Player Name:
      </label>
      <input
        type="text"
        id="search-filter"
        value={searchQuery}
        onChange={handleSearchQueryChange}
        className="filter-input"
        placeholder="Type player's name..."
      />
      <label htmlFor="sort-category" className="filter-label">
        Sort by:
      </label>
      <select
        id="sort-category"
        value={sortCategory}
        onChange={handleSortCategoryChange}
        className="filter-select"
      >
        <option value="">Select Category</option>
        <option value="points_per_game">PTS</option>
        <option value="rebounds_per_game">REB</option>
        <option value="assists_per_game">AST</option>
        <option value="steals_per_game">STL</option>
        <option value="blocks_per_game">BLK</option>
        <option value="minutes_per_game">MIN</option>
        <option value="games_played">GP</option>
        <option value="field_goals_made_per_game">FGM</option>
        <option value="field_goals_attempted_per_game">FGA</option>
        <option value="field_goal_percentage">FG%</option>
        <option value="three_pointers_made_per_game">3PM</option>
        <option value="three_pointers_attempted_per_game">3PA</option>
        <option value="three_point_percentage">3P%</option>
        <option value="free_throws_made_per_game">FTM</option>
        <option value="free_throws_attempted_per_game">FTA</option>
        <option value="free_throw_percentage">FT%</option>
      </select>
      <label htmlFor="sort-order" className="filter-label">
        Sort Order:
      </label>
      <select
        id="sort-order"
        value={sortOrder}
        onChange={handleSortOrderChange}
        className="filter-select"
      >
        <option value="desc">Highest to Lowest</option>
        <option value="asc">Lowest to Highest</option>
      </select>
    </div>
  );
};


export default PlayerFilter;

