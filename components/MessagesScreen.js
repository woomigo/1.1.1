import React, { useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon } from "@rneui/themed";
import { Messages } from './shared';
import ListViewMessages from './ListViewMessages';
import { woo_black } from '../assets/colors';


const MessagesScreen = ({ navigation }) => {

    return (
        <View style={styles.container}>
            <Header
                style={styles.header}
                backgroundColor={'#fff'}
                // leftComponent={

                //    }
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>messages</Text>
                    </View>
                }
                rightComponent={

                    <Icon
                        name="comment-medical"
                        type='font-awesome-5'
                        color={woo_black}
                        size={20}
                        onPress={() =>
                            navigation.navigate('ComposeMessage')
                        }

                    />

                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />

            <ListViewMessages messages={Messages} kind="preview" />

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

export default MessagesScreen