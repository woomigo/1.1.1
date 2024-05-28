import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Keyboard, TouchableWithoutFeedback } from "react-native";
import { Header, Icon, LinearProgress, Input } from "@rneui/themed";
import { woo_black, woo_white } from '../assets/colors';
import ListViewChips from "./ListViewChips"
import { Chips } from './shared';

const WooListView = ({ navigation: { navigate } }) => {

   

    return (

        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

            <View style={styles.container}>
                <Header
                    containerStyle={styles.header}
                    backgroundColor={woo_white}
                    leftComponent={
                        <Icon
                            name="chevron-left"
                            type='font-awesome-5'
                            color={woo_black}
                            size={20}
                            onPress={() =>
                                navigate('Home')
                            }
                        />
                    }
                    centerComponent={
                        <View >
                          <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>woo list</Text>
                        </View>
                      }
                      leftContainerStyle={styles.leftComponent}
                      centerContainerStyle={styles.centerComponent}
                />
                <ListViewChips chips={Chips}/>
            </View>
        </TouchableWithoutFeedback>


    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: woo_white
    },
    header: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
        marginBottom: 20
    },
    leftComponent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerComponent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default WooListView