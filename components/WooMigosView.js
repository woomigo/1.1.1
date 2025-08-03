import React, { useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon, Tab, TabView } from "@rneui/themed";
import { Migos } from './shared';
import ListViewUsers from './ListViewUsers';
import { woo_black, woo_orange } from '../assets/colors';

const WooMigosView = ({ navigation, route }) => {

    const { uid, migos, wooType } = route.params;

    const [index, setIndex] = useState(0);

    return (
        <View style={styles.container}>
            <Header
                style={styles.header}
                backgroundColor={'#fff'}
                leftComponent={
                    <Icon
                        name="chevron-left"
                        type='font-awesome-5'
                        color={woo_black}
                        size={25}
                        onPress={() =>
                            navigation.goBack()
                        }
                    />}
                    centerComponent={
                        <View >
                            <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>woo {wooType === "public" ? "subs" : "migos"}</Text>
                        </View>
                    }
                // rightComponent={
                 
                // }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />

            <ListViewUsers uid={uid} users={migos} hideSearchBar searchBoxPlaceholder="search woo migos" />
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
    tabHeader: {
        marginTop: 10,
        padding: 5,
        // alignItems: 'center'
    },
    tabText: {
        fontSize: 18,
        color: woo_black,
        fontWeight: 'bold',
        textAlign: 'center'
    }
})

export default WooMigosView;