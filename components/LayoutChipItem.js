import React, { useEffect } from 'react';
import { View, TouchableWithoutFeedback } from 'react-native';
import { Chip } from '@rneui/themed';
import { useNavigation } from '@react-navigation/native';
import { woo_orange } from '../assets/colors';


const LayoutChipItem = ({ chip, size, wooID }) => {
    useEffect(()=> {
     
    })
    const navigation = useNavigation();

    const setHorizontalSize = () => {
        switch (size) {
            case 'med':
                return 40;
            case 'lrg':
                return 60;
            case 'xlrg':
                return 80;  
            case 'small':
            default:
                return 25;
        }
    }

    return (
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start'}}>
            <TouchableWithoutFeedback
                onPress={() => {
                    console.log('chip pressed')
                    navigation.navigate("WooListView",
                    {wooID: wooID}
                )
                }}>
             <Chip  onPress={() => {
                    console.log('chip pressed')
                    navigation.navigate("WooListView",
                    {wooID: wooID}
                )
                }} title={chip} color={woo_orange} containerStyle={{marginStart: 10, marginVertical: 10 }} />
            </TouchableWithoutFeedback>
        </View>
    )

}

export default LayoutChipItem;