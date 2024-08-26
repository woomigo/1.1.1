import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableWithoutFeedback, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dialog, Icon, Overlay, Button } from '@rneui/themed';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

import { woo_gray, woo_white } from '../assets/colors';
import { db, storage } from '../firebaseConfig';


const LayoutGalleryWooItem = ({ uid, woo, nav, navParams, kind, wooMedia }) => {
    const navigation = useNavigation();

    const [visible, setVisible] = useState(false);
    const [imageStorageProgress, setImageStorageProgress] = useState(0)
    const [loading, setLoading] = useState(false);

    const toggleOverlay = () => {
        setVisible(!visible);
    };

    const uploadImage = async (uri, fileType) => {
        console.log("URI " + uri)
        setLoading(true)
        const res = await fetch(uri);
        console.log("RES " + JSON.stringify(res))
        if (res.ok) {
            const blobImage = await res.blob()
            console.log("BLOB " + JSON.stringify(blobImage))
            const storageRef = ref(storage, "gallery/" + uid + new Date().getTime())

            const uploadTask = uploadBytesResumable(storageRef, blobImage)

            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    setImageStorageProgress(progress.toFixed())
                },
                (error) => {
                    console.error(`UPLOAD IMAGE TO STORAGE ERROR === ${error}`)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
                        console.log(url)
                        addMediaToProfile(url)
                    })
                }
            )
        }
        console.log("UPLOAD DONE")
    }

    const wooRef = doc(db, "woos", "td9KvsNdsk39XblHAE4l");

    const addMediaToProfile = async (url) => {
        console.log("ADD MEDIA " + url)
        await updateDoc(wooRef, {
            woo_gallery: arrayUnion(url)
        });
        setLoading(false)
        navigation.popToTop();
        navigation.navigate('Camera')
    }

    useEffect(() => {
        console.log(`LVGI WOO === ${JSON.stringify(woo)}`)
        // setWooData(woo.item.data())
    })

    return (
        <View style={styles.gridContainer}>
            <TouchableWithoutFeedback
                onPress={() => {
                    if (kind == "wooGallery") {
                        toggleOverlay()
                    } else {
                        navigation.navigate(`${nav}`, `${navParams}`)
                    }

                }}>
                <Image
                    style={styles.gridImage}
                    source={{ uri: woo.item.woo_media_url }}
                />


            </TouchableWithoutFeedback>

            {
                kind == "wooGallery" &&

                <Overlay overlayStyle={styles.overlay} isVisible={visible} onBackdropPress={toggleOverlay}>
                    <Text style={styles.textPrimary}>Are you sure?</Text>
                    <Text style={styles.textSecondary}>
                        {woo.item.woo_date} {woo.item.woo_time}
                    </Text>
                    <Text style={styles.textSecondary}>
                        {woo.item.woo_location.coords.latitude}
                    </Text>
                    <Image
                        style={styles.overlayImage}
                        source={{ uri: woo.item.woo_media_url }}
                    />
                    {/* <Button
                    icon={
                        <Icon
                            name="lock"
                            type="font-awesome"
                            color={woo_white}
                            size={25}
                            iconStyle={{ marginRight: 10 }}
                        />
                    }
                    title="send a private woo"
                    onPress={() => {
                        toggleOverlay()
                        navigation.navigate('WooMigos', { wooMedia: wooMedia, wooType: "private" })

                    }}
                    buttonStyle={{ margin: 10, backgroundColor: woo_orange }}
                /> */}
                    <Button
                        // icon={
                        //     <Icon
                        //         name="times"
                        //         type="font-awesome"
                        //         color={woo_white}
                        //         size={25}
                        //         iconStyle={{ marginRight: 10 }}
                        //     />
                        // }
                        title="add to woo gallery"
                        onPress={() => uploadImage(wooMedia.uri)}
                        buttonStyle={{ marginTop: 20, backgroundColor: woo_gray }}
                    />

                    <Dialog isVisible={loading}>
                        <Dialog.Title title="uploading image to woo gallery" titleStyle={{ textAlign: 'center' }} />

                        <Dialog.Loading />
                    </Dialog>
                </Overlay>}
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    horizontalImage: {
        margin: 5
    },

    gridContainer: {
        flex: 1,
        height: 200,
        width: '100%',
        margin: 3
    },
    gridImage: {
        flex: 1,
        height: '100%',
        width: '100%',
        resizeMode: 'cover',
        borderRadius: 5
    },
    overlay: {
        flex: .6,
        width: "80%",
        padding: 20,
        alignItems: 'center'
        // backgroundColor: 'red'
    },
    overlayImage: {
        flex: .6,
        // height: 1,
        width: 150,
        resizeMode: 'cover',
        borderRadius: 5
    },
    listImage: {
        width: '100%',
        height: 500,
        borderRadius: 5,
    },
    textPrimary: {
        marginVertical: 20,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    textSecondary: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 17,
    },
})

export default LayoutGalleryWooItem;