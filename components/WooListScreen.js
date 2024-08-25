import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView } from "react-native";
import { Header, Icon, LinearProgress, Input } from "@rneui/themed";
import { woo_black, woo_orange } from '../assets/colors';
import ListViewChips from "./ListViewChips"

const WooListScreen = ({ route, navigation }) => {

    const { wooMedia, wooType, wooMigos, migoWoos, wooDate, wooTime, wooLocation } = route.params;

    const [list, setList] = useState([])
    const [listItem, setListItem] = useState()
    const [isListError, setIsListError] = useState()
    const [isListIconHidden, setListIconHidden] = useState(true)

    const listRef = useRef()

    const addListInput = () => {
        setList([...list, listItem])
        listRef.current.clear()
        listRef.current.blur()
    }

    const handleListOnChange = (input) => {
        if (input.length > 0) {
            setListIconHidden(false)
        } else {
            setListIconHidden(true)
        }
        setIsListError(false)
        setListItem(input)
    }

    const handleListEndEditing = () => {
        setListIconHidden(true)
    }

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
                            navigation.navigate('WooLocation', { wooMedia: wooMedia, wooType: wooType, wooMigos: wooMigos, migoWoos: migoWoos, wooDate: wooDate, wooTime: wooTime })
                        }
                    />}
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>woo list</Text>
                    </View>
                }
                rightComponent={
                    <Icon
                        name="chevron-right"
                        type='font-awesome-5'
                        color={woo_black}
                        size={25}
                        onPress={() =>
                            navigation.navigate('WooPreviewEdit', { wooMedia: wooMedia, wooType: wooType, wooMigos: wooMigos, migoWoos: migoWoos, wooDate: wooDate, wooTime: wooTime, wooLocation: wooLocation, wooList: list })
                        }
                    />
                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />
            <LinearProgress
                style={{}}
                value={.83}
                color={woo_orange}
                variant="determinate"
            />

            <KeyboardAvoidingView behavior='position'>
                <Input
                    value={listItem}
                    ref={listRef}
                    onChangeText={text => handleListOnChange(text)}
                    placeholder='add an item'
                    leftIcon={<Icon style={{paddingEnd:5}} type='font-awesome-5' name='clipboard-list' size={18}/>}
                    // errorStyle={{ color: 'red' }}
                    // errorMessage={isListError && "sorry we couldn't find that List"}
                    autoCapitalize="none"
                    // onFocus={() => handleListOnFocus()}
                    onEndEditing={() => handleListEndEditing()}
                    rightIcon={!isListIconHidden && <Icon name="play" type='font-awesome-5' size={18} onPress={() => addListInput()} />}
                />
            </KeyboardAvoidingView>
            <ListViewChips chips={list}/>

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

export default WooListScreen