import {
  Camera,
  CameraView,
  useCameraPermissions,
  CameraType,
  ImageType,
} from "expo-camera";
import { useState, useEffect, useRef } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "@rneui/themed";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import { useIsFocused } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome6";
import TopSheet from "./TopSheetComponent";
import { woo_black, woo_white } from "../assets/colors";

const CameraScreen = ({ navigation }) => {
  const [facing, setFacing] = useState("back");
  const [image, setImage] = useState();
  const [video, setVideo] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [isVisible, setIsVisible] = useState(true);

  const camRef = useRef(null);

  const isFocused = useIsFocused();

  const topPosition = useSharedValue(-300); // Initial position off-screen

  useEffect(() => {
    //   console.log(CameraType.front)
    topPosition.value = isVisible ? -650 : -350;
    console.log(isFocused);
  }, [isFocused, isVisible]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      top: withTiming(topPosition.value, { duration: 300 }),
    };
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri);
      setImage(result.assets[0].uri);
      navigation.navigate("EditMedia", {
        wooMedia: result.assets[0],
        isImage: true,
      });
    }
  };

  const captureImage = async () => {
    if (camRef) {
      try {
        const imgData = await camRef.current.takePictureAsync({
          base64: false,
          // imageType: ImageType.png,
          quality: 1,
          isImageMirror: true,
        });
        if (facing === "front") {
          let photo = imgData;
          photo = await manipulateAsync(
            photo.localUri || photo.uri,
            [{ rotate: 180 }, { flip: FlipType.Vertical }],
            { compress: 1, format: SaveFormat.PNG }
          );
          setImage(photo);
          navigation.navigate("EditMedia", { wooMedia: photo, isImage: true });
        } else {
          setImage(imgData);
          navigation.navigate("EditMedia", {
            wooMedia: imgData,
            isImage: true,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
    console.log(image);
  };

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
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const toggleTopSheet = () => {
    setIsVisible(!isVisible);
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      {isFocused ? (
        <CameraView style={styles.camera} ref={camRef} facing={facing}>
          <TopSheet isVisible={isVisible} />
          {/* <View style={styles.buttonContainer}> */}
            <Animated.View style={[styles.topSheet, animatedStyle]}>
              <View style={styles.topButtonContainer}>
                <View style={styles.filterButtonContainer}>
                  <TouchableOpacity
                    style={styles.filterButton}
                    onPress={toggleTopSheet}
                  >
                    <FontAwesomeIcon
                      name="sliders"
                      size={30}
                      color={woo_black}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>

            <View style={styles.bottomButtonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={toggleCameraFacing}
              >
                <Icon
                  name="repeat"
                  type="font-awesome"
                  color={woo_black}
                  size={40}
                />
              </TouchableOpacity>
              <Pressable
                style={styles.captureButton}
                onPress={captureImage}
                // onLongPress={captureVideo}
                // onPressOut={stopVideo}
              >
                <Icon
                  name="circle"
                  type="font-awesome"
                  color={isRecording ? "red" : "white"}
                  size={50}
                />
              </Pressable>
              <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Icon
                  name="upload"
                  type="font-awesome"
                  color={woo_black}
                  size={40}
                />
              </TouchableOpacity>
            </View>
          {/* </View> */}
        </CameraView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "transparent",
    // marginTop: 40
  },
  camera: {
    flex: 1,
  },
  filterButtonContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    borderRadius: 35,
  },
  filterButton: {
    backgroundColor: "#d9d9d950",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  captureButton: {
    backgroundColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  button: {
    backgroundColor: "#d9d9d9",
    alignItems: "center",
    justifyContent: "center",
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  topButtonContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "flex-start",
    marginHorizontal: 20,
  },
  topSheetButton: {
    backgroundColor: "lightblue",
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "column",
    justifyContent: "flex-end",
  },

  bottomButtonContainer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginBottom: 50,
    marginHorizontal: 40,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

export default CameraScreen;
