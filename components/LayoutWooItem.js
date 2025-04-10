import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LayoutWooImage from "./LayoutWooImage";
import LayoutWooInfo from "./LayoutWooInfo";
import LayoutWooLike from "./LayoutWooLike";
import { woo_white } from "../assets/colors";
// import LayoutWooVideo from './LayoutWooVideo';

const LayoutWooItem = ({ woo, uid, currentVisibleIndex, currentIndex }) => {
  useEffect(() => {
    console.log(`LISTVIEWWOOITEM ==== ${JSON.stringify(woo.item.id)}`);
  });

  return (
    <View style={styles.container}>
      {woo.item.data().woo_media_url != null ? (
        <LayoutWooImage
          uid={uid}
          wooDate={woo.item.data().woo_date}
          wooID={woo.item.id}
          image={woo.item.data().woo_media_url}
          ownerUID={woo.item.data().owner_uid}
          wooLikes={woo.item.data().woo_likes}
          wooMigos={woo.item.data().woo_migos}
          wooType={woo.item.data().woo_type}
          wooTime={woo.item.data().woo_time}
          startTime={woo.item.data().woo_start_time}
          endTime={woo.item.data().woo_end_time}
          wooLocation={woo.item.data().woo_location}
          wooComments={woo.item.data().woo_comments}
          wooGallery={woo.item.data().woo_gallery}
          wooList={woo.item.data().woo_list}
        />
      ) : (
        <LayoutWooVideo
          video={woo.item.data().video}
          currentVisibleIndex={currentVisibleIndex}
          currentIndex={currentIndex}
        />
      )}
      <LayoutWooLike
        uid={uid}
        wooID={woo.item.id}
        ownerUID={woo.item.data().owner_uid}
        wooLikes={woo.item.data().woo_likes}
        wooMigos={woo.item.data().woo_migos}
        wooType={woo.item.data().woo_type}
      />
      <LayoutWooInfo
        uid={uid}
        wooType={woo.item.data().woo_type}
        ownerUID={woo.item.data().owner_uid}
        sharedProfilePic={woo.item.data().shared_by_profile_pic}
        wooMigos={woo.item.data().woo_migos}
        wooDate={woo.item.data().woo_date}
        wooTime={woo.item.data().woo_time}
        wooLocation={woo.item.data().woo_location}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 14,
    backgroundColor: woo_white,
    padding: 5,
    paddingBottom: 10,
    marginBottom: 5,
  },
});

export default LayoutWooItem;
