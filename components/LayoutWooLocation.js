import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Icon } from "@rneui/themed";
// import {openMap, createOpenLink} from 'react-native-open-maps';
//import { createOpenLink } from 'react-native-open-maps';

const LayoutWooLocation = ({ wooLocation }) => {

    const query = { query: wooLocation };
  //const openMaps = createOpenLink(query);

    return (
        <View style={styles.container}>
            <View style={styles.locationWooMenuContainer}>
                <TouchableOpacity style={styles.locationContainer}>
                    <Icon
                        name="map-marker-alt"
                        type='font-awesome-5'
                        color="#f37320"
                        size={12}
                    />
                    <Text style={styles.locationText}>{wooLocation}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.wooMenuContainer}>
                    <Icon
                        name="ellipsis-h"
                        type='font-awesome'
                        color='#b3b1b1'
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: .7,
        borderBottomWidth: 1,
        borderBottomColor: '#b3b1b1',
        marginEnd: 5,
        marginStart: 5,
        paddingTop: 5,
        paddingBottom: 5,
    },
    locationWooMenuContainer: {
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        flexDirection: 'row',
    },
    locationContainer: {
        // backgroundColor: 'yellow',
        marginStart: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    locationText: {
        // backgroundColor: 'blue'
        fontSize: 12,
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