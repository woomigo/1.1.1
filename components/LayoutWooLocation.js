import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Platform, Linking } from 'react-native';
import { Icon, Card } from "@rneui/themed";
import { woo_gray, woo_black } from '../assets/colors';

// import {openMap, createOpenLink} from 'react-native-open-maps';
//import { createOpenLink } from 'react-native-open-maps';

const LayoutWooLocation = ({ wooLocation, wooTime, startTime, endTime, wooDate, }) => {

    const query = { query: wooLocation };
    //const openMaps = createOpenLink(query);
    const openCal = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('calshow:');
        } else if (Platform.OS === 'android') {
            Linking.openURL('content://com.android.calendar/time/');
        }
    }

    return (
        <Card containerStyle={styles.container}>
            <View style={styles.locationWooMenuContainer}>
                <TouchableOpacity style={styles.wooDateTimeContainer} onPress={openCal} >
                    <Icon
                        name="clock"
                        type='font-awesome-5'
                        color="#f37320"
                        size={16}
                    />
                    <Text style={styles.wooDateTimeText}>{wooTime ? `${wooDate} @ ${wooTime}`
                        :
                        `${wooDate} @ ${startTime} ${endTime === undefined ? "" : `-`} ${endTime === undefined ? "" : endTime}`}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.locationContainer}>
                    <Icon
                        name="map-marker-alt"
                        type='font-awesome-5'
                        color="#f37320"
                        size={16}
                    />
                    <Text style={styles.locationText}>{wooLocation}</Text>
                </TouchableOpacity>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 5,
        margin: 0,
        padding: 5
        //     flex: .7,
        //     borderBottomWidth: 1,
        //     borderBottomColor: '#b3b1b1',
        //     marginEnd: 5,
        //     marginStart: 5,
        //     paddingTop: 5,
        //     paddingBottom: 5,
        //     backgroundColor: 'purple',
        //     justifyContent: 'center'
    },
    wooDateTimeContainer: {
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'blue'
    },
    locationWooMenuContainer: {

        // backgroundColor: 'red',

    },
    locationContainer: {
        // backgroundColor: 'yellow',
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {

        // fontSize: 12,
        marginStart: 3
    },
    wooDateTimeText: {
        // fontSize: 12,
        marginStart: 3
    },
    wooMenuContainer: {
        // backgroundColor: 'green'
        flexDirection: 'row',
        alignItems: 'center',
        marginEnd: 5,

    },
})

export default LayoutWooLocation;