import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import LayoutWooWriteComment from './LayoutWooWriteComment';
import LayoutWooGallery from './LayoutWooGallery';
import LayoutWooImage from './LayoutWooImage';
import LayoutWooInfo from './LayoutWooInfo';
import LayoutWooLike from './LayoutWooLike';
import LayoutWooLocation from './LayoutWooLocation';
import LayoutWooShowComment from './LayoutWooShowComment';
import { woo_white } from '../assets/colors';
import LayoutWooList from './LayoutWooList';
import { Chips } from './shared';
// import LayoutWooVideo from './LayoutWooVideo';

const LayoutWooItem = ({ woo, uid, isGalleryView, currentVisibleIndex, currentIndex }) => {

    const [isWooOwned, setIsWooOwned] = useState(false);

    useEffect(()=> {
        // console.log(`LWI ${JSON.stringify(woo.item.data())}`)
    })

    return (

        !isGalleryView ?
            <View style={styles.container}>
                <LayoutWooInfo wooType={woo.item.data().woo_type} ownerUID={woo.item.data().owner_uid} sharedProfilePic={woo.item.data().shared_by_profile_pic} />
                {woo.item.data().woo_media_url != null ? <LayoutWooImage wooID={woo.item.data().id} image={woo.item.data().woo_media_url} isPreview={false} />
                    : <LayoutWooVideo video={woo.item.data().video} currentVisibleIndex={currentVisibleIndex} currentIndex={currentIndex} />}
                <LayoutWooLocation  wooDate={woo.item.data().woo_date} wooTime={woo.item.data().woo_time} startTime={woo.item.data().woo_start_time} endTime={woo.item.data().woo_end_time} 
                // wooLocation={woo.item.data().woo_location} 
                />
                <LayoutWooLike uid={uid} wooID={woo.item.id} wooLikes={woo.item.data().woo_likes} wooMigos={woo.item.data().woo_migos} wooType={woo.item.data().woo_type} />
                {/* <LayoutWooWriteComment />  */}
                <LayoutWooShowComment wooID={woo.item.data().id} />
                <LayoutWooGallery gallery={woo.item.data().woo_gallery} nav={'WooGalleryView'} />
                <LayoutWooList nav={'WooListView'} chips={woo.item.data().woo_list}/>
            </View>
            :
            <View style={styles.container}>
                <LayoutWooInfo wooType={woo.item.woo_type} sharedProfilePic={woo.item.shared_by_profile_pic} profilePic={woo.item.woo_owner_profile_pic} username={woo.item.woo_owner_username} wooDate={woo.item.woo_date} startTime={woo.item.woo_start_time} endTime={woo.item.woo_end_time} />
                {woo.item.woo_media_url != null ? <LayoutWooImage wooID={woo.item.id} image={woo.item.image} />
                    : <LayoutWooVideo video={woo.item.video} currentVisibleIndex={currentVisibleIndex} currentIndex={currentIndex} />}
                <LayoutWooLocation wooLocation={woo.item.woo_location} />
            </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 14,
        backgroundColor: woo_white,
        padding: 5,
        marginBottom: 5
    },
    gridContainer: {
        flex: 1,
        height: 200,
        width: '100%',
        margin: 3,
        backgroundColor: 'red'

    },
    gridImage: {
        flex: 1,
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
        borderRadius: 5,
        backgroundColor: 'green'
    },
    image: {
        flex: 1,
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
    }
})

export default LayoutWooItem;