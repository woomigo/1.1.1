import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, KeyboardAvoidingView } from "react-native";
import { Header, Icon, LinearProgress, Input } from "@rneui/themed";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { woo_black, woo_orange } from '../assets/colors';

const WooLocationScreen = ({ route, navigation }) => {

    // API Key
    const API_KEY = 'AIzaSyBkyLliKkjhFTeZkMD1rKZpNQWIyhGWwug';



    const { wooMedia, wooType, wooMigos, migoWoos, wooDate, wooTime } = route.params;

    const [searchValue, setSearchValue] = useState([])
    const [searchResults, setSearchResults] = useState()
    const [isSearchError, setIsSearchError] = useState()
    const [isSearchIconHidden, setSearchIconHidden] = useState(true)
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [region, setRegion] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null);

    const searchRef = useRef()

    const handleSearch = async () => {



        searchRef.current.clear()
        searchRef.current.blur()
    }

    const handleSearchOnChange = async (input) => {
        if (input.length > 0) {
            setSearchIconHidden(false)

            const googleAPIUrl = `https://maps.googleapis.com/maps/api/place/autocomplete/json
            ?input=${input}
            &language=en
            &types=geocode
            &key=${API_KEY}`

            //  = "https://maps.googleapis.com/maps/api/place/textsearch/json";
            const location = `${latitude}, ${longitude}&radius=2000`
            const url = `${googleAPIUrl}?query=${input.trim()}&location=${location}&key=${API_KEY}`

            try {
                const resp = await fetch(url)
                const json = await resp
                console.log("WOO LOCATION SEARCH RESULTS ===> " + JSON.stringify(resp.predictions))
            } catch (error) {
                console.error("ERROR ===> " + error)
            }
        } else {
            setSearchIconHidden(true)
        }
        setIsSearchError(false)
        setSearchValue(input)
    }

    const handleSearchEndEditing = () => {
        setSearchIconHidden(true)
    }

    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setLoading(false)
            setLocation(location);
            setLongitude(location.coords.longitude)
            setLatitude(location.coords.latitude)
            setRegion({
                latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.1922,
                longitudeDelta: 0.1421,
            })
        })();
    }, []);

    let text = 'Waiting..';
    if (errorMsg) {
        text = errorMsg;
    } else if (location) {
        text = JSON.stringify(location);
    }

    return (
        <View style={styles.container}>
            <Header
                style={styles.header}
                backgroundColor={'#fff'}
                leftComponent={
                    <Icon
                        name="chevron-left"
                        type='font-awesome-5'
                        color={woo_black}
                        size={25}
                        onPress={() =>
                            navigation.navigate('WooTime', { wooMedia: wooMedia, wooType: wooType, wooMigos: wooMigos, migoWoos: migoWoos, wooDate: wooDate })
                        }
                    />}
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>woo location</Text>
                    </View>
                }
                rightComponent={
                    <Icon
                        name="chevron-right"
                        type='font-awesome-5'
                        color={woo_black}
                        size={25}
                        onPress={() =>
                            navigation.navigate('WooList', { wooMedia: wooMedia, wooType: wooType, wooMigos: wooMigos, migoWoos: migoWoos, wooDate: wooDate, wooTime: wooTime, wooLocation: "1050 Howell Mill Rd, Atlanta, GA 30308" })
                        }
                    />
                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />
            {/* <LinearProgress
                style={{}}
                value={.67}
                color={woo_orange}
                variant="determinate"
            /> */}

            <KeyboardAvoidingView behavior='position'>
                <Input
                    value={searchValue}
                    ref={searchRef}
                    onChangeText={text => handleSearchOnChange(text)}
                    placeholder='add woo address'
                    fontSize={14}
                    leftIcon={<Icon style={{ paddingEnd: 5 }} type='font-awesome-5' name='search-location' size={18} />}
                    // errorStyle={{ color: 'red' }}
                    // errorMessage={isSearchError && "sorry we couldn't find that Search"}
                    autoCapitalize="none"
                    // onFocus={() => handleSearchOnFocus()}
                    onEndEditing={() => handleSearchEndEditing()}
                    rightIcon={!isSearchIconHidden && <Icon name="play" type='font-awesome-5' size={18} onPress={() => handleSearch()} />}
                />
                {
                    searchResults && "LISTVIEW WITH RESULTS"
                }
            </KeyboardAvoidingView>

            {!loading ?
                <MapView
                    // provider={PROVIDER_GOOGLE} 
                    region={region}
                    showsUserLocation style={styles.map}>
                    {/* <Marker
                    coordinate={latitude && { latitude: latitude, longitude: longitude }}
                    image={require('../assets/woomigo_icon.png')}
                /> */}
                </MapView> :
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size={'large'} style={{}} />
                </View>
            }

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    profileInfo: {
        textAlign: 'center'
    },
    header: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.2,
        elevation: 4,
    },
    leftComponent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerComponent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    rightComponent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        width: '100%',
        height: '100%',
    },
})

export default WooLocationScreen