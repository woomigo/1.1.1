import React, { useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon, LinearProgress } from "@rneui/themed";
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { woo_black, woo_orange } from '../assets/colors';

const WooTimeScreen = ({ route, navigation }) => {

    const { wooMedia, wooType, wooMigos, wooDate } = route.params;

    const [time, setTime] = useState(new Date())

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate());
    const today = currentDate;

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
                            navigation.navigate('WooDate', { wooMedia: wooMedia, wooType: wooType, wooMigos: wooMigos })
                        }
                    />}
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>woo time</Text>
                    </View>
                }
                rightComponent={
                    <Icon
                        name="chevron-right"
                        type='font-awesome-5'
                        color={woo_black}
                        size={25}
                        onPress={() =>
                            navigation.navigate('WooLocation', {wooMedia: wooMedia, wooType: wooType, wooMigos: wooMigos, wooDate: wooDate, wooTime: time.toLocaleTimeString('en-us', { timeStyle: 'short' })})
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
                color={woo_orange}
                variant="determinate"
            />


            <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                <Text style={{ marginTop: 10, fontSize: 24, fontWeight: 'bold' }}>{time.toLocaleTimeString('en-us', { timeStyle: 'short' })}</Text>
                <RNDateTimePicker style={{ marginTop: 50 }} display="spinner" mode="time" value={time} onChange={(event, time) => setTime(time)} minimumDate={today} />

            </View>
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
})

export default WooTimeScreen