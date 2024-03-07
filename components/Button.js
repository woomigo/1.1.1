import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Button = ({buttonText, onSubmit}) => {
    return (
        <View>
            <TouchableOpacity
                style={{
                    backgroundColor: "#f37320",
                    padding: 9,
                    borderRadius: 10
                }}
                onPress={onSubmit}>
                <Text
                    style={{
                        color: "#fff",
                        textAlign: 'center'
                    }}>
                    {buttonText}
                </Text>
            </TouchableOpacity>
        </View>
    )

}

export default Button;