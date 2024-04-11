import React from 'react';
import { View, StyleSheet, Text, Image, TouchableWithoutFeedback, TouchableOpacity, Linking } from 'react-native';
import { Icon, Avatar } from "@rneui/themed";

const LayoutWooInfo = ({ wooType, username, startTime, endTime, wooDate, profilePic, sharedProfilePic }) => {
    // console.log(`type: ${type}`)

    const openCal = () => {
        if (Platform.OS === 'ios') {
            Linking.openURL('calshow:');
        } else if (Platform.OS === 'android') {
            Linking.openURL('content://com.android.calendar/time/');
        }
    }

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row'}}>     
            <TouchableWithoutFeedback style={styles.wooOwnerImageContainer}>
                <Avatar
                    rounded
                    size="medium"
                    source={{ uri: profilePic }}
                />
            </TouchableWithoutFeedback>
            <View style={{ justifyContent: 'flex-end'}}>
                <TouchableWithoutFeedback >
                <Text style={styles.wooOwnerUsernameText}>@{username}</Text>
            </TouchableWithoutFeedback> 
            </View>
           
            </View>
            <View style={styles.textContainer}>
                <TouchableOpacity onPress={openCal} style={styles.timeDateContainer}>
                    <Icon
                        name="clock"
                        type='font-awesome-5'
                        color="#f37320"
                        size={16}
                    />
                    <Text style={styles.wooDateTimeText}>{`${wooDate} @ ${startTime} ${endTime === undefined ? "" : `-`} ${endTime === undefined ? "" : endTime}`}</Text>

                </TouchableOpacity>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 5,
        paddingBottom: 5,
        // backgroundColor: 'yellow'
    },

    wooOwnerUsernameText: {
        fontWeight: 'bold',
    },
    wooDateTimeText: {
        // fontSize: 12,
        marginStart: 3
    },
    wooUsernameProfileImage: {
        width: 35,
        height: 35,
        borderRadius: 25,
    },
    textContainer: {
        marginStart: 5,
        justifyContent: 'flex-end',
        // backgroundColor: 'green'
    },
    timeDateContainer: {
        flexDirection: 'row'
    },
})

export default LayoutWooInfo;