import React from "react";
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
  return (
    <View style={styles.container}>
      <LayoutWooInfo
        wooType={woo.item.woo_type}
        ownerUID={woo.item.owner_uid}
        sharedProfilePic={woo.item.shared_by_profile_pic}
      />
      {woo.item.woo_media_url != null ? (
        <LayoutWooImage
          wooID={woo.item.id}
          image={woo.item.woo_media_url}
          isPreview={false}
        />
      ) : (
        <LayoutWooVideo
          video={woo.item.video}
          currentVisibleIndex={currentVisibleIndex}
          currentIndex={currentIndex}
        />
      )}
      <LayoutWooLocation
        wooDate={woo.item.woo_date}
        wooTime={woo.item.woo_time}
        startTime={woo.item.woo_start_time}
        endTime={woo.item.woo_end_time}
        wooLocation={woo.item.woo_location}
      />
      <LayoutWooLike
        uid={uid}
        wooID={woo.item.id}
        ownerUID={woo.item.owner_uid}
        wooLikes={woo.item.woo_likes}
        wooMigos={woo.item.woo_migos}
        wooType={woo.item.woo_type}
      />
      <LayoutWooShowComment
        wooID={woo.item.id}
        wooComments={woo.item.woo_comments}
      />
      <LayoutWooGallery gallery={woo.item.woo_gallery} nav={"WooGalleryView"} />
      <LayoutWooList
        wooID={woo.item.id}
        nav={"WooListView"}
        chips={woo.item.woo_list}
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