import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from "react-native";
import { Header, Icon, LinearProgress } from "@rneui/themed";
import { woo_black, woo_orange } from '../assets/colors';
import { Migos } from './shared';
import ListViewUsers from './ListViewUsers';

const WooMigosScreen = ({ route, navigation }) => {

    const { wooMedia, wooType } = route.params;

    const [migos, setMigos] = useState([])
    const [selectedMigos, setSelectedMigos] = useState([])

    const returnMigosSelected = (migoList) => {
        setSelectedMigos(migoList)
    }

    useEffect(() => {
        const docRef = doc(db, "users", uid);
        const getMigos = onSnapshot(docRef, (doc) => {
            // console.log("Document data:", doc.data());
            setUser(doc.data())
            setFollowing(doc.data().following)
            setFollowers(doc.data().followers)
            setMigos(doc.data().migos)
        }, (error) => {

        })

        return () => {
            getMigos()
        };
    }, [])

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
                            navigation.navigate('EditMedia', { wooMedia: wooMedia })
                        }
                    />}
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>woo migos</Text>
                    </View>
                }
                rightComponent={
                    <Icon
                        name="chevron-right"
                        type='font-awesome-5'
                        color={woo_black}
                        size={25}
                        onPress={() =>
                            navigation.navigate('WooDate', { wooMedia: wooMedia, wooType: wooType, wooMigos: selectedMigos })
                        }
                    />
                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />
            <LinearProgress
                style={{}}
                value={.17}
                color={woo_orange}
                variant="determinate"
            />

            <ListViewUsers users={Migos} returnUsers={returnMigosSelected} searchBoxPlaceholder="search migos" kind="checkbox" />

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

export default WooMigosScreen