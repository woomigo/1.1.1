import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LayoutWooGallery from "./LayoutWooGallery";
import LayoutWooImage from "./LayoutWooImage";
import LayoutWooInfo from "./LayoutWooInfo";
import LayoutWooLike from "./LayoutWooLike";
import LayoutWooLocation from "./LayoutWooLocation";
import LayoutWooShowComment from "./LayoutWooShowComment";
import { woo_white } from "../assets/colors";
import LayoutWooList from "./LayoutWooList";
// import LayoutWooVideo from './LayoutWooVideo';

const LayoutWooItem = ({ woo, uid, currentVisibleIndex, currentIndex }) => {

  useEffect(() => {
    console.log(`LISTVIEWWOOITEM ==== ${JSON.stringify(woo.item.id)}`)
})

  return (
    <View style={styles.container}>
      <LayoutWooInfo
        wooType={woo.item.data().woo_type}
        ownerUID={woo.item.data().owner_uid}
        sharedProfilePic={woo.item.data().shared_by_profile_pic}
      />
      {woo.item.data().woo_media_url != null ? (
        <LayoutWooImage
          wooID={woo.item.id}
          image={woo.item.data().woo_media_url}
          isPreview={false}
        />
      ) : (
        <LayoutWooVideo
          video={woo.item.data().video}
          currentVisibleIndex={currentVisibleIndex}
          currentIndex={currentIndex}
        />
      )}
      <LayoutWooLocation
        wooDate={woo.item.data().woo_date}
        wooTime={woo.item.data().woo_time}
        startTime={woo.item.data().woo_start_time}
        endTime={woo.item.data().woo_end_time}
        wooLocation={woo.item.data().woo_location}
      />
      <LayoutWooLike
        uid={uid}
        wooID={woo.item.id}
        ownerUID={woo.item.data().owner_uid}
        wooLikes={woo.item.data().woo_likes}
        wooMigos={woo.item.data().woo_migos}
        wooType={woo.item.data().woo_type}
      />
      <LayoutWooShowComment
        wooID={woo.item.id}
        wooComments={woo.item.data().woo_comments}
      />
      <LayoutWooGallery gallery={woo.item.data().woo_gallery} nav={"WooGalleryView"} />
      <LayoutWooList
        wooID={woo.item.id}
        nav={"WooListView"}
        chips={woo.item.data().woo_list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 14,
    backgroundColor: woo_white,
    padding: 5,
    marginBottom: 5,
  },
});

export default LayoutWooItem;