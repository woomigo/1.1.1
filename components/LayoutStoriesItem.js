import { useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { woo_orange } from "../assets/colors";

const LayoutStoriesItem = ({ story }) => {
  useEffect(() => {
    // console.log(
    //   `THIS IS THE STORY FEED ------->>$$$$$ ${JSON.stringify(story.stories)}`
    // );
  });

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback
        onPress={() =>
          navigation.navigate("StoryViewer", {
            stories: story.stories,
            isUserStory: story.woo_id == null ? true : false,
          })
        }
      >
        <Image
          style={!story.unseen ? styles.image : styles.imageUnread}
          source={
            story.woo_id
              ? { uri: story.woo_media_url }
              : { uri: story.user_story_owner.avatar }
          }
        />
      </TouchableWithoutFeedback>
      <Text style={styles.text}>
        @
        {story.woo_id
          ? story.woo_owner.username
          : story.user_story_owner.username}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    margin: 5,
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.4,
  },
  imageUnread: {
    margin: 5,
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: woo_orange,
  },
  text: {
    marginHorizontal: 5,
    fontSize: 12,
  },
});

export default LayoutStoriesItem;
