import "./App.css";
import { useState, useMemo } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const API_KEY = import.meta.env.VITE_API_KEY;

  const getWeather = async () => {
    if (!city.trim()) return;

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city.trim()}&appid=${API_KEY}&units=metric`
      );

      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city.trim()}&appid=${API_KEY}&units=metric`
      );

      setWeather(res.data);

      const daily = forecastRes.data.list.filter((_, i) => i % 8 === 0);
      setForecast(daily);
    } catch {
      alert("City not found");
    }
  };

  // WEATHER TYPE FIX
 const rawType = weather?.weather?.[0]?.main || "default";
  const type =
    ["Haze", "Mist", "Fog"].includes(rawType)
      ? "Smoke"
      : rawType.charAt(0).toUpperCase() + rawType.slice(1);

  // ✅ FIX: stable particles (no random jump every render)
  const smokeParticles = useMemo(() => Array.from({ length: 50 }), []);
  const rainParticles = useMemo(() => Array.from({ length: 120 }), []);
  const snowParticles = useMemo(() => Array.from({ length: 120 }), []);
  const cloudParticles = useMemo(() => Array.from({ length: 35 }), []);

  return (
    <div className={`app ${type}`}>

      {/* 🌧️ RAIN */}
      {type === "Rain" && (
        <div className="rain-effect">
          {rainParticles.map((_, i) => (
            <span
              key={i}
              className="drop"
              style={{
                left: Math.random() * 100 + "vw",
                animationDuration: 0.5 + Math.random() * 0.8 + "s",
              }}
            />
          ))}
        </div>
      )}

      {/* ☁️ CLOUDS */}
      {type === "Clouds" && (
        <div className="cloud-effect">
          {cloudParticles.map((_, i) => (
            <span
              key={i}
              className="cloud"
              style={{
                top: Math.random() * 80 + "vh",
                width: 150 + Math.random() * 200 + "px",
                height: 80 + Math.random() * 120 + "px",
                animationDuration: 20 + Math.random() * 20 + "s",
              }}
            />
          ))}
        </div>
      )}

      {/* ❄️ SNOW */}
      {type === "Snow" && (
        <div className="snow-effect">
          {snowParticles.map((_, i) => (
            <span
              key={i}
              className="snow"
              style={{
                left: Math.random() * 100 + "vw",
                animationDuration: 3 + Math.random() * 5 + "s",
                width: 3 + Math.random() * 6 + "px",
                height: 3 + Math.random() * 6 + "px",
              }}
            />
          ))}
        </div>
      )}

      {/* 🌫️ SMOKE (FIXED) */}
      {type === "Smoke" && (
        <div className="smoke-effect">
          {smokeParticles.map((_, i) => (
            <span
              key={i}
              className="smoke"
              style={{
                left: Math.random() * 100 + "vw",
                width: 60 + Math.random() * 80 + "px",
                height: 80 + Math.random() * 140 + "px",
                animationDuration: 6 + Math.random() * 4 + "s",
              }}
            />
          ))}
        </div>
      )}

      {/* UI */}
      <div className="card">

        <div className="search_in">
          <input
            placeholder="Enter City..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          <button onClick={getWeather}>Search</button>
        </div>

        {weather && (
          <>
            <div className="location">
              <h2>{weather.name}</h2>
              <p>{new Date().toDateString()}</p>
            </div>

            <h1>{Math.round(weather.main.temp)}°C</h1>
            <p>{weather.weather[0].main}</p>

            <div className="widgets">
              <div className="widget">
                🌡️
                <p>Feels</p>
                <h3>{Math.round(weather.main.feels_like)}°C</h3>
              </div>

              <div className="widget">
                💧
                <p>Humidity</p>
                <h3>{weather.main.humidity}%</h3>
              </div>

              <div className="widget">
                🌬️
                <p>Wind</p>
                <h3>{weather.wind.speed} km/h</h3>
              </div>

              <div className="widget">
                👁️
                <p>Visibility</p>
                <h3>{weather.visibility / 1000} km</h3>
              </div>
            </div>

            <div className="sun-time">
              <div>
                🌅 {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
              </div>
              <div>
                🌇 {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
              </div>
            </div>
          </>
        )}

        <div className="forecast">
          {forecast.map((item, i) => {
            const date = new Date(item.dt_txt);
            const day = date.toLocaleDateString("en-US", {
              weekday: "short",
            });

            return (
              <div className="day" key={i}>
                <p>{day}</p>
                <img
                  src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                  alt=""
                />
                <p>{Math.round(item.main.temp)}°</p>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default App;
