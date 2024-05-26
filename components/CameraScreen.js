import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef } from 'react';
import { Button, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from "@rneui/themed";

const CameraScreen = ({navigation}) => {
    const [facing, setFacing] = useState('back');
    const [image, setImage] = useState()
    const [permission, requestPermission] = useCameraPermissions();
    

    const camRef = useRef(null);

    const captureImage = async () => {
        if (camRef) {
            try {
                const imgData = await camRef.current.takePictureAsync({
                    base64: false,
                    // imageType: Camera.ImageType.png,
                });
                setImage(imgData);
                navigation.navigate('EditMedia', { wooMedia: imgData, isImage: true })
            } catch (err) {
                console.log(err);
            }
        }
        console.log(image)
    }

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    return (
        <View style={styles.container}>
            <CameraView style={styles.camera} ref={camRef} facing={facing}>
                <View style={styles.buttonContainer}>
                    {/* <View style={styles.topButtonContainer}>
                        <TouchableOpacity style={styles.flipCameraButton} onPress={toggleCameraFacing}>
                            <Icon
                                name="repeat"
                                type='font-awesome-6'
                                color={'white'}
                                size={30}
                            />
                        </TouchableOpacity>
                    </View> */}
                    <View style={styles.bottomButtonContainer}>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                            <Icon
                                name="repeat"
                                type='font-awesome-6'
                                color={'white'}
                                size={40}
                            />
                        </TouchableOpacity>
                        <Pressable style={styles.button} onPress={captureImage}>
                            <Icon
                                name="circle"
                                type='font-awesome-6'
                                color={'white'}
                                size={50}
                            />
                        </Pressable>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                            <Icon
                                name="upload"
                                type='font-awesome-6'
                                color={'white'}
                                size={40}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent',
        // marginTop: 40
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        flexDirection: 'column',
        justifyContent: 'flex-end'
    },
 
    bottomButtonContainer: {
        marginBottom: 50,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
    },
});

export default CameraScreen