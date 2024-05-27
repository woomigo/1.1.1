import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Header, Icon, LinearProgress } from "@rneui/themed";
import { woo_black, woo_orange, woo_white } from '../assets/colors';
import LayoutWooGallery from './LayoutWooGallery';
import LayoutWooImage from './LayoutWooImage';
import LayoutWooInfo from './LayoutWooInfo';
import LayoutWooLike from './LayoutWooLike';
import LayoutWooLocation from './LayoutWooLocation';
import LayoutWooList from './LayoutWooList';

const WooPreviewEditScreen = ({ route, navigation }) => {

    const { wooMedia, wooDate, wooTime, wooLocation, wooMigos, wooList } = route.params;

    const navigateToProfileAndClearStack = () => {
        navigation.popToTop();
        navigation.navigate('Profile')
    }

    useEffect( () => {
        console.log(wooLocation)
    })

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
                            navigation.navigate('WooList')
                        }
                    />}
                centerComponent={
                    <View >
                        <Text style={{ fontSize: 25, color: woo_black, textAlign: 'center', fontWeight: 'bold' }}>woo preview & edit</Text>
                    </View>
                }
                rightComponent={
                    <Icon
                        name="chevron-right"
                        type='font-awesome-5'
                        color={woo_black}
                        size={25}
                        onPress={() =>
                            navigateToProfileAndClearStack()
                        }
                    />
                }
                rightContainerStyle={styles.rightComponent}
                leftContainerStyle={styles.leftComponent}
                centerContainerStyle={styles.centerComponent}
            />
            <LinearProgress
                style={{}}
                value={1}
                color={woo_orange}
                variant="determinate"
            />

            <ScrollView style={styles.wooContainer}>
                <LayoutWooInfo wooType={"post"}  profilePic={"https://images.unsplash.com/photo-1507153030234-657ffc3cf24a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3400&q=80"} username={"itsMaurice"} wooDate={wooDate} startTime={wooTime} 
                // endTime={woo.item.woo_end_time} 
                />
                {/* {woo.item.image != null ?  */}
                <LayoutWooImage wooID={0} image={wooMedia} isPreview />
                    {/* : <LayoutWooVideo video={woo.item.video} currentVisibleIndex={currentVisibleIndex} currentIndex={currentIndex} />} */}
                <LayoutWooLocation wooLocation={"1050 Howell Mill RD Atlanta, GA 30308"} />
                <LayoutWooLike wooMigos={wooMigos} wooType={"post"} />
                <LayoutWooList chips={wooList} />
            </ScrollView>

        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    wooContainer : { 
        flex: 14,
        backgroundColor: woo_white,
        padding: 5,
        marginBottom: 10
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

export default WooPreviewEditScreen