import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
  Alert,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import GoogleAutoCompleteInput from './GoogleAutoCompleteInput';


import WeatherInfo from './components/WeatherInfo';

const Stack = createStackNavigator();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WeatherMaps: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

interface Location {
  latitude: number;
  longitude: number;
}

interface PlaceDetails {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

const HomeScreen = () => {
  const [destination, setDestination] = useState('');
  //const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  //Just for testing
  const [currentLocation, setCurrentLocation] = useState<Location | null>({
    latitude: 37.7749,
    longitude: -122.4194,
  });
  // Inside the HomeScreen component
  const [routeWeather, setRouteWeather] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [startingLocation, setStartingLocation] = useState('');
  const [startingLocationDetails, setStartingLocationDetails] = useState<
    any | null
  >(null);

  useEffect(() => {
    if (destination !== '' && (currentLocation || startingLocationDetails)) {
      const origin = startingLocationDetails
        ? {
            latitude: startingLocationDetails.geometry.location.lat,
            longitude: startingLocationDetails.geometry.location.lng,
          }
        : currentLocation;
      fetchRouteWeather(origin, destination);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, currentLocation, startingLocationDetails]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      marginBottom: 24,
    },
    inputContainer: {
      width: '80%',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 120,
    },
    input: {
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 16,
    },
    weatherContainer: {
      marginTop: 16,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      Geolocation.requestAuthorization('whenInUse');
      getLocation();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'WeatherMaps Location Permission',
            message: 'WeatherMaps needs access to your location.',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getLocation();
        } else {
          Alert.alert('Error', 'Location permission not granted');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setCurrentLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        Alert.alert('Error', 'Error getting location');
        console.log(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  // Fetch route and weather data when destination is updated
  useEffect(() => {
    if (destination !== '' && currentLocation) {
      fetchRouteWeather(currentLocation, destination);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, currentLocation]);

  // ...

  const fetchRouteWeather = async (origin: any, dest: string) => {
    const originString = startingLocationDetails
      ? `${startingLocationDetails.geometry.location.lat},${startingLocationDetails.geometry.location.lng}`
      : `${origin.latitude},${origin.longitude}`;
    const directionsUrl = `https://maps.googleapis.com/maps/api/directions/json?origin=${originString}&destination=${encodeURIComponent(
      dest,
    )}&key=GOOGLEMAPSAPIKEY;
    try {
      const directionsResponse = await fetch(directionsUrl);
      const directionsData = await directionsResponse.json();

      // Extract the coordinates of the route's waypoints
      const waypoints = directionsData.routes[0].legs[0].steps.map(
        (step: any) => {
          return {
            latitude: step.end_location.lat,
            longitude: step.end_location.lng,
          };
        },
      );

      // Fetch weather data for each waypoint
      const weatherPromises = waypoints.map((waypoint: any) =>
        fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${waypoint.latitude}&lon=${waypoint.longitude}&units=imperial&appid=WEATHERAPIKEY`,
        ),
      );

      const weatherResponses = await Promise.all(weatherPromises);
      const weatherData = await Promise.all(
        weatherResponses.map((response: any) => response.json()),
      );

      setRouteWeather(weatherData);
    } catch (error) {
      console.error('Error fetching route or weather data:', error);
      Alert.alert('Error', 'Error fetching route or weather data');
    }
  };

  // ...

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>WeatherMaps</Text>
      <View style={styles.inputContainer}>
        <GooglePlacesAutocomplete
          placeholder="Enter starting location (optional)"
          fetchDetails={true}
          onPress={(data, details: PlaceDetails | null) => {
            if (details) {
              setStartingLocation(details.formatted_address);
              setStartingLocationDetails(details);
            } else {
              Alert.alert('Error');
            }
          }}
          query={{
            key: 'Google places API key',
            language: 'en',
          }}
          styles={{
            textInput: styles.input,
            listView: {
              zIndex: 1000,
            },
            container: {
              flex: 1,
            },
          }}
        />
        <GooglePlacesAutocomplete
          placeholder="Enter destination"
          fetchDetails={true}
          onPress={(data, details: PlaceDetails | null) => {
            if (details && details.formatted_address) {
              setDestination(details.formatted_address);
              fetchRouteWeather(currentLocation, details.formatted_address);
            } else {
              Alert.alert('Error');
            }
          }}
          query={{
            key: 'Google Places API Key',
            language: 'en',
          }}
          styles={{
            textInput: styles.input,
            listView: {
              zIndex: 1000,
            },
            container: {
              flex: 1,
            },
          }}
        />
      </View>
    </SafeAreaView>
  );
};
export default WeatherMaps;
