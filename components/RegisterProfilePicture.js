import React, { useState } from 'react';
import { View, Text, StyleSheet, Button } from "react-native";
import { Header, Icon, LinearProgress, Avatar } from "@rneui/themed";
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { storage } from '../firebaseConfig';

const storageRef = ref(storage, 'some-child');

const RegisterProfilePictureScreen = ({ route, navigation }) => {

    const { firstName, lastName, dob, username } = route.params;

    const [image, setImage] = useState(null);

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            // 'file' comes from the Blob or File API
            uploadBytes(storageRef, result.assets[0].uri).then((snapshot) => {
              console.log(`Uploaded a blob or file! --------> ${snapshot}`);
            }, (error) => {

            });

        }
    };

    const handleNextOnClick = () => {
        console.log('NEXT CLICKED')
        navigation.navigate('Register', { firstName: firstName, lastName: lastName, dob: dob, username: username, profilePic: image })
        console.log(`IMAGE IS ${image}`)

    }

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
                            navigation.navigate('RegisterUsername', { firstName: firstName, lastName: lastName, dob: dob })
                        }
                    />}
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: "#f37320", textAlign: 'center', fontWeight: 'bold' }}>register</Text>
                    </View>
                }
                rightComponent={
                    <Icon
                        name="chevron-right"
                        type='font-awesome-5'
                        color="#f37320"
                        size={25}
                        onPress={() => handleNextOnClick()}
                    />
                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />
            {/* <LinearProgress
                style={{}}
                value={.8}
                color="#f37320"
                variant="determinate"
            /> */}

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Button title="Pick an image from camera roll" onPress={pickImage} />
                {image && <Avatar rounded size="xlarge" source={{ uri: image }} />}
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

export default RegisterProfilePictureScreen