import React from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import LayoutCommentItem from './LayoutCommentItem'

const ListViewComments = ({ comments }) => {

    const renderComments = (comment) => (
        <LayoutCommentItem comment={comment} />
    )

    return (
        <View style={styles.container}>
            <FlatList
                showsVerticalScrollIndicator={false}
                backgroundColor={"#fff"}
                keyExtractor={notification => notification.id}
                data={comments}
                renderItem={renderComments}
                initialNumToRender={3}
                maxToRenderPerBatch={3}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default ListViewComments;