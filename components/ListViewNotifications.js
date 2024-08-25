import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import LayoutNotificationItem from './LayoutNotificationItem';
import { woo_white } from '../assets/colors';

const ListViewNotifications = ({ notifications }) => {

    const renderNotifications = (notification) => (
        <LayoutNotificationItem notification={notification} />
    )

    return (
        <View style={styles.container}>
            <FlatList
                showsVerticalScrollIndicator={false}
                backgroundColor={"#fff"}
                keyExtractor={notification => notification.id}
                data={notifications}
                renderItem={renderNotifications}
                initialNumToRender={3}
                maxToRenderPerBatch={3}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: woo_white
    }
})

export default ListViewNotifications;