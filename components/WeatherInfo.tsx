import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface WeatherInfoProps {
  weather: any;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({weather}) => {
  return (
    <View style={styles.weatherItem}>
      <Text style={styles.weatherText}>
        {weather.name}: {weather.main.temp}°F, {weather.weather[0].description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  weatherItem: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginBottom: 8,
  },
  weatherText: {
    fontSize: 16,
  },
});

export default WeatherInfo;
