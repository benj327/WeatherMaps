## WeatherMaps
An idea I had to account for the weather when planning a drive. This is a mobile app written in React Native that runs on iOS and Android. I didn't publish on a store because it wasn't as stable as I would've liked and the front end wasn't very polished. However it did get the job done. 

The idea is to enter a destination address and it calls the Google Directions API to find the route there. It then records a plot of the route and calls the OpenWeather API to get a forecast of the Weather at that point at the time the driver is passing by there. It also uses the Google Places Autocorrect API to take addresses and convert them into latitude and longitude for the Directions API.
