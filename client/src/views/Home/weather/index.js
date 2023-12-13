import React, { useState, useEffect } from "react";
import { fetchMe } from "../../../utility/api";
import { isUserLoggedIn} from "../../../utility/utils";
import { Grid, Paper, Typography } from "@mui/material";
import weatherCodeData from "./weatherCodeData.json";
import { getMonthName, getDayOfWeek, addNumSuffix } from "./utils";

const getCoordinates = async (postalCode) => {
  try {
    const response = await fetch(
      `https://geocode.maps.co/search?q=${postalCode}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch coordinates");
    }
    const data = await response.json();
    // console.log(data)
    const coords = {
      lat: data[0].lat,
      lon: data[0].lon,
      displayName: data[0].display_name,
    };
    return coords;
  } catch (error) {
    console.error(error);
  }
};
//get weather forecast from past activities
const getWeatherForecast = async (postalCode, days) => {
  const weatherCodeData = require("./weatherCodeData.json");
  const coords = await getCoordinates(postalCode);
  //   console.log("weathercode here:", weatherCodeData);

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_hours,precipitation_probability_max,windspeed_10m_max,windgusts_10m_max,winddirection_10m_dominant&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timezone=America%2FNew_York&forecast_days=${days}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch forecast data");
  }

  const data = await response.json();

  const forecast = [];
  for (let i = 0; i < days; i++) {
    const formattedDay = {
      timeStamp: data.daily.time[i],
      timezone: data.timezone,
      location: {
        latitude: data.latitude,
        longitude: data.longitude,
        city: coords.displayName,
      },
      weather: {
        weatherCode: data.daily.weathercode[i],
        day: weatherCodeData[data.daily.weathercode[i]].day,
        night: weatherCodeData[data.daily.weathercode[i]].night,
      },
      temp: {
        high: data.daily.temperature_2m_max[i],
        low: data.daily.temperature_2m_min[i],
        unit: data.daily_units.temperature_2m_max,
      },
      sunrise: data.daily.sunrise[i],
      sunset: data.daily.sunset[i],
      precipitation: {
        duration: data.daily.precipitation_hours[i],
        durationUnit: data.daily_units.precipitation_hours,
        probability: data.daily.precipitation_probability_max[i],
        probabilityUnit: data.daily_units.precipitation_probability_max,
      },
      wind: {
        speed: data.daily.windspeed_10m_max[i],
        speedUnit: data.daily_units.windspeed_10m_max,
        gust: data.daily.windgusts_10m_max[i],
        gustUnit: data.daily_units.windgusts_10m_max,
        direction: data.daily.winddirection_10m_dominant[i],
        directionUnit: data.daily_units.winddirection_10m_dominant,
      },
    };
    // console.log('~~~~~~~~~~~~~~~~~~~~~~\n formattedDay: ', formattedDay)
    // add the formatted data to the forecast array
    forecast.push(formattedDay);
  }

  // return An array of objects where each object is a single day's forecast
  // console.log('output: ', forecast)
  return forecast;
};

const getDateFormat = (timestamp) => {
  const date = new Date(timestamp);
  return `${getDayOfWeek(date.getDay())}, ${getMonthName(
    date.getMonth()
  )} ${addNumSuffix(date.getDate())}`;
};

function Weather(props) {
  //** Destructure Props
  const {} = props;

  const [forecast, setForecast] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(isUserLoggedIn()); // usestate for loggedIn or not
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // check if user is logged in
    if (isLoggedIn) {
      // fetch user's id using user token
      fetchMe().then((result) => {
        // console.log("fetchMe: ", result);
        // set user id state variable with the user id from the fetch request
        setUserId(result.data.id);
        // console.log("result.data:", result.data);
        setUser(result.data);
        // console.log("result user:", result.data.zipCode)
        //need 
        const userPostalCode = result.data.zipCode;

        // fetch weather forecast based on user's postal code
        getWeatherForecast(userPostalCode, 8)
          .then((forecastData) => {
            setForecast(forecastData);
            // console.log("forecast: ", forecastData)
          })

          .catch((error) => {
            console.error("Failed to fetch weather forecast:", error);
          });
      });
    }
  }, [isLoggedIn]);

  return (
    //need to use grid
    <Grid container spacing={1}>
      {forecast.map((day, index) => {
        //get the images through weathercodedata.json.
        const weatherInfo = weatherCodeData[day.weather.weatherCode];
        const weatherDayImage = weatherInfo.day.image;
        const weatherNightImage = weatherInfo.night.image;
        const weatherDescription = weatherInfo.day.description;
        //get date format for better looking timestamp
        const formattedDate = getDateFormat(day.timeStamp);

        return (
          <Grid item xs={1.5} key={index}>
            <Paper
              style={{
                margin: "10px",
                padding: "20px",
                height: "375px",
                borderRadius: "30px",
                backgroundColor: "#1e2b37",
                color: "white",
              }}
            >
              <Typography variant="h6">{formattedDate}</Typography>
              <img src={weatherDayImage} alt="Weather Icon" />
              {/* <img src={weatherNightImage} alt="Weather Icon" /> */}
              <Typography>{`Weather: ${weatherDescription}`}</Typography>
              <Typography>{`High: ${day.temp.high}`}</Typography>
              <Typography>{`Low: ${day.temp.low}`}</Typography>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default Weather;
