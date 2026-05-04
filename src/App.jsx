import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);

  const API_KEY = "9e1c3dc99dd5a02bcc5e298e104c719e";

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

  // ✅ FIXED TYPE
  const rawType = weather?.weather?.[0]?.main || "default";

  const type =
    ["Haze", "Mist", "Fog"].includes(rawType)
      ? "Smoke"
      : rawType;

  return (
    <div className={`app ${type}`}>

      {/* 🌧️ RAIN */}
      {type === "Rain" && (
        <div className="rain-effect">
          {[...Array(120)].map((_, i) => (
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

      {/* ☀️ SUN */}
      {type === "Clear" && (
        <div className="sun-effect">
          <div className="sun"></div>
        </div>
      )}

      {/* ☁️ CLOUDS */}
      {type === "Clouds" && (
        <div className="cloud-effect">
          {[...Array(35)].map((_, i) => (
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
          {[...Array(120)].map((_, i) => (
            <span
              key={i}
              className="snow"
              style={{ left: Math.random() * 100 + "vw" }}
            />
          ))}
        </div>
      )}

      {/* 🌫️ SMOKE */}
      {type === "Smoke" && (
        <div className="smoke-effect">
          {[...Array(50)].map((_, i) => (
            <span
              key={i}
              className="smoke"
              style={{
                left: Math.random() * 100 + "vw",
                width: 60 + Math.random() * 80 + "px",
                height: 80 + Math.random() * 140 + "px",
                animationDuration: 5 + Math.random() * 3 + "s",
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
            {/* 📍 LOCATION */}
            <div className="location">
              <h2>{weather.name}</h2>
              <p>{new Date().toDateString()}</p>
            </div>

            {/* 🌡️ TEMP */}
            <h1>{Math.round(weather.main.temp)}°C</h1>
            <p>{weather.weather[0].main}</p>

            {/* 🔥 WIDGETS */}
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

            {/* 🌅 SUN TIME */}
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

        {/* 📊 FORECAST */}
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