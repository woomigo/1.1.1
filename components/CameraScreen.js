// import { CameraView, useCameraPermissions } from 'expo-camera/next';
// import { useState } from 'react';
// import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// const CameraScreen = ({navigation}) => {

//     const [facing, setFacing] = useState('back');
//     const [permission, requestPermission] = useCameraPermissions();

//     function toggleCameraFacing() {
//         setFacing(current => (current === 'back' ? 'front' : 'back'));
//       }

//       return (
//         <View style={styles.container}>
//           <CameraView style={styles.camera} facing={facing}>
//             <View style={styles.buttonContainer}>
//             <TouchableOpacity style={styles.button} onPress={() =>
//                             navigation.navigate('Home')}>
//                 <Text style={styles.text}>BACK</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
//                 <Text style={styles.text}>Flip Camera</Text>
//               </TouchableOpacity>
//             </View>
//           </CameraView>
//         </View>
//       );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: 'red',
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     camera: {
//         flex: 1,
//         width: '100%'
//     },
//     buttonContainer: {
//         margin:100,
//         marginBottom: 100
//     },
//     button: {
//         backgroundColor: 'red'
//     }
// })

// export default CameraScreen;

import React, { useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon } from "@rneui/themed";
import { woo_black } from '../assets/colors';

const CameraScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <Header
                style={styles.header}
                backgroundColor={'#fff'}
                // leftComponent={

                // }
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>camera</Text>
                    </View>
                }
                rightComponent={
                    <Icon
                        name="chevron-right"
                        type='font-awesome-5'
                        color={woo_black}
                        size={25}
                        onPress={() =>
                            navigation.navigate('WooDate', { wooMedia: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" })
                        }
                    />
                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />
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

export default CameraScreen