import { CameraView, useCameraPermissions } from 'expo-camera/next';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const CameraScreen = ({navigation}) => {

    const [facing, setFacing] = useState('back');
    const [permission, requestPermission] = useCameraPermissions();

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
      }
    
      return (
        <View style={styles.container}>
          <CameraView style={styles.camera} facing={facing}>
            <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() =>
                            navigation.navigate('Home')}>
                <Text style={styles.text}>BACK</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                <Text style={styles.text}>Flip Camera</Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
        alignItems: 'center',
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
        width: '100%'
    },
    buttonContainer: {
        margin:100,
        marginBottom: 100
    },
    button: {
        backgroundColor: 'red'
    }
})

export default CameraScreen;