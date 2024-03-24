import React, { useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon } from "@rneui/themed";
import RNDateTimePicker from '@react-native-community/datetimepicker';
const WooDateScreen = ({ navigation }) => {

    const [date, setStateDate] = useState(new Date())

    let currentDate = new Date();
    currentDate.setDate(currentDate.getDate());
    const today = currentDate;

    const setDate = (event, date) => {
        const {
            type,
            nativeEvent: { timestamp, utcOffset },
        } = event;

        setStateDate(date)
    };

    <RNDateTimePicker onChange={this.setDate} />;

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
                            navigation.navigate('Camera')
                        }
                    />}
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: "#f37320", textAlign: 'center', fontWeight: 'bold' }}>woo date</Text>
                    </View>
                }
                rightComponent={
                    <Icon
                        name="chevron-right"
                        type='font-awesome-5'
                        color="#f37320"
                        size={25}
                        onPress={() =>
                            navigation.navigate('WooTime')
                        }
                    />
                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />

            <View style={{ alignItems: 'center', justifyContent: 'center' }}><RNDateTimePicker mode="date" value={date} minimumDate={today} /></View>

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

export default WooDateScreen