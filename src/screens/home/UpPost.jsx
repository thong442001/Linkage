import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput } from 'react-native'
import React from 'react'
import UpPostS from '../../styles/screens/home/UpPostS'
import Icon from 'react-native-vector-icons/Ionicons';
const UpPost = (props) => {
    const { navigation } = props;
    return (
        <View style={UpPostS.Container}>
            <View style={UpPostS.Header}>
                <View style={UpPostS.boxBack}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <View>
                            <Icon name="chevron-back-outline" size={30} color="black" />
                        </View>
                    </TouchableOpacity>
                    <Text style={UpPostS.txtCreate}>Tạo bài viết</Text>
                </View>
                <TouchableOpacity style={UpPostS.btnPost}>
                    <Text style={UpPostS.txtUpPost}>Đăng bài</Text>
                </TouchableOpacity>
            </View>
            <View style={UpPostS.line}></View>
            <View style={[UpPostS.boxMargin, { flex: 1 }]}>
                <View style={UpPostS.boxInfor}>
                    <Image style={UpPostS.avatar}
                        source={require("../../../assets/images/person.jpg")}
                    />
                    <View style={{ marginLeft: 15 }}>
                        <Text style={UpPostS.txtName}>Kenny</Text>
                        <View style={UpPostS.boxStatus}>
                            <TouchableOpacity style={UpPostS.btnStatus}>
                                <Text style={UpPostS.txtPublic}>Công khai</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[UpPostS.btnStatus, { marginLeft: 10 }]}>
                                <Text style={UpPostS.txtPublic}>+ Album</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <View>
                    <TextInput
                        placeholder='Bạn đang nghĩ gì?'
                        style={UpPostS.txtInput}
                        multiline={true}
                    />
                </View>
            </View>
            <View style={UpPostS.boxItems2}>
                <View >
                    <View style={UpPostS.line}></View>

                    <TouchableOpacity style={UpPostS.btnIcon}>
                        <View style={UpPostS.boxItems}>
                            <Icon name="image-outline" size={30} color="#33a850" />
                            <Text style={UpPostS.txtIcon}>Ảnh</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={UpPostS.line}></View>

                    <TouchableOpacity style={UpPostS.btnIcon}>
                        <View style={UpPostS.boxItems}>
                            <Icon name="pricetag" size={30} color="#48a1ff" />
                            <Text style={UpPostS.txtIcon}>Gắn thẻ</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={UpPostS.line}></View>

                    <TouchableOpacity style={UpPostS.btnIcon}>
                        <View style={UpPostS.boxItems}>
                            <Icon name="happy-outline" size={30} color="#f9dd25" />
                            <Text style={UpPostS.txtIcon}>Cảm xúc</Text>
                        </View>

                    </TouchableOpacity>
                    <View style={UpPostS.line}></View>

                    <TouchableOpacity style={UpPostS.btnIcon}>
                        <View style={UpPostS.boxItems}>
                            <Icon name="videocam-outline" size={30} color="#fcb13c" />
                            <Text style={UpPostS.txtIcon}>Video trực tiếp</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={UpPostS.line}></View>

                </View>
            </View>
        </View>
    )
}

export default UpPost
