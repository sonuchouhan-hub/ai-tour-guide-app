import { useState } from "react";

// ⬇️ NEW: API base URL configurable (local + deploy dono ke liye)
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function App() {
  // form fields
  const [city, setCity] = useState("");
  const [days, setDays] = useState("");
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [stayType, setStayType] = useState("mid-range");
  const [interests, setInterests] = useState([]);

  // api state
  const [loading, setLoading] = useState(false);
  const [tripPlan, setTripPlan] = useState(null);
  const [error, setError] = useState("");

  const handleInterestChange = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;

    setInterests((prev) => {
      if (checked) {
        if (prev.includes(value)) return prev;
        return [...prev, value];
      } else {
        return prev.filter((item) => item !== value);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTripPlan(null);

    if (!city || !days || !budget) {
      setError("❗ Please fill city, days and budget.");
      return;
    }

    try {
      setLoading(true);

      // ⬇️ UPDATED: yahan hardcoded localhost nahi, API_BASE_URL use ho raha hai
      const response = await fetch(`${API_BASE_URL}/api/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          city,
          days: Number(days),
          budget: Number(budget),
          travelers: Number(travelers || 1),
          stayType,
          interests,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Something went wrong");
      }

      const data = await response.json();
      setTripPlan(data);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to get trip plan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.25rem" }}>
        ✈️ AI Tour Guide – Trip Planner
      </h1>
      <p style={{ marginBottom: "1.5rem", opacity: 0.8 }}>
        Enter your details and let the AI create a day-wise, time-wise
        itinerary with budget hints.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          background: "#020617",
          padding: "1.5rem",
          borderRadius: "1rem",
          maxWidth: "520px",
          display: "grid",
          gap: "1rem",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >
        {/* City */}
        <div>
          <label>City</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Indore, Goa, Jaipur..."
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid #334155",
              background: "#020617",
              color: "white",
              marginTop: "0.25rem",
            }}
          />
        </div>

        {/* Days & Budget */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0.75rem",
          }}
        >
          <div>
            <label>Days</label>
            <input
              type="number"
              min="1"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="3"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #334155",
                background: "#020617",
                color: "white",
                marginTop: "0.25rem",
              }}
            />
          </div>

          <div>
            <label>Budget (₹)</label>
            <input
              type="number"
              min="0"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="15000"
              style={{
                width: "100%",
                padding: "0.5rem 0.75rem",
                borderRadius: "0.5rem",
                border: "1px solid #334155",
                background: "#020617",
                color: "white",
                marginTop: "0.25rem",
              }}
            />
          </div>
        </div>

        {/* Travellers */}
        <div>
          <label>Number of travellers</label>
          <input
            type="number"
            min="1"
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
            placeholder="1"
            style={{
              width: "100%",
              padding: "0.5rem 0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid #334155",
              background: "#020617",
              color: "white",
              marginTop: "0.25rem",
            }}
          />
        </div>

        {/* Stay type */}
        <div>
          <label>Stay type</label>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              marginTop: "0.35rem",
              flexWrap: "wrap",
            }}
          >
            {["budget", "mid-range", "luxury"].map((type) => (
              <label
                key={type}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  fontSize: "0.9rem",
                  textTransform: "capitalize",
                  opacity: 0.9,
                }}
              >
                <input
                  type="radio"
                  name="stayType"
                  value={type}
                  checked={stayType === type}
                  onChange={(e) => setStayType(e.target.value)}
                />
                {type}
              </label>
            ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label>Interests</label>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.5rem 1.25rem",
              marginTop: "0.35rem",
              fontSize: "0.9rem",
            }}
          >
            {[
              "adventure",
              "food",
              "shopping",
              "temples",
              "beaches",
              "nightlife",
            ].map((interest) => (
              <label
                key={interest}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  textTransform: "capitalize",
                  opacity: 0.9,
                }}
              >
                <input
                  type="checkbox"
                  value={interest}
                  checked={interests.includes(interest)}
                  onChange={handleInterestChange}
                />
                {interest}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "0.75rem",
            background: loading ? "#475569" : "#22c55e",
            color: "black",
            borderRadius: "999px",
            border: "none",
            marginTop: "0.5rem",
            fontWeight: "600",
            cursor: loading ? "wait" : "pointer",
          }}
        >
          {loading ? "Planning your trip..." : "Generate Trip Plan"}
        </button>
      </form>

      {error && (
        <div
          style={{
            background: "#7f1d1d",
            padding: "1rem",
            marginTop: "1rem",
            borderRadius: "0.75rem",
            maxWidth: "600px",
          }}
        >
          ⚠️ {error}
        </div>
      )}

      {tripPlan && (
        <div
          style={{
            background: "#020617",
            padding: "1.5rem",
            borderRadius: "1rem",
            marginTop: "2rem",
            maxWidth: "900px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            whiteSpace: "pre-wrap",
          }}
        >
          <h2 style={{ marginBottom: "0.75rem" }}>🧳 Your Trip Plan</h2>

          {tripPlan.plan ? (
            <p>{tripPlan.plan}</p>
          ) : typeof tripPlan === "string" ? (
            <p>{tripPlan}</p>
          ) : (
            <pre>{JSON.stringify(tripPlan, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
