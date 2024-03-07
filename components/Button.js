import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

const Button = () => {
    <View>
        <TouchableOpacity style={styles.loginBtnStyle} onPress={() => onSubmitHandler()}>
            <Text style={styles.loginBtnTextStyle}>log in</Text>
        </TouchableOpacity>
    </View>
}

const styles = StyleSheet.create({

})

export default Button;