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
    query($input: [MeasurementQuery]) {
      getMultipleMeasurements(input: $input)
      {
        metric
        measurements{
          metric
          at
          value
          unit
        }
      }
    }
  `,
  Tick = `
    subscription {
      newMeasurement{
        metric
        value
        at
        unit
      }
    }
  ` 
}

export default Query;