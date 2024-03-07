import React from "react";
import { View, Text } from "react-native";

const TextLink = ({ text, link, textColor }) => {
    return (
        <View>
            <Text
                style={{ color: textColor }}
                onPress={link}
            >
                {text}
            </Text>
        </View>
    )
}

export default TextLink;