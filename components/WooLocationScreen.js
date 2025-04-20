import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Text,
  Keyboard,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Icon from "react-native-vector-icons/FontAwesome";
import * as Location from "expo-location";
import axios from "axios";
// import { useNavigation } from "@react-navigation/native";
import { GOOGLE_API_KEY } from "@env";

const API_KEY = GOOGLE_API_KEY;

const WooLocationScreen = ({ route, navigation }) => {
  const { wooMedia, wooType, wooMigos, migoWoos, wooDate, wooTime } =
    route.params;

  const [region, setRegion] = useState(null); // Stores user location
  const [address, setAddress] = useState(""); // Stores the user's address

  const mapRef = useRef(null);
  const googlePlacesRef = useRef(null);
  // const navigation = useNavigation();

  // Function to get the user's location
  const getUserLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Enable location services to use this feature."
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // Move the map to user's location
      mapRef.current?.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        1000
      );

      // Get address from coordinates
      getAddressFromCoords(latitude, longitude);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  // Function to get address using Google Maps API
  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${API_KEY}`
      );
      if (response.data.results.length > 0) {
        setAddress(response.data.results[0].formatted_address);
      } else {
        setAddress("Address not found");
      }
    } catch (error) {
      console.error("Error getting address:", error);
      setAddress("Error retrieving address");
    }
  };

  const handleChangeText = (text) => {
    if (text === "") {
      googlePlacesRef.current.blur();
      Keyboard.dismiss();
    }
  };

  const handleBlur = () => {
    googlePlacesRef.current.blur();
    Keyboard.dismiss();
  };

  // Fetch user location on mount
  useEffect(() => {
    // console.log(`GGGAAAPPPKKK ${JSON.stringify(region)}`);
    getUserLocation();
  }, []);

  return (
    <View style={styles.container}>
      {/* Google Places Autocomplete Input */}
      <GooglePlacesAutocomplete
        ref={googlePlacesRef}
        placeholder="search woo location"
        enablePoweredByContainer={false}
        keyboardShouldPersistTaps="handled"
        onBlur={() => handleBlur}
        fetchDetails={true}
        onFail={(error) => console.error("Autocomplete Error:", error)}
        textInputProps={{
          onBlur: handleBlur,
          onChangeText: handleChangeText, // Handle input change
        }}
        onPress={(data, details = null) => {
          console.log("Selected Place:", data.description);
          if (details) {
            const { lat, lng } = details.geometry.location;
            setRegion({
              latitude: lat,
              longitude: lng,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });

            // Move the map to the selected location
            mapRef.current?.animateToRegion(
              {
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              1000
            );

            // Get address from new location
            getAddressFromCoords(lat, lng);
          }
        }}
        query={{
          key: API_KEY,
          language: "en",
        }}
        styles={{
          container: styles.autoCompleteContainer,
          textInput: styles.input,
        }}
        debounce={300}
      />

      {/* MapView with Marker (Only show when region is set) */}
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          showsUserLocation={true}
        >
          <Marker coordinate={region} />
        </MapView>
      )}

      {/* Display Address */}
      <View style={styles.addressContainer}>
        <Text style={styles.addressText}>
          {address || "Fetching address..."}
        </Text>
      </View>

      {/* Navigation Buttons */}
      <View style={styles.navButtons}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          <Icon name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("WooList", {
              wooMedia: wooMedia,
              wooType: wooType,
              wooMigos: wooMigos,
              migoWoos: migoWoos,
              wooDate: wooDate,
              wooTime: wooTime,
              wooLocation: { address: address, region: region },
            })
          }
          style={styles.button}
        >
          <Icon name="arrow-right" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  autoCompleteContainer: {
    position: "absolute",
    width: "100%",
    zIndex: 1,
    top: 50,
    paddingHorizontal: 10,
  },
  input: {
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  addressContainer: {
    position: "absolute",
    bottom: 80,
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  addressText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  navButtons: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 30,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default WooLocationScreen;

// import React, { useEffect, useState, useRef } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView } from "react-native";
// import { Header, Icon, LinearProgress, Input } from "@rneui/themed";
// import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
// import * as Location from 'expo-location';
// import { woo_black, woo_orange } from '../assets/colors';

// const WooLocationScreen = ({ route, navigation }) => {

//     // API Key
//     const API_KEY = 'AIzaSyBkyLliKkjhFTeZkMD1rKZpNQWIyhGWwug';

//     const { wooMedia, wooType, wooMigos, migoWoos, wooDate, wooTime } = route.params;

//     const [searchValue, setSearchValue] = useState([])
//     const [searchResults, setSearchResults] = useState()
//     const [isSearchError, setIsSearchError] = useState()
//     const [isSearchIconHidden, setSearchIconHidden] = useState(true)
//     const [loading, setLoading] = useState(true);
//     const [location, setLocation] = useState(null);
//     const [longitude, setLongitude] = useState(null);
//     const [latitude, setLatitude] = useState(null);
//     const [region, setRegion] = useState(null)
//     const [errorMsg, setErrorMsg] = useState(null);

//     const searchRef = useRef()

//     const handleSearch = async () => {

//         searchRef.current.clear()
//         searchRef.current.blur()
//     }

//     const handleSearchOnChange = async (input) => {
//         if (input.length > 0) {
//             setSearchIconHidden(false)

//             const googleAPIUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json
//             ?input=${input}
//             &language=en
//             &types=geocode
//             &key=${API_KEY}`

