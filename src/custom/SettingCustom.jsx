import React, { useState } from 'react';
import MenuSettingS from '../../../../../Linkage_V1/Linkage/src/styles/custom/items/MenuSetting';
import { logout, setTheme, setLanguage } from '../../rtk/Reducer';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, Pressable, ToastAndroid, Switch, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useContext } from 'react';
import { ThemeContext } from '../../assets/context/ThemeContext';
import colors from '../../assets/colors';

export const CustomAccountCentre = () => {
    const {theme} = useContext(ThemeContext)
    let activeColors = colors[theme.mode]   
    const language = useSelector(state => state.app.language);
    //save-outline
    return (
        <Pressable>
            <View style={MenuSettingS.section}>
                <Icon name="people-circle-outline" size={30} color={theme ? "black" : "white"} style={MenuSettingS.icon} />
                <Text style={[MenuSettingS.textSection, { color:theme ? "black" : "white" }]}>{language ? "Account Centre" : "Trung tâm tài khoản"}</Text>
            </View>
        </Pressable>
    )
};

export const CustomSaved = () => {
    const {theme} = useContext(ThemeContext)
    let activeColors = colors[theme.mode]
    const language = useSelector(state => state.app.language);
    //save-outline
    return (
        <Pressable>
            <View style={MenuSettingS.section}>
                <Icon name="bookmark-outline" size={30} color={theme ? "black" : "white"} style={MenuSettingS.icon} />
                <Text style={[MenuSettingS.textSection, { color: theme ? "black" : "white" }]}>{language ? "Saved" : "Lưu"}</Text>
            </View>
        </Pressable>
    )
};

export const CustomComments = () => {
    const {theme} = useContext(ThemeContext)
    let activeColors = colors[theme.mode]
    const language = useSelector(state => state.app.language);
    //save-outline
    return (
        <Pressable>
            <View style={MenuSettingS.section}>
                <Icon name="chatbubble-outline" size={30} color={theme ? "black" : "white"} style={MenuSettingS.icon} />
                <Text style={[MenuSettingS.textSection, { color: theme ? "black" : "white" }]}>{language ? "Comments" : "Bình luận"}</Text>
            </View>
        </Pressable>
    )
};

export const CustomTab = () => {
    const {theme} = useContext(ThemeContext)
    let activeColors = colors[theme.mode]
    const language = useSelector(state => state.app.language);
    return (
        <Pressable>
            <View style={MenuSettingS.section}>
                <Icon name="pricetag-outline" size={30} color={theme ? "black" : "white"} style={MenuSettingS.icon} />
                <Text style={[MenuSettingS.textSection, { color: theme ? "black" : "white" }]}>{language ? "Tabs and mentions" : "Tab và đề cập"}</Text>
            </View>
        </Pressable>
    )
};

export const CustomLanguage = () => {
    const [switchValue, setSwitchValue] = useState(false);
    const dispatch = useDispatch();
    const {theme} = useContext(ThemeContext)
    let activeColors = colors[theme.mode]
    const language = useSelector(state => state.app.language);

    const onLanguage = () => {
        dispatch(setLanguage());
        setSwitchValue(prevValue => !prevValue);
    }
    return (
        <Pressable>
            <View style={MenuSettingS.section}>
                <Icon name="globe-outline" size={30} color={theme ? "black" : "white"} style={MenuSettingS.icon} />
                <Text style={[MenuSettingS.textSection,
                { color: theme ? "black" : "white" }]}>
                    {language ? "Language: ENG " : "Ngôn ngữ: VN "}
                </Text>
                <Pressable onPress={onLanguage}>
                    <Switch
                        trackColor={{ false: "#eee", true: "#333" }}
                        thumbColor={switchValue ? "#fff" : "#000"}
                        ios_backgroundColor="#eee"// Màu nền của Switch trên iOS khi ở trạng thái tắt
                        onValueChange={onLanguage}
                        value={switchValue}
                    />
                </Pressable>
            </View>
        </Pressable>
    )
};

export const CustomTheme = () => {
    const dispatch = useDispatch();
    const { updateTheme, theme} = useContext(ThemeContext)
    let activeColors = colors[theme.mode]
    const [switchValue, setSwitchValue] = useState(theme.mode === "light");

    const language = useSelector(state => state.app.language);

    const onTheme = () => {
        updateTheme();
        setSwitchValue(prevValue => !prevValue);
    }

    return (

        <View style={MenuSettingS.section}>
            <Icon name={switchValue ? "moon" : "sunny-outline"} size={30} color={theme ? "black" : "white"} style={MenuSettingS.icon} />
            <Text style={[MenuSettingS.textSection, { color: theme ? "black" : "white" }]}>{language ? "Theme" : "Chế độ"} </Text>
            <Pressable onPress={onTheme}>
                <Switch
                    trackColor={{ false: "#eee", true: "#333" }}
                    thumbColor={switchValue ? "#fff" : "#000"}
                    ios_backgroundColor="#eee"// Màu nền của Switch trên iOS khi ở trạng thái tắt
                    onValueChange={onTheme}
                    value={switchValue}
                />
            </Pressable>
        </View>
    );
};



export const CustomBin = () => {
    const {theme} = useContext(ThemeContext)
    let activeColors = colors[theme.mode]
    const language = useSelector(state => state.app.language);
    return (
        <Pressable>
            <View style={MenuSettingS.section}>
                <Icon name="trash-bin-outline" size={30} color={theme ? "black" : "white"} style={MenuSettingS.icon} />
                <Text style={[MenuSettingS.textSection, { color: theme ? "black" : "white" }]}>{language ? "Bin" : "Thùng rác"}</Text>
            </View>
        </Pressable>
    )
};
export const CustomMoreSetting = () => {
    const {theme} = useContext(ThemeContext)
    let activeColors = colors[theme.mode]
    const language = useSelector(state => state.app.language);
    return (
        <Pressable>
            <View style={MenuSettingS.section}>
                <Icon name="settings-outline" size={30} color={theme ? "black" : "white"} style={MenuSettingS.icon} />
                <Text style={[MenuSettingS.textSection, { color: theme ? "black" : "white" }]}>{language ? "More Setting" : "Cài đặt thêm"}</Text>
            </View>
        </Pressable>
    )
};


export const CustomLogout = () => {
    const dispatch = useDispatch();
    const {theme} = useContext(ThemeContext)
    let activeColors = colors[theme.mode]
    const language = useSelector(state => state.app.language);

    const onLogout = () => {
        Alert.alert(
            "Xác nhận đăng xuất",
            "Bạn có chắc chắn muốn đăng xuất?",
            [
                {
                    text: "Hủy",
                    onPress: () => console.log("Đã hủy"),
                    style: "cancel"
                },
                {
                    text: "Đăng xuất",
                    onPress: () => {
                        dispatch(logout());
                        ToastAndroid.show('Đã đăng xuất', ToastAndroid.SHORT);
                    },
                    style: "destructive"
                }
            ]
        );
    };

    return (
        <Pressable onPress={onLogout}>
            <View style={MenuSettingS.section}>
                <Icon name="log-out-outline" size={30} style={MenuSettingS.icon} color="#FF0000" />
                <Text style={[MenuSettingS.textSection, { color: theme ? "black" : "white" }]}>{language ? "Logout" : "Đăng xuất"}</Text>
            </View>
        </Pressable>
    );

};