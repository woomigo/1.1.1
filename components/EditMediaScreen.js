import { View, Text, StyleSheet, TouchableOpacity, Pressable, ImageBackground } from "react-native";
import { Icon } from "@rneui/themed";

const EditMediaScreen = ({ navigation, route }) => {
    const { wooMedia, isImage } = route.params;

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
                        <TouchableOpacity style={styles.button} onPress={() =>
                            navigation.navigate('WooDate', { wooMedia: wooMedia })
                        }>
                            <Icon
                                name="chevron-right"
                                type='font-awesome-5'
                                color={'white'}
                                size={35}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>

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