import React from "react";
import { View, StyleSheet } from "react-native";
import { Header, Avatar, Icon, Badge } from "@rneui/themed";

const Header = (
    leftComponent = 'icon', leftComponentIconName = 'question', leftComponentIconColor = '#f37320', leftComponentIconOnPress, leftComponentAvatarSource, leftComponentAvatarBadge = false, leftComponentAvatarBadgeStatus = 'error', leftComponentAvatarBadgeValue = '', leftComponentAvatarBadgeOnPress, leftComponentAvatarBadgeStyle = { position: 'absolute', top: 0, right: 0 },
    centerComponent = 'icon', centerComponentIconName = 'question', centerComponentIconColor = '#f37320', centerComponentIconOnPress, centerComponentAvatarSource, centerComponentAvatarBadge = false, centerComponentAvatarBadgeStatus = 'error', centerComponentAvatarBadgeValue = '', centerComponentAvatarBadgeOnPress, centerComponentAvatarBadgeStyle = { position: 'absolute', top: 0, right: 0 },
    rightComponent = 'icon', rightComponentIconName = 'question', rightComponentIconColor = '#f37320', rightComponentIconOnPress, rightComponentAvatarSource, rightComponentAvatarBadge = false, rightComponentAvatarBadgeStatus = 'error', rightComponentAvatarBadgeValue = '', rightComponentAvatarBadgeOnPress, rightComponentAvatarBadgeStyle = { position: 'absolute', top: 0, right: 0 }
    ) => {
    return (
        <View>
            <Header
                style={styles.headerStyle}
                backgroundColor={'#fff'}
                leftComponent={
                    leftComponent === 'icon' ?
                        <Icon
                            name={leftComponentIconName}
                            type='font-awesome-5'
                            color={leftComponentIconColor}
                            size={20}
                            onPress={() =>
                                leftComponentIconOnPress
                            }
                        /> :
                        <View>
                            <Avatar
                                rounded
                                size="large"
                                onPress={() =>
                                    navigate('ProfileComponent')
                                }
                                source={leftComponentAvatarSource}
                            />{leftComponentAvatarBadge ?
                                <Badge
                                    status={leftComponentAvatarBadgeStatus}
                                    value={leftComponentAvatarBadgeValue}
                                    containerStyle={leftComponentAvatarBadgeStyle}
                                    onPress={() =>
                                        leftComponentAvatarBadgeOnPress
                                    }
                                />
                                : null}
                        </View>

                }
                centerComponent={
                    centerComponent === 'icon' ?
                        <Icon
                            name={centerComponentIconName}
                            type='font-awesome-5'
                            color={centerComponentIconColor}
                            size={20}
                            onPress={() =>
                                centerComponentIconOnPress
                            }
                        /> :
                        <View>
                            <Avatar
                                rounded
                                size="large"
                                onPress={() =>
                                    navigate('ProfileComponent')
                                }
                                source={centerComponentAvatarSource}
                            />{centerComponentAvatarBadge ?
                                <Badge
                                    status={centerComponentAvatarBadgeStatus}
                                    value={centerComponentAvatarBadgeValue}
                                    containerStyle={centerComponentAvatarBadgeStyle}
                                    onPress={() =>
                                        centerComponentAvatarBadgeOnPress
                                    }
                                />
                                : null}
                        </View>
                }
                rightComponent={
                    rightComponent === 'icon' ?
                        <Icon
                            name={rightComponentIconName}
                            type='font-awesome-5'
                            color={rightComponentIconColor}
                            size={20}
                            onPress={() =>
                                rightComponentIconOnPress
                            }
                        /> :
                        <View>
                            <Avatar
                                rounded
                                size="large"
                                onPress={() =>
                                    navigate('ProfileComponent')
                                }
                                source={rightComponentAvatarSource}
                            />{rightComponentAvatarBadge ?
                                <Badge
                                    status={rightComponentAvatarBadgeStatus}
                                    value={rightComponentAvatarBadgeValue}
                                    containerStyle={rightComponentAvatarBadgeStyle}
                                    onPress={() =>
                                        rightComponentAvatarBadgeOnPress
                                    }
                                />
                                : null}
                        </View>
                }
                rightContainerStyle={styles.componentStyle}
                leftContainerStyle={styles.componentStyle}
                centerContainerStyle={styles.componentStyle}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    headerStyle: {
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 3 },
        shadowOpacity: 0.2,
        elevation: 4,
    },
    componentStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default Header;