import { View, Text, StyleSheet } from "react-native";

const WooView = () => {
    <View style={styles.container}>
        <Text>Woo View</Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default WooView;