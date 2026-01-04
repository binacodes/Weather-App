import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import './App.css';

function App() {
  const [unit, setUnit] = useState('C');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastList, setForecastList] = useState([]);
  const [showForecast, setShowForecast] = useState(false);
  const [city, setCity] = useState("");
  const API_KEY = "3d31ac07e02757a71b47243a959b954c";

  const fetchWeather = async (cityName) => {
    if (!cityName) return;

    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${API_KEY}`;
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${API_KEY}`;

    try {
      const [res1, res2] = await Promise.all([fetch(currentWeatherUrl), fetch(forecastUrl)]);
      if (!res1.ok) throw new Error("City not found");
      if (!res2.ok) throw new Error("Forecast not found");

      const currentData = await res1.json();
      const forecastData = await res2.json();

      setWeatherData(currentData);
      setForecastList(forecastData.list.filter(item => item.dt_txt.includes("12:00:00")));
    } catch (err) {
      console.error("Error fetching weather:", err.message);
    }
  };

  useEffect(() => {
    fetchWeather("Kathmandu");
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchWeather(city);
      setCity("");
    }
  };

  const toggleUnit = () => setUnit(prev => prev === 'C' ? 'F' : 'C');

  const formatTemp = (temp) => {
    const t = unit === 'C' ? temp : (temp * 9 / 5) + 32;
    return Math.round(t);
  };

  const displayTemp = weatherData ? formatTemp(weatherData.main.temp) : "--";

  return (
    <div className='flex justify-center h-screen bg-[#2596be] p-4'>
      <div className='flex flex-col items-center mt-[100px] gap-8 w-full max-w-[600px]'>
        <div id='weather-search' className='w-full'>
          <input
            type="text"
            value={city}
            placeholder="Enter city name"
            onChange={(e) => setCity(e.target.value)}
            onKeyPress={handleKeyPress}
            className='w-full h-[50px] rounded-lg px-6 shadow-xl outline-none text-gray-700 text-lg'
          />
        </div>

        {weatherData && (
          <>
            <div className="flex justify-center w-full">
              <Button
                variant="secondary"
                onClick={() => setShowForecast(!showForecast)}
                className="bg-white/20 hover:bg-white/30 text-white border-none shadow-md backdrop-blur-sm h-10 px-6"
              >
                {showForecast ? "Back to Current Weather" : "Show 5-Day Forecast"}
              </Button>
            </div>

            {!showForecast ? (
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-8 text-white w-full shadow-lg flex flex-col items-center">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <h2 className="text-3xl font-bold text-center">{weatherData.name}, {weatherData.sys.country}</h2>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={toggleUnit}
                    className="bg-white/30 hover:bg-white/50 rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold border-none text-white"
                  >
                    °{unit === 'C' ? 'F' : 'C'}
                  </Button>
                </div>
                <div className="text-6xl font-bold mb-4">{displayTemp}°{unit}</div>
                <p className="text-xl capitalize mb-4">{weatherData.weather[0].description}</p>
                <div className="flex justify-between w-full mt-4 bg-white/10 rounded-lg p-4">
                  <div className="flex flex-col items-center">
                    <span className="text-sm opacity-80">Humidity</span>
                    <span className="font-semibold text-lg">{weatherData.main.humidity}%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-sm opacity-80">Wind Speed</span>
                    <span className="font-semibold text-lg">{weatherData.wind.speed} m/s</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 text-white w-full shadow-lg">
                <h3 className="text-2xl font-bold mb-4 text-center">5-Day Forecast</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[300px]">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="p-3">Date</th>
                        <th className="p-3">Temp</th>
                        <th className="p-3">Condition</th>
                        <th className="p-3">Humidity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forecastList.map((day, index) => (
                        <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                          <td className="p-3">
                            {new Date(day.dt_txt).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                          </td>
                          <td className="p-3">{formatTemp(day.main.temp)}°{unit}</td>
                          <td className="p-3 capitalize">{day.weather[0].description}</td>
                          <td className="p-3">{day.main.humidity}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;


