enum Query {
  Weather = `
  query($latLong: WeatherQuery!) {
    getWeatherForLocation(latLong: $latLong) {
      description
      locationName
      temperatureinCelsius
    }
  }
  `,
  Metrics= `
  query {
    getMetrics
  }
  `,
  Historical = `
  `,
  Tick = `
  ` 
}

export default Query;