import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, ImageBackground } from "react-native";
import { Icon, Overlay, Button } from "@rneui/themed";
import { woo_black, woo_orange, woo_white } from '../assets/colors';

const EditMediaScreen = ({ navigation, route }) => {
    const { wooMedia, isImage } = route.params;
    const [visible, setVisible] = useState(false);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    return (
        <View style={styles.container}>
            <ImageBackground
                style={{ flex: 1, width: '100%' }}
                source={wooMedia}
                // placeholder={{ blurhash }}
                contentFit="cover"
                transition={1000}
            ><View style={styles.buttonContainer}>
                    <View style={styles.topButtonContainer}>
                        <TouchableOpacity style={styles.flipCameraButton} onPress={() => navigation.navigate('Camera')}>
                            <Icon
                                name="times"
                                type='font-awesome-5'
                                color={'white'}
                                size={30}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bottomButtonContainer}>
                        <TouchableOpacity style={styles.button} >
                            <Icon
                                name="user-plus"
                                type='font-awesome-5'
                                color={'white'}
                                size={30}
                            />
                        </TouchableOpacity>
                        <Pressable style={styles.button} >
                            <Icon
                                name="images"
                                type='font-awesome-5'
                                color={'white'}
                                size={30}
                            />
                        </Pressable>
                        <TouchableOpacity style={styles.button}
                            // onPress={() =>
                            //     navigation.navigate('WooDate', { wooMedia: wooMedia })
                            // }
                            onPress={toggleOverlay}
                        >
                            <Icon
                                name="chevron-right"
                                type='font-awesome-5'
                                color={woo_white}
                                size={35}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
            <Overlay overlayStyle={styles.overlay} isVisible={visible} onBackdropPress={toggleOverlay}>
                <Text style={styles.textPrimary}>woo type?</Text>
                {/* <Text style={styles.textSecondary}>
                    private woo can only be seen by 
                </Text> */}
                <Button
                    icon={
                        <Icon
                            name="lock"
                            type="font-awesome"
                            color={woo_white}
                            size={25}
                            iconStyle={{ marginRight: 10 }}
                        />
                    }
                    title="send a private woo"
                    onPress={toggleOverlay}
                    buttonStyle={{margin: 10, backgroundColor:woo_orange}}
                />
                <Button
                    icon={
                        <Icon
                            name="globe"
                            type="font-awesome"
                            color={woo_white}
                            size={25}
                            iconStyle={{ marginRight: 10 }}
                        />
                    }
                    title="post a public woo"
                    onPress={toggleOverlay}
                    buttonStyle={{margin: 10, backgroundColor:woo_orange}}
                />
                <Button
                    icon={
                        <Icon
                            name="times"
                            type="font-awesome"
                            color={woo_white}
                            size={25}
                            iconStyle={{ marginRight: 10 }}
                        />
                    }
                    title="back to edit woo"
                    onPress={toggleOverlay}
                    buttonStyle={{margin: 10, backgroundColor:'red'}}
                />
            </Overlay>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'space-between'
    },
    topButtonContainer: {
        // backgroundColor: 'red',
        flexDirection: 'row',
        marginTop: 75,
        marginHorizontal: 20
    },
    bottomButtonContainer: {
        // backgroundColor: 'green',
        marginBottom: 50,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    overlay: {
        padding: 40,
        // backgroundColor: 'red'
    },
    button: {
        margin: 10
    },
    textPrimary: {
        marginVertical: 20,
        textAlign: 'center',
        fontSize: 20,
    },
    textSecondary: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 17,
    },
})

// buttonContainer: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     justifyContent: 'space-between'
// },
// topButtonContainer: {
//     backgroundColor: 'red',
//     flexDirection: 'row',
//     marginTop: 75,
//     marginHorizontal: 20
// },
// bottomButtonContainer: {
//     // backgroundColor: 'green',
//     marginBottom: 75,
//     marginHorizontal: 20,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center'
// },

export default EditMediaScreen;