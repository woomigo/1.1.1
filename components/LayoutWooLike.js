import React, { useState } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View, StyleSheet, Text, Image, FlatList, Alert } from 'react-native';
import { Icon } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { woo_black, woo_gray } from '../assets/colors';
// import LayoutMigosItem from './LayoutMigosItem';

const LayoutWooLike = ({ wooMigos, wooType }) => {
    const navigation = useNavigation();

    const [isLiked, setIsLiked] = useState(false);

    const toggleIsLiked = () => {
        setIsLiked(!isLiked)
    }

    const confirmAddToWoo = () =>
        Alert.alert(
            "Add Woo",
            "Are you sure you would like to add this woo to your woos?",
            [
                {
                    text: "Add",
                    onPress: () => navigation.navigate('Woos'),
                    style: "default"
                },
                {
                    text: "Cancel",
                    style: "destructive",
                    onPress: () => {
                        console.log("Clear Pressed")
                        clearNotfications
                    }
                }
            ]
        );


    return (
        <View style={styles.container}>
            <View style={styles.likesWooMigosContainer}>
                <View style={styles.likesContainer}>
                    <TouchableWithoutFeedback onPress={toggleIsLiked}>
                        <Icon
                            name="heart"
                            type='font-awesome-5'
                            color="#f37320"
                            solid={isLiked}
                        />
                    </TouchableWithoutFeedback >
                    {wooType !== 'private' ?
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('Share')
                            }>
                            <Icon
                                name="share"
                                type='font-awesome-5'
                                color={woo_gray}
                            />
                        </TouchableOpacity>
                        : <TouchableOpacity></TouchableOpacity>
                    }

                    {wooType === 'publish' ? <TouchableOpacity onPress={confirmAddToWoo}>
                        <Icon
                            name="plus-square"
                            type='font-awesome-5'
                            color={woo_gray}
                        />
                    </TouchableOpacity> : <TouchableOpacity></TouchableOpacity>}

                </View>
                <View style={styles.wooMigosContainer}>
                    <View>
                        <TouchableOpacity
                            onPress={() =>
                                navigation.navigate('WooMigosView')
                            }>
                            <Text style={styles.wooMigoCountText}>{Object.keys(wooMigos).filter((key) => key >= 0).length}</Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.wooMigosImagesContainer}>
                        <Image
                            style={styles.wooMigoImage}
                            source={{ uri: wooMigos[0] }}
                        />

                        <Image
                            style={styles.wooMigoImage}
                            source={{ uri: wooMigos[1] }}
                        />

                        <Image
                            style={styles.wooMigoImage}
                            source={{ uri: wooMigos[2] }}
                        />

                        <Image
                            style={styles.wooMigoImage}
                            source={{ uri: wooMigos[3] }}
                        />
                    </View>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: .7,
        paddingTop: 5,
        paddingBottom: 5,
        marginTop: 5

    },
    likesWooMigosContainer: {
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        flexDirection: 'row',
    },
    likesContainer: {
        flex: 1,
        justifyContent: 'space-around',
        // backgroundColor: 'yellow',
        flexDirection: 'row',

    },
    wooMigosContainer: {
        flex: 1,
        // backgroundColor: 'green',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginEnd: 5,

    },
    wooMigoCountText: {
        textDecorationLine: "underline"
    },
    wooMigosImagesContainer: {
        flexDirection: 'row',
    },
    wooMigoImage: {
        width: 30,
        height: 30,
        borderRadius: 25,
        marginEnd: 5
    },
    button: {
        margin: 10,
        // backgroundColor: 'blue',
        // color: '#f37320'
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
    // overlay: {
    //     width: '80%'
    // }
})

export default LayoutWooLike;