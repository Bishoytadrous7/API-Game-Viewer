import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [game, setGame] = useState(null);
  const [games, setGames] = useState([]);
  const [error, setError] = useState("");
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch("https://corsproxy.io/?https://www.freetogame.com/api/games");
        const data = await res.json();

        if (Array.isArray(data)) {
          setGames(data);
          setError("");
        } else {
          setError("No games found.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to fetch games.");
      }
    };

    fetchGames();
  }, []);

  const getRandomGame = () => {
    if (games.length === 0) return;

    const filtered = games.filter((g) =>
      !banList.some(
        (ban) =>
          (ban.type === "genre" && g.genre === ban.value) ||
          (ban.type === "platform" && g.platform === ban.value) ||
          (ban.type === "publisher" && g.publisher === ban.value)
      )
    );

    if (filtered.length === 0) {
      setError("All games are banned.");
      setGame(null);
      return;
    }

    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setGame(random);
    setHistory((prev) => [random, ...prev]);
    setError("");
  };

  const handleBan = (type, value) => {
    if (!banList.find((item) => item.type === type && item.value === value)) {
      setBanList((prev) => [...prev, { type, value }]);
    }
  };

  const removeBan = (type, value) => {
    setBanList((prev) => prev.filter((item) => !(item.type === type && item.value === value)));
  };

  return (
    <div className="app">
      <h1>🎮 Free-to-Play Games</h1>

      <button className="fetch-button" onClick={getRandomGame}>Show Me a Game!</button> 
      {error && <p className="error">{error}</p>} {game && (
        <div className="game-card">
          <img src={game.thumbnail} alt={game.title} className="thumbnail" />
          <h2>{game.title}</h2>
          <p className="clickable" onClick={() => handleBan("genre", game.genre)}>Genre: {game.genre} </p>
          <p className="clickable" onClick={() => handleBan("platform", game.platform)}> Platform: {game.platform} </p>
          <p className="clickable" onClick={() => handleBan("publisher", game.publisher)}> Publisher: {game.publisher} </p>
        </div>
      )}
      <div className="ban-list">
        <h3> Ban List (Click to Remove)</h3>
        {banList.length === 0 && <p>No attributes banned.</p>}
        <ul> {banList.map((item, index) => (
        <li
          key={index}
          className="banned-item"
          onClick={() => removeBan(item.type, item.value)} >{item.value}
        </li>
      ))}
        </ul>
        <div className="history-section">
          <h3>🕓 Game History</h3>
          {history.length === 0 && <p>No games viewed yet.</p>}
          <ul className="history-list">
            {history.map((item, idx) => (
              <li key={idx} className="history-item">
                <img src={item.thumbnail} alt={item.title} width="100" />
                <div>
                  <strong>{item.title}</strong>
                  <p>Genre: {item.genre}</p>
                  <p>Platform: {item.platform}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default App;
