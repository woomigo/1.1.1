import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card } from '@rneui/themed';
import ListViewChips from './ListViewChips';

const LayoutWooList = ({ chips, wooID }) => {

    return (
        <View>
            {
                chips.length > 0 ?
                    <Card containerStyle={styles.container}>
                        <View style={styles.wooListContainer}>
                            <ListViewChips wooID={wooID} chips={chips} view={'horizontal'} />
                        </View>
                    </Card>
                    :
                    < Card containerStyle={styles.textContainer}>
                        <Text style={styles.text}>no woo list</Text>
                    </Card >
            }
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 5,
        margin: 0,
        paddingHorizontal: 5,
        paddingVertical: 5,
    },
    wooListContainer: {
        justifyContent: 'space-between',
        // backgroundColor: 'red',
        flexDirection: 'row',
    },
    textContainer: {
        width: '100%',
        borderRadius: 5,
        margin: 0,
        paddingHorizontal: 5,
        paddingVertical: 5,
        alignItems: 'center'
    },
    text: {
        margin: 10
    }
})

export default LayoutWooList;