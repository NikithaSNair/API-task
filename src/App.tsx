import { useState } from "react";
import "./index.css"; 

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string; 
  public_repos: number;
  followers: number;
  following: number;
  bio: string;
}

export default function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUser = async () => {
    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;
    setLoading(true);
    setError("");
    setUserData(null);

    try {
      const response = await fetch(
        `https://api.github.com/users/${trimmedUsername}`
      );
      if (!response.ok) {
        if (response.status === 404) {
          setError("User not found");
        } else {
          setError("Network error. Please try again.");
        }
        setUserData(null);
      } else {
        const data: GitHubUser = await response.json();
        setUserData(data);
      }
    } catch {
      setUserData(null);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-container">
      <h2>Peek-A-Git</h2>
      <div style={{ width: "100%", display: "flex", gap: "0.5em", marginBottom: "1.5em" }}>
        <input
          style={{
            flex: 1,
            padding: "0.6em 1em",
            borderRadius: "8px",
            border: "1px solid #3730a3",
            background: "rgba(36,36,36,0.8)",
            color: "#fafafa",
            fontSize: "1em",
          }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") fetchUser();
          }}
          placeholder="Enter GitHub username"
          disabled={loading}
        />
        <button onClick={fetchUser} disabled={loading || !username.trim()}>
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {userData && (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", animation: "fadeInUp 1.1s cubic-bezier(.22,1,.36,1)" }}>
          
          <div className="profile-pic-wrapper">
            <img
              className="profile-pic"
              src={userData.avatar_url}
              alt="Profile"
            />
          </div>
          
          <h2 style={{ marginTop: 0 }}>{userData.name || userData.login}</h2>
          <p style={{ margin: "0.5em 0" }}>@{userData.login}</p>
          <p>Repositories: {userData.public_repos}</p>
          <p>
            Followers: {userData.followers} | Following: {userData.following}
          </p>
          {userData.bio && <p style={{ fontStyle: "italic" }}>{userData.bio}</p>}
        </div>
      )}

      {error && (
        <p style={{ color: "#ff6b6b", marginTop: "1em", fontWeight: 500 }}>
          {error}
        </p>
      )}
    </div>
  );
}
