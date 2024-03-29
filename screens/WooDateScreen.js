import React, { useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon, LinearProgress } from "@rneui/themed";
import RNDateTimePicker from '@react-native-community/datetimepicker';

const WooDateScreen = ({ route, navigation }) => {

    const { wooMedia } = route.params;

    const [date, setDate] = useState(new Date())

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
                            navigation.navigate('WooTime', {wooMedia: wooMedia, wooDate: date})
                        }
                    />
                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />

            <LinearProgress
                style={{}}
                value={.17}
                color="#f37320"
                variant="determinate"
            />

            <View style={{ alignItems: 'center', justifyContent: 'center' }}>

                <Text style={{ marginTop: 10, fontSize: 24, fontWeight: 'bold' }}>{date.toLocaleDateString('en-us')}</Text>
                <RNDateTimePicker style={{ marginTop: 50 }} display='inline' mode="date" value={date} onChange={(event, date) => setDate(date)} minimumDate={today} />

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

export default WooDateScreen