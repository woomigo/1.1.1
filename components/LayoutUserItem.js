import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Avatar, CheckBox } from "@rneui/themed";
import { useNavigation } from '@react-navigation/native';

const LayoutUserItem = ({ user, onCheckBoxSelected, kind, singleBtnText, doubleBtn1Text, doubleBtn2Text, singleBtnColor, doubleBtn1Color, doubleBtn2Color, handleSingleBtnOnClick }) => {
    const [selected, setSelected] = useState(false);

    useEffect(() => {
        console.log(`LUI USER === ${JSON.stringify(user)}`)
    })

    const navigation = useNavigation();

    const renderBoxButton = () => {
        switch (kind) {
            case "checkbox":
                return <View style={styles.checkboxContainer}>
                    <CheckBox
                        checked={selected}
                        onPress={() => handleClick()}
                        style={styles.checkbox}
                        checkedColor={"#f37320"}
                    />
                </View>;
            case "single":
                return <View style={styles.requestButtonsContainer}>
                    <TouchableOpacity
                        style={[styles.addButton, { backgroundColor: singleBtnColor }]}
                        onPress={handleSingleBtnOnClick}
                    ><Text style={styles.buttonText}>{singleBtnText}</Text>
                    </TouchableOpacity>
                </View>;
            case "double":
                return <View style={styles.requestsButtonsContainer}>
                    <TouchableOpacity
                        style={[styles.acceptButton, { backgroundColor: doubleBtn1Color }]}
                    ><Text style={styles.buttonText}>{doubleBtn1Text}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.denyButton, { backgroundColor: doubleBtn2Color }]}
                    ><Text style={styles.buttonText}>{doubleBtn2Text}</Text>
                    </TouchableOpacity>
                </View>;
            case "selectable":
            default:
                return null;

        }
    }

    const handleClick = () => {
        setSelected(!selected)
        onCheckBoxSelected(user.item.id)
    }

    // const handleCheck = (event) => {
    //     var selected_array = [...selected];
    //     if (event.target.checked) {
    //         selected_array = [...selected, event.target.value];
    //     } else {
    //         selected_array.splice(selected.indexOf(event.target.value), 1);
    //     }
    //     setSelected(selected_array);

    // };

    return (
        <View>
            {kind === 'selectable' ?
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate('User')
                    }}
                >
                    <View style={styles.container}>
                        <View style={styles.imageContainer}>
                            <Avatar
                                rounded
                                size="medium"
                                source={{ uri: `${user.item.profile_pic_url}` }}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{user.item.firstName + " " + user.item.lastName}</Text>
                            <Text style={{ fontSize: 12 }}>@{user.item.username}</Text>
                        </View>
                    </View>
                </TouchableOpacity>

                : <View style={styles.container}>
                    <View style={styles.imageContainer}>
                        <Avatar
                            rounded
                            size="medium"
                            source={{ uri: `${user.item.profile_pic_url}` }}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>{user.item.first_name + " " + user.item.last_name}</Text>
                        <Text style={{ fontSize: 12 }}>@{user.item.username}</Text>
                    </View>

                    {renderBoxButton()}

                </View>
            }
        </View>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: 'center',
        flexDirection: 'row',
        padding: 20,
    },
    imageContainer: {
        flex: 1
    },
    textContainer: {
        flex: 2
    },
    checkboxContainer: {
        flex: 1,

    },
    checkbox: {
        height: 15,
        width: 15,
        alignSelf: "center",
    },
    requestsButtonsContainer: {
        flex: 2,
        flexDirection: 'row'
    },
    acceptButton: {
        backgroundColor: 'green',
        padding: 5,
        borderRadius: 10,
        marginEnd: 15,
        width: 60
    },
    denyButton: {
        backgroundColor: 'red',
        padding: 5,
        borderRadius: 10,
        width: 60
    },
    addButton: {
        backgroundColor: '#f37320',
        padding: 5,
        borderRadius: 10,
        width: 80
    },
    buttonText: {
        color: "#fff",
        textAlign: 'center'
    },
    requestButtonContainer: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center'
    }
})

export default LayoutUserItem;