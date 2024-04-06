import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import LayoutWooWriteComment from './LayoutWooWriteComment';
import LayoutWooGallery from './LayoutWooGallery';
import LayoutWooImage from './LayoutWooImage';
import LayoutWooInfo from './LayoutWooInfo';
import LayoutWooLike from './LayoutWooLike';
import LayoutWooLocation from './LayoutWooLocation';
import LayoutWooShowComment from './LayoutWooShowComment';
// import LayoutWooVideo from './LayoutWooVideo';

const LayoutWooItem = ({ woo, isGridView, currentVisibleIndex, currentIndex }) => {

    const [isWooOwned, setIsWooOwned] = useState(false);

    return (
        <View style={{flex:1}}>
            {!isGridView ?
                <View style={styles.container}>
                    <LayoutWooInfo wooType={woo.item.woo_type} sharedProfilePic={woo.item.shared_by_profile_pic} profilePic={woo.item.woo_owner_profile_pic} username={woo.item.woo_owner_username} wooDate={woo.item.woo_date} startTime={woo.item.woo_start_time} endTime={woo.item.woo_end_time} />
                    {woo.item.image != null ? <LayoutWooImage wooID={woo.item.id} image={woo.item.image} /> : <LayoutWooVideo video={woo.item.video} currentVisibleIndex={currentVisibleIndex} currentIndex={currentIndex} />}
                    <LayoutWooLocation wooLocation={woo.item.woo_location} />
                    <LayoutWooLike wooMigos={woo.item.woo_migos} wooType={woo.item.woo_type} />
                    <LayoutWooWriteComment />
                    <LayoutWooShowComment wooID={woo.item.id} />
                    <LayoutWooGallery wooMigos={woo.item.woo_migos} />
                </View>
                :
                <View style={styles.gridViewContainer}>
                    <Image style={styles.image} source={{ uri: woo.item.image }} />
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 14,
        backgroundColor: "#fff",
        padding: 5,
        marginBottom: 10
    },
    gridViewContainer: {
        flex: 1,
        height: 200,
        width: '100%',
        padding: 3
    }, 
    
    image: {
        flex: 1,
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
    }
})

export default LayoutWooItem;