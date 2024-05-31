import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Header, Icon, LinearProgress, Dialog } from "@rneui/themed";
import { woo_black, woo_orange, woo_white } from '../assets/colors';
import LayoutWooGallery from './LayoutWooGallery';
import LayoutWooImage from './LayoutWooImage';
import LayoutWooInfo from './LayoutWooInfo';
import LayoutWooLike from './LayoutWooLike';
import LayoutWooLocation from './LayoutWooLocation';
import LayoutWooList from './LayoutWooList';
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../firebaseConfig';
import { addDoc, collection, onSnapshot } from 'firebase/firestore';
import { } from '@rneui/base';

const WooPreviewEditScreen = ({ route, navigation }) => {

    const [uid, setUID] = useState(null);
    const [imageStorageProgress, setImageStorageProgress] = useState(0)
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log(`WOOMEDIA AT PREVIEW WOO ==== ${wooMedia.uri}`)
    }, [wooMedia])

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
            const uid = user.uid;
            setUID(user.uid)
            // ...
        } else {
            // User is signed out
            // ...
        }
    });


    const uploadImage = async (uri, fileType) => {
        const res = await fetch(uri);
        if (res.ok) {
            const blobImage = await res.blob()

            const storageRef = ref(storage, "wooMedia/" + uid + new Date().getTime())

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
                        saveMedia(url, wooType, wooMigos, wooDate, wooTime, wooLocation, wooList, new Date().getTime(), uid)
                    })
                }
            )
        }
    }

    const saveMedia = async (woo_media_url, woo_type, woo_migos, woo_date, woo_time, woo_location, woo_list, created_at, owner_uid) => {
        try {
            const docRef = await addDoc(collection(db, "woos"), {
                woo_media_url, woo_type, woo_migos, woo_date, woo_time, woo_location, woo_list, created_at, owner_uid, woo_comments: [{comment_owner_uid: 541656, comment: "test db objects comment", comment_timestamp: new Date().getTime()},{comment_owner_uid: 541657, comment: "test db objects comment 2", comment_timestamp: new Date().getTime()}], woo_gallery: []
            })
            console.log("MEDIA SAVED TO DB ", docRef.id)
            setLoading(false)
            navigation.popToTop();
            navigation.navigate('Profile')
        } catch (error) {
            console.error(error)
        }
    }

    const { wooMedia, wooType, wooMigos, wooDate, wooTime, wooLocation, wooList } = route.params;

    const navigateToProfileAndClearStack = async () => {
        setLoading(true)
        await uploadImage(wooMedia.uri, 'image')
    }

    useEffect(() => {
        console.log(wooLocation)
    })

    return (
        <View style={styles.container}>

            <Dialog isVisible={loading}>
            <Dialog.Title title="uploading woo" titleStyle={{textAlign: 'center'}} />
 
                <Dialog.Loading />
            </Dialog>

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
                            navigation.navigate('WooList', { wooMedia: wooMedia, wooType: wooType, wooMigos: wooMigos, wooDate: wooDate, wooTime: wooTime, wooLocation: wooLocation, wooList: wooList })
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
                <LayoutWooInfo wooType={wooType} profilePic={"https://images.unsplash.com/photo-1507153030234-657ffc3cf24a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3400&q=80"} username={"itsMaurice"}
                />
                {/* {woo.item.image != null ?  */}
                <LayoutWooImage wooID={0} image={wooMedia} isPreview />
                {/* : <LayoutWooVideo video={woo.item.video} currentVisibleIndex={currentVisibleIndex} currentIndex={currentIndex} />} */}
                <LayoutWooLocation wooLocation={wooLocation} wooDate={wooDate} startTime={wooTime}
                // endTime={woo.item.woo_end_time} 
                />
                <LayoutWooLike wooMigos={wooMigos} wooType={"post"} />
                <LayoutWooList chips={wooList} />
            </ScrollView>

        </View >
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },
    wooContainer: {
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