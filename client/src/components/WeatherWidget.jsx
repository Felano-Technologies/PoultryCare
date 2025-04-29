import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const API_KEY = '6c3636426670082da68407080a4f9543'; 
  const city = 'Kumasi'; 

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
        );
        const data = res.data;
        setWeather({
          temperature: data.main.temp,
          condition: data.weather[0].main,
          icon: data.weather[0].icon
        });
      } catch (error) {
        console.error('Weather API error:', error);
      }
    };

    fetchWeather();
  }, []);

  if (!weather) return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Weather Update</h3>
      <p className="text-gray-500 text-sm">Loading...</p>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">Weather Update</h3>
      <img
        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
        alt={weather.condition}
        className="w-20 h-20 mb-2"
      />
      <p className="text-xl font-bold text-gray-800">{weather.temperature}°C</p>
      <p className="text-gray-600">{weather.condition}</p>
    </div>
  );
}
