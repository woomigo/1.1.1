import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import LayoutWooImage from "./LayoutWooImage";
import LayoutWooInfo from "./LayoutWooInfo";
import LayoutWooLike from "./LayoutWooLike";
import { woo_white } from "../assets/colors";
// import LayoutWooVideo from './LayoutWooVideo';

const LayoutWooItem = ({ woo, uid, currentVisibleIndex, currentIndex }) => {
  useEffect(() => {
    console.log(`LISTVIEWWOOITEM ==== ${JSON.stringify(woo)}`);
  });

  return (
    <View style={styles.container}>
      {woo.item.media_url != null ? (
        <LayoutWooImage
          uid={uid}
          woo={woo}
          // wooDate={woo.item.start_date}
          // wooID={woo.item.id}
          // image={woo.item.media_url}
          // ownerUID={woo.item.user_id}
          // ownerUsername= {woo.item.username}
          // ownerProfilePicture={woo.item.profile_pic_url}
          // ownerFirstName = {woo.item.first_name}
          // ownerLastName = {woo.item.last_name}
          // wooLikes={woo.item.like_count}
          // wooLikedByMe={woo.item.liked_by_me}
          // // wooMigos={woo.item.woo_migos}
          // wooType={woo.item.type}
          // // wooTime={woo.item.woo_time}
          // startTime={woo.item.start_time}
          // endTime={woo.item.end_time}
          // wooLocation={woo.item.location}
          // // wooComments={woo.item.woo_comments}
          // // wooGallery={woo.item.woo_gallery}
          // // wooList={woo.item.woo_list}
        />
      ) : (
        <LayoutWooVideo
          video={woo.item.video}
          currentVisibleIndex={currentVisibleIndex}
          currentIndex={currentIndex}
        />
      )}
      <LayoutWooLike

       ownerUID={woo.item.user_id}
          ownerUsername= {woo.item.username}
          ownerProfilePicture={woo.item.profile_pic_url}
          ownerFirstName = {woo.item.first_name}
          ownerLastName = {woo.item.last_name}
          wooLikes={woo.item.like_count}
          wooLikedByMe={woo.item.liked_by_me}
        uid={uid}
        wooID={woo.item.id}
        // ownerUID={woo.item.user_id}
        // wooLikes={woo.item.woo_likes}
        // wooMigos={woo.item.woo_migos}
        // wooType={woo.item.type}
      />
      <LayoutWooInfo
        uid={uid}
        wooType={woo.item.type}
        ownerUID={woo.item.user_id}
        ownerUsername= {woo.item.username}
        ownerProfilePicture={woo.item.profile_pic_url}
        ownerFirstName = {woo.item.first_name}
        ownerLastName = {woo.item.last_name}
        wooLikes={woo.item.like_count}
        wooLikedByMe={woo.item.liked_by_me}
        sharedProfilePic={woo.item.shared_by_profile_pic}
        wooMigos={woo.item.type === "public" ? woo.item.sub_profile_pics : woo.item.migo_profile_pics}
        wooDate={woo.item.start_date}
        // wooTime={woo.item.woo_time}
        startTime={woo.item.start_time}
        endTime={woo.item.end_time}
        wooLocation={woo.item.location}
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
