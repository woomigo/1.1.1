import React from "react";
import { View } from "react-native";

const TextInput = ({value, onChange, placeholder, type, secure}) => {
    return (
        <View>
            <TextInput
                value={value}
                onChangeText={onChange}
                placeholder={placeholder}
                style={{
                    borderWidth: 1,
                    borderColor: "#f37320",
                    marginBottom: 10,
                    padding: 5,
                    paddingLeft: 10,
                    borderRadius: 5
                }}
                keyboardType={type}
                autoCapitalize="none"
                secureTextEntry={secure} />
        </View>
    )
}

export default TextInput;