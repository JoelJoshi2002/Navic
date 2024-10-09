import React, { useState, useEffect } from "react";
import Map from "./component/Map";
import axios from "axios"; // Import axios

const App = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State to store the search query
  const [searchResults, setSearchResults] = useState([]); // State to store search results
  const [selectedBUS, setSelectedBUS] = useState(""); // State to store selected BUS

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults([]); // Clear search results when search query is empty
      return;
    }

    // Fetch search results based on search query
    fetchSearchResults();
  }, [searchQuery]);

  const fetchSearchResults = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/list-all`,
        {
          params: {
            search: searchQuery,
          },
        }
      );
      setSearchResults(response.data); // Update search results state with the fetched data
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleSelectBUS = (bus) => {
    setSelectedBUS(bus); // Update selectedBUS state when a bus is selected
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "10px",
          backgroundColor: "#f0f0f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <input
          type="text"
          list="buses"
          placeholder="Search for a bus..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onBlur={(e) => handleSelectBUS(e.target.value)}
          style={{ width: "60%", padding: "5px" }}
        />
        <datalist id="buses">
          {searchResults.map((bus) => (
            <option key={bus} value={bus} />
          ))}
        </datalist>
      </div>
      <Map selectedBUS={selectedBUS} />
      {/* Pass selectedBUS to Map component */}
    </div>
  );
};

export default App;
