import React, { useState } from 'react'
import { Text, StyleSheet, View, Platform, Alert } from 'react-native'
import { Header, Icon, Dialog } from "@rneui/themed";
import { Notifications } from './shared';
import ListViewNotifications from './ListViewNotifications';
import { woo_black } from '../assets/colors';

const NotificationsScreen = ({navigation}) => {
    const [isNewNotification, setIsNewNotification] = useState(true)

    const clearNotifications = () => {
        setIsNewNotification(false)
    }

    const confirmClearNotifications = () =>
        Alert.alert(
            "Clear Notifications",
            "Are you sure you want to mark all unread notifications as read?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Clear",
                    style: "destructive",
                    onPress: () => {
                        console.log("Clear Pressed")
                        clearNotifications
                    }
                }
            ]
        );

    return (
        <View style={styles.container}>
            <Header
                style={styles.header}
                backgroundColor={'#fff'}

                // leftComponent={
                    
                // }
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: {woo_black}, textAlign: 'center', fontWeight: 'bold' }}>notifications</Text>
                    </View>
                }
                rightComponent={

                    <Icon
                        name="bell"
                        type='font-awesome-5'
                        solid={isNewNotification}
                        color={woo_black}
                        size={25 }
                        onPress={confirmClearNotifications}
                    />
                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />

           <ListViewNotifications notifications={Notifications} />

        </View>
    )
}

const styles = StyleSheet.create({
    safeAreaViewStyle: {
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    container: {
        flex: 1
    },
    header: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4
    },
    migosText: {
        fontSize: 18,
        color: "#f37320",
        fontWeight: 'bold'
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

export default NotificationsScreen




// import React, { useState } from 'react';
// import { View, Text, StyleSheet } from "react-native";
// import { Header, Icon } from "@rneui/themed";

// const NotificationsScreen = ({ navigation }) => {

//     return (
//         <View style={styles.container}>
//             <Header
//                 style={styles.header}
//                 backgroundColor={'#fff'}
//                 leftComponent={
//                     <Icon
//                         name="chevron-left"
//                         type='font-awesome-5'
//                         color="#f37320"
//                         size={25}
//                         onPress={() =>
//                             navigation.navigate('Home')
//                         }
//                     />}
//                 centerComponent={
//                     <View >
//                         <Text style={{ fontSize: 25, color: "#f37320", textAlign: 'center', fontWeight: 'bold' }}>notifications</Text>
//                     </View>
//                 }
//                 // rightComponent={
             
//                 // }
//                 rightContainerStyle={styles.rightComponent}
//                 leftContainerStyle={styles.leftComponent}
//                 centerContainerStyle={styles.centerComponent}
//             />
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
// })

// export default NotificationsScreen