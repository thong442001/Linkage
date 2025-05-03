import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState, useCallback } from 'react'
import {
    getAllReason,
    addReport_post,
    addReport_user
} from '../../rtk/API';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Import Ionicons
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native'; // Import Lottie
import SuccessModal from '../../utils/animation/success/SuccessModal';
const Report = props => {
    const { route, navigation } = props;
    const { ID_post, ID_user } = route.params;

    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);
    const [reasons, setReasons] = useState([]);
    const [modalVisible, setmodalVisible] = useState(false)
    useFocusEffect(
        useCallback(() => {
            callGetAllReason(); // Gọi API load dữ liệu
        }, [])
    );

    const callGetAllReason = async () => {
        try {
            await dispatch(getAllReason({ token: token }))
                .unwrap()
                .then(response => {
                    console.log('reasons: ' + response.reasons);
                    setReasons(response.reasons);
                })
                .catch(error => {
                    console.log('Error getAllReason:: ', error);
                });
        } catch (error) {
            console.log(error);
        }
    };

    const callAddReport_post = async (ID_reason) => {
        try {
            if (!ID_post) {
                console.log('ID_post: ', ID_post);
                return;
            }
            const paramsAPI = {
                me: me._id,
                ID_post: ID_post,
                ID_reason: ID_reason,
            }
            await dispatch(addReport_post(paramsAPI))
                .unwrap()
                .then(response => {
                    console.log('status callAddReport_post:', response.status);
                    setmodalVisible(true)
                    setTimeout(() => {
                        setmodalVisible(false)
                        navigation.goBack()
                    }, 1000);
                })
                .catch(error => {
                    console.log('Lỗi khi callAddReport_post:', error);
                });
        } catch (error) {
            console.log('Lỗi trong addReport_post:', error);
        }
    };

    const callAddReport_user = async (ID_reason) => {
        try {
            if (!ID_user) {
                console.log('ID_post: ', ID_user);
                return;
            }
            const paramsAPI = {
                me: me._id,
                ID_user: ID_user,
                ID_reason: ID_reason,
            }
            await dispatch(addReport_user(paramsAPI))
                .unwrap()
                .then(response => {
                    console.log('status callAddReport_user:', response.status);
                    setmodalVisible(true)
                    setTimeout(() => {
                        setmodalVisible(false)
                        navigation.goBack()
                    }, 1000);

                })
                .catch(error => {
                    console.log('Lỗi khi callAddReport_user:', error);
                });
        } catch (error) {
            console.log('Lỗi trong addReport_post:', error);
        }
    };

    const handleReport = async (ID_reason) => {
        if (ID_post) {
            callAddReport_post(ID_reason)
        } else {
            callAddReport_user(ID_reason)
            return;
        }
    };

    const renderReport = useCallback(
        ({ item }) => (
            <TouchableOpacity
                onPress={() =>
                    handleReport(item._id)
                }
            >
                <View style={styles.vRow}>
                    <Text style={styles.reason}>{item.reason_text}</Text>
                    <Ionicons name="chevron-forward" size={24} color="black" />
                </View>
                <View style={styles.line}></View>
            </TouchableOpacity>
        ),
        [reasons]
    );

    return (
        <View style={styles.container}>
            <SuccessModal visible={modalVisible} message={"Báo cáo thành công"} />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Báo cáo</Text>
            </View>
            <View style={styles.post}>
                {reasons && reasons.length > 0 ? (
                    <FlatList
                        data={reasons}
                        renderItem={renderReport}
                        keyExtractor={item => item._id}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 3 }}
                    />
                ) : (
                    <View style={styles.emptyContainer}>
                        {/* <LottieView
                            source={require('../../utils/animation/bin/bin.json')}
                            autoPlay
                            loop
                            style={styles.lottieAnimation}
                        /> */}
                        <Text style={styles.emptyText}>Đang load</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#e6eaec',
        borderRadius: 10, // Bo góc cho header
        shadowOpacity: 0.2,
        shadowRadius: 5,
        marginBottom: 20, // Khoảng cách giữa header và nội dung
    },
    backButton: {
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black', // Màu trắng cho chữ trong header
    },
    post: {
        flex: 1,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    lottieAnimation: {
        width: 200, // Điều chỉnh kích thước animation
        height: 200,
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'gray',
    },
    vRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reason: {
        width: '90%',
        fontSize: 18,
        color: 'black', // Màu trắng cho chữ trong header
        margin: 5
    },
    line: {
        height: 0.5,  // hoặc 1 nếu bạn muốn đường kẻ dày hơn
        width: '100%',
        backgroundColor: 'gray',
        marginVertical: 5, // khoảng cách trên dưới đường kẻ, bạn có thể điều chỉnh
    },
});

export default Report;
