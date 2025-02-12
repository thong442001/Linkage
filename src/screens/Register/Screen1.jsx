import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import DatePicker from 'react-native-date-picker';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width, height } = Dimensions.get('window');

const Screen1 = (props) => {
    const { route, navigation } = props;

    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [open, setOpen] = useState(false);
    const [gender, setGender] = useState('Nữ');
    const [date, setDate] = useState(new Date());
    const [showErrorFirstName, setShowErrorFirstName] = useState(false);
    const [showErrorLastName, setShowErrorLastName] = useState(false);
    const [showErrorDate, setShowErrorDate] = useState(false);


    const validateForm = () => {
        let isValid = true;
        const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;

        if (!first_name.trim() || !first_name.match(nameRegex)) {
            setShowErrorFirstName(true);
            isValid = false;
        } else {
            setShowErrorFirstName(false);
        }

        if (!last_name.trim() || !last_name.match(nameRegex)) {
            setShowErrorLastName(true);
            isValid = false;
        } else {
            setShowErrorLastName(false);
        }

        if (!dateOfBirth.trim()) {
            setShowErrorDate(true);
            isValid = false;
        } else {
            setShowErrorDate(false);
        }

        const today = new Date();
        const birthDate = new Date(date);
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();

        if (age < 12 || (age === 12 && monthDiff < 0) || (age === 12 && monthDiff === 0 && dayDiff < 0)) {
            setShowErrorDate(true);
            isValid = false;
        } else {
            setShowErrorDate(false);
        }

      

        return isValid;
    };





    const handleTiep = () => {
        if (validateForm()) {
            navigation.navigate('Screen2', {
                first_name,
                last_name,
                dateOfBirth,
                sex: gender,
            });
        }
    };

    const CustomRadioButton = ({ label, value, description }) => (
        <Pressable
            onPress={() => setGender(value)}
            style={styles.radioContainer}
        >
            <View style={styles.radioContent}>
                <Text style={[styles.radioLabel, gender === value && styles.selectedText]}>{label}</Text>
                {description && <Text style={styles.description}>{description}</Text>}
            </View>
            <View style={[styles.radioCircle, gender === value && styles.radioCircleSelected]} />
        </Pressable>
    );

    return (
        <View style={styles.container}>
            <Pressable onPress={() => navigation.navigate('Login')}>
                <Icon style={styles.iconBack} name="angle-left" size={35} color="black" />
            </Pressable>

            <Text style={styles.label}>Bạn tên gì?</Text>
            <Text style={styles.label2}>Nhập tên bạn sử dụng trong đời thực</Text>

            <View style={styles.nameContainer}>
                <TextInput
                    value={first_name}
                    onChangeText={(text) => {
                        setFirst_name(text);
                        setShowErrorFirstName(!text.trim().match(/^[A-Za-zÀ-ỹ\s]+$/));
                    }}
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Họ"
                    style={showErrorFirstName ? styles.inputNameUserError : styles.input}
                />

                <TextInput
                    value={last_name}
                    onChangeText={(text) => {
                        setLast_name(text);
                        setShowErrorLastName(!text.trim().match(/^[A-Za-zÀ-ỹ\s]+$/));
                    }}
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Tên"
                    style={showErrorLastName ? styles.inputNameUserError : styles.input}
                />
            </View>

            <Text style={styles.label}>Ngày sinh của bạn là khi nào?</Text>
            <Text style={styles.label2}>Chọn ngày sinh của bạn</Text>

            {/* TextInput để mở DatePicker */}
            <Pressable onPress={() => setOpen(true)}>
                <TextInput
                    value={dateOfBirth}
                    placeholderTextColor={'#8C96A2'}
                    placeholder="Ngày sinh"
                    style={showErrorDate ? styles.inputDateError : styles.inputDate}
                    editable={false}
                />
            </Pressable>

            {/* Date Picker */}
            <DatePicker
                modal
                open={open}
                date={date}
                mode="date"
                onConfirm={(selectDate) => {
                    setOpen(false);
                    setDate(selectDate);
                    const formattedDate = selectDate.toLocaleDateString('vi-VN');
                    setDateOfBirth(formattedDate);

                    // Kiểm tra tuổi ngay sau khi chọn
                    const today = new Date();
                    const birthDate = new Date(selectDate);
                    const age = today.getFullYear() - birthDate.getFullYear();
                    const monthDiff = today.getMonth() - birthDate.getMonth();
                    const dayDiff = today.getDate() - birthDate.getDate();

                    if (age < 12 || (age === 12 && monthDiff < 0) || (age === 12 && monthDiff === 0 && dayDiff < 0)) {
                        setShowErrorDate(true);
                    } else {
                        setShowErrorDate(false);
                    }
                }}
                onCancel={() => setOpen(false)}
            />


            <Text style={styles.label}>Giới tính của bạn là gì?</Text>
            <View style={styles.radioGroup}>
                <CustomRadioButton label="Nữ" value="Nữ" />
                <View style={styles.separator} />
                <CustomRadioButton label="Nam" value="Nam" />
                <View style={styles.separator} />
                <CustomRadioButton label="Lựa chọn khác" value="Khác" description="Chọn Tùy chọn khác nếu bạn thuộc giới tính khác hoặc không muốn tiết lộ" />
            </View>

            <Pressable style={styles.button} onPress={handleTiep}>
                <Text style={styles.buttonText}>Tiếp</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: width * 0.04,
        backgroundColor: '#f0f4ff',
    },
    label: {
        color: 'black',
        fontSize: width * 0.06,
        fontWeight: 'bold',
        marginBottom: height * 0.01,
    },
    label2: {
        fontSize: width * 0.04,
        color: '#1C2931',
        fontWeight: '450',
    },
    iconBack: {
        marginVertical: height * 0.02,
    },
    nameContainer: {
        flexDirection: 'row',
        marginVertical: height * 0.03,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        marginRight: width * 0.02,
        borderRadius: width * 0.02,
        padding: width * 0.03,
        backgroundColor: '#fff',
    },
    inputNameUserError: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'red',
        marginRight: width * 0.02,
        borderRadius: width * 0.02,
        padding: width * 0.03,
        backgroundColor: '#fff',
    },
    inputDate: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: width * 0.02,
        padding: width * 0.03,
        backgroundColor: '#fff',
        marginVertical: height * 0.02,
    },
    inputDateError: {
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: width * 0.02,
        padding: width * 0.03,
        backgroundColor: '#fff',
        marginVertical: height * 0.02,
    },
    radioGroup: {
        marginVertical: height * 0.025,
        backgroundColor: '#fff',
        borderRadius: width * 0.02,
        paddingVertical: height * 0.015,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },

    radioContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: height * 0.015,
        paddingHorizontal: width * 0.04,
    },
    radioContent: {
        flex: 1,
        marginRight: width * 0.03,
    },
    radioCircle: {
        height: width * 0.05,
        width: width * 0.05,
        borderRadius: (width * 0.05) / 2,
        borderWidth: 3,
        borderColor: '#cfcecb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioCircleSelected: {
        borderColor: '#cfcecb',
        backgroundColor: '#0064E0',
    },
    radioLabel: {
        fontWeight: '450',
        fontSize: width * 0.04,
        color: '#333',
    },
    selectedText: {
        fontWeight: 'bold',
        color: '#000',
    },
    description: {
        fontSize: width * 0.04,
        color: '#999',
        marginTop: height * 0.01,
    },
    separator: {
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    button: {
        marginVertical: height * 0.02,
        backgroundColor: '#0064E0',
        paddingVertical: height * 0.015,
        borderRadius: width * 0.05,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: width * 0.045,
    },
});

export default Screen1;