//             //  = "https://maps.googleapis.com/maps/api/place/textsearch/json";
//             const location = `${latitude}, ${longitude}&radius=2000`
//             const url = `${googleAPIUrl}?query=${input.trim()}&location=${location}&key=${API_KEY}`

//             try {
//                 const resp = await fetch(url)
//                 const json = await resp
//                 console.log("WOO LOCATION SEARCH RESULTS ===> " + JSON.stringify(resp.predictions))
//             } catch (error) {
//                 console.error("ERROR ===> " + error)
//             }
//         } else {
//             setSearchIconHidden(true)
//         }
//         setIsSearchError(false)
//         setSearchValue(input)
//     }

//     const handleSearchEndEditing = () => {
//         setSearchIconHidden(true)
//     }

//     useEffect(() => {
//         (async () => {

//             let { status } = await Location.requestForegroundPermissionsAsync();
//             if (status !== 'granted') {
//                 setErrorMsg('Permission to access location was denied');
//                 return;
//             }

//             let location = await Location.getCurrentPositionAsync({});
//             setLoading(false)
//             setLocation(location);
//             setLongitude(location.coords.longitude)
//             setLatitude(location.coords.latitude)
//             setRegion({
//                 latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.1922,
//                 longitudeDelta: 0.1421,
//             })
//         })();
//     }, []);

//     let text = 'Waiting..';
//     if (errorMsg) {
//         text = errorMsg;
//     } else if (location) {
//         text = JSON.stringify(location);
//     }

//     return (
//         <View style={styles.container}>
//             <Header
//                 style={styles.header}
//                 backgroundColor={'#fff'}
//                 leftComponent={
//                     <Icon
//                         name="chevron-left"
//                         type='font-awesome-5'
//                         color={woo_black}
//                         size={25}
//                         onPress={() =>
//                             navigation.navigate('WooTime', { wooMedia: wooMedia, wooType: wooType, wooMigos: wooMigos, migoWoos: migoWoos, wooDate: wooDate })
//                         }
//                     />}
//                 centerComponent={
//                     <View >
//                         <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>woo location</Text>
//                     </View>
//                 }
//                 rightComponent={
//                     <Icon
//                         name="chevron-right"
//                         type='font-awesome-5'
//                         color={woo_black}
//                         size={25}
//                         onPress={() =>
//                             navigation.navigate('WooList', { wooMedia: wooMedia, wooType: wooType, wooMigos: wooMigos, migoWoos: migoWoos, wooDate: wooDate, wooTime: wooTime, wooLocation: searchValue })
//                         }
//                     />
//                 }
//                 rightContainerStyle={styles.rightComponent}
//                 leftContainerStyle={styles.leftComponent}
//                 centerContainerStyle={styles.centerComponent}
//             />
//             {/* <LinearProgress
//                 style={{}}
//                 value={.67}
//                 color={woo_orange}
//                 variant="determinate"
//             /> */}

//             <KeyboardAvoidingView behavior='position'>
//                 <Input
//                     value={searchValue}
//                     ref={searchRef}
//                     onChangeText={text => handleSearchOnChange(text)}
//                     placeholder='add woo address'
//                     fontSize={14}
//                     leftIcon={<Icon style={{ paddingEnd: 5 }} type='font-awesome-5' name='search-location' size={18} />}
//                     // errorStyle={{ color: 'red' }}
//                     // errorMessage={isSearchError && "sorry we couldn't find that Search"}
//                     autoCapitalize="none"
//                     // onFocus={() => handleSearchOnFocus()}
//                     onEndEditing={() => handleSearchEndEditing()}
//                     rightIcon={!isSearchIconHidden && <Icon name="play" type='font-awesome-5' size={18} onPress={() => handleSearch()} />}
//                 />
//                 {
//                     searchResults && "LISTVIEW WITH RESULTS"
//                 }
//             </KeyboardAvoidingView>

//             {!loading ?
//                 <MapView
//                     // provider={PROVIDER_GOOGLE}
//                     region={region}
//                     showsUserLocation style={styles.map}>
//                     {/* <Marker
//                     coordinate={latitude && { latitude: latitude, longitude: longitude }}
//                     image={require('../assets/woomigo_icon.png')}
//                 /> */}
//                 </MapView> :
//                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                     <ActivityIndicator size={'large'} style={{}} />
//                 </View>
//             }

//         </View>
//     )

// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: "#fff"
//     },
//     profileInfo: {
//         textAlign: 'center'
//     },
//     header: {
//         shadowColor: '#000',
//         shadowOffset: { width: 1, height: 3 },
//         shadowOpacity: 0.2,
//         elevation: 4,
//     },
//     leftComponent: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     centerComponent: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     rightComponent: {
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     map: {
//         width: '100%',
//         height: '100%',
//     },
// })

// export default WooLocationScreen
