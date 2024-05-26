import React, {useState} from 'react'
import { View, StyleSheet, FlatList, } from 'react-native'
import LayoutMessageItem from './LayoutMessageItem'
import LayoutComposeMessageItem from './LayoutComposeMessageItem'

const ListViewMessages = ({ messages, kind="preview" }) => {

    const [uid, setUid] = useState(134)

    const renderMessages = (message) => (
        <LayoutMessageItem message={message} />
    )


    const renderComposeMessages = (message) => {
        <LayoutComposeMessageItem uid={message.item.uid} messageUID={message.item.uid} message={message.item.message} profilePic={message.item.profilePic} username={message.item.username} time={message.item.time} messageId={message.item.id} />
    }

    return (
        <View style={styles.container}>

            {
                kind === "preview" ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        backgroundColor={"#fff"}
                        keyExtractor={message => message.id}
                        data={messages}
                        renderItem={renderMessages}
                        initialNumToRender={3}
                        maxToRenderPerBatch={3}
                    />
                    :
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        keyExtractor={message => message.id}
                        data={messages}
                        // initialNumToRender={3}
                        renderItem={renderComposeMessages} />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})

export default ListViewMessages;