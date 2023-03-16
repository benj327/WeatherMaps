import React from 'react';
import {StyleSheet} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

const GoogleAutoCompleteInput = ({placeholder, onLocationSelected}) => {
  const styles = StyleSheet.create({
    input: {
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 4,
      paddingHorizontal: 12,
      paddingVertical: 6,
      fontSize: 16,
    },
  });

  return (
    <GooglePlacesAutocomplete
      placeholder={placeholder}
      fetchDetails={true}
      onPress={onLocationSelected}
      query={{
        key: 'AIzaSyA2i3DaCSWXFSxVuKCx07CMq-vxTeGkUBs',
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
  );
};

export default GoogleAutoCompleteInput;
