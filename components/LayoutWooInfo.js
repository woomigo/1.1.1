import React from 'react';
import { View, StyleSheet, Text, Image, TouchableWithoutFeedback, TouchableOpacity, Linking } from 'react-native';
import { Icon } from "@rneui/themed";

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
            <TouchableWithoutFeedback style={styles.wooOwnerImageContainer}>
                <Image
                    style={styles.wooUsernameProfileImage}
                    source={{ uri: profilePic }}
                />
            </TouchableWithoutFeedback>
            <View style={styles.textContainer}>

                <TouchableWithoutFeedback>
                    <Text style={styles.wooOwnerUsernameText}>{username}</Text>
                </TouchableWithoutFeedback>

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
            <View style={styles.sharedByContainer}>
                <TouchableWithoutFeedback>
                    <Image
                        style={styles.sharedByImage}
                        source={{ uri: sharedProfilePic }}
                    />
                </TouchableWithoutFeedback>

                {wooType !== undefined ?
                    < Icon
                        name={wooType === "publish" ? "globe" : wooType === "public" ? "unlock" : "lock"}
                        type='font-awesome-5'
                        color="#b3b1b1"
                        size={25}
                        onPress={() =>
                            navigate('Camera')
                        } /> : < Icon
                        name="question"
                        type='font-awesome-5'
                        color="#b3b1b1"
                        size={25}
                        onPress={() =>
                            navigate('Camera')
                        } />}


            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
        paddingBottom: 5,
        // backgroundColor: 'yellow'
    },
    wooOwnerImageContainer: {
        flex: 1,
        marginStart: 5,
        alignItems: 'center'
        // backgroundColor: 'orange',
    },
    wooOwnerUsernameText: {
        fontWeight: 'bold'
    },
    wooDateTimeText: {
        fontSize: 12,
        marginStart: 3
    },
    wooUsernameProfileImage: {
        width: 35,
        height: 35,
        borderRadius: 25,
    },
    textContainer: {
        flex: 8,
        marginStart: 5,
        // backgroundColor: 'green'
    },
    sharedByContainer: {
        flex: 2,
        marginEnd: 5,
        // backgroundColor: 'pink',
        alignItems: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    sharedByImage: {
        width: 30,
        height: 30,
        borderRadius: 25,

    },
    timeDateContainer: {
        flexDirection: 'row'
    },
})

export default LayoutWooInfo;