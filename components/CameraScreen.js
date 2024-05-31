import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { Button, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from "@rneui/themed";
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { CameraType, ImageType, VideoCodec } from 'expo-camera/build/legacy/Camera.types';
import { useIsFocused } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

const CameraScreen = ({ navigation }) => {
    const [facing, setFacing] = useState('back');
    const [image, setImage] = useState()
    const [video, setVideo] = useState()
    const [isRecording, setIsRecording] = useState(false)
    const [permission, requestPermission] = useCameraPermissions();


    const camRef = useRef(null);

    const isFocused = useIsFocused()

    useEffect(() => {

      console.log(CameraType.front)

       }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
            quality: 1
        })

        if (!result.canceled) {
            console.log(result.assets[0].uri)
            setImage(result.assets[0].uri)
            navigation.navigate('EditMedia', { wooMedia: result.assets[0], isImage: true })
        }
    }

    const captureImage = async () => {
        if (camRef) {
            try {
                const imgData = await camRef.current.takePictureAsync({
                    base64: false,
                    imageType: ImageType.png,
                    quality: 1,
                    isImageMirror: true
                });
                if (facing === "front") {
                    let photo = imgData
                    photo = await manipulateAsync(
                        photo.localUri || photo.uri,
                        [
                            { rotate: 180 },
                            { flip: FlipType.Vertical },
                        ],
                        { compress: 1, format: SaveFormat.PNG }
                    );
                    setImage(photo);
                    navigation.navigate('EditMedia', { wooMedia: photo, isImage: true })
                } else {
                    setImage(imgData);
                navigation.navigate('EditMedia', { wooMedia: imgData, isImage: true })
                }

            } catch (err) {
                console.log(err);
            }
        }
        console.log(image)
    }

    // const captureVideo = async () => {
    //     setIsRecording(true)
    //     if (camRef) {
    //         try {
    //             const videoData = await camRef.current.recordAsync({quality: "4:3"});
    //             setVideo(videoData.uri);
    //             navigation.navigate('EditMedia', { wooMedia: videoData.uri, isImage: false })
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     }
    //     console.log(video)
    // }

    // const stopVideo = async () => {
    //     setIsRecording(false)
    //     if (camRef) {
    //         try {
    //             const videoData = await camRef.current.stopRecording({

    //             });
    //             setVideo(videoData);
    //             navigation.navigate('EditMedia', { wooMedia: videoData.uri, isImage: false })
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     }
    //     console.log(video)
    // }

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
            {isFocused &&
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
                            <Pressable style={styles.button} onPress={captureImage}
                            // onLongPress={captureVideo} 
                            // onPressOut={stopVideo}
                            >
                                <Icon
                                    name="circle"
                                    type='font-awesome-6'
                                    color={isRecording ? 'red' : 'white'}
                                    size={50}
                                />
                            </Pressable>
                            <TouchableOpacity style={styles.button} onPress={pickImage}>
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
            }
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