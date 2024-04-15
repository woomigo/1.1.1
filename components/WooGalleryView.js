import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Icon, Header, Input, Avatar } from '@rneui/themed'
import { woo_white, woo_black } from '../assets/colors';
import ListViewGallery from './ListViewGallery';
import { Gallery } from './shared';


const WooGalleryView = ({navigation, WooGallery}) => {

  return (
    <View>
      <Header
        style={styles.header}
        backgroundColor={woo_white}
        leftComponent={
          <Icon
            name="chevron-left"
            type='font-awesome-5'
            color={woo_black}
            size={20}
            onPress={() =>
              navigation.navigate('Home')
            }
          />
        }
        leftContainerStyle={styles.leftComponent}
      />
      <ListViewGallery gallery={Gallery} view="horizontal" size="carousel" horizBorderRadius={5}/>
    </View>
  );
}

const styles = StyleSheet.create({
  leftComponent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
export default WooGalleryView;
