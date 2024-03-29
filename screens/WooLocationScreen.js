import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { Header, Icon, SearchBar,LinearProgress } from "@rneui/themed";
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const WooLocationScreen = ({ navigation }) => {

    const { wooMedia, wooDate, wooTime } = route.params;

    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [region, setRegion] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null);

    const updateSearch = (search) => {
        setSearch(search);
    };

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
                        color="#f37320"
                        size={25}
                        onPress={() =>
                            navigation.navigate('WooTime')
                        }
                    />}
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: "#f37320", textAlign: 'center', fontWeight: 'bold' }}>woo location</Text>
                    </View>
                }
                rightComponent={
                    <Icon
                        name="chevron-right"
                        type='font-awesome-5'
                        color="#f37320"
                        size={25}
                        onPress={() =>
                            navigation.navigate('WooMigos', {wooMedia: wooMedia, wooDate: wooDate, wooTime: wooTime, wooLocation: location})
                        }
                    />
                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />
            <LinearProgress
                style={{}}
                value={.50}
                color="#f37320"
                variant="determinate"
            />

            <SearchBar
                placeholder="add woo address"
                onChangeText={updateSearch}
                value={search}
            />
            {!loading ?
                <MapView region={region} showsUserLocation style={styles.map}>
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