import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
  ActivityIndicator,
  Button,
} from 'react-native';
import styles from '../../styles/screens/login/LoginS';
import { useDispatch, useSelector } from 'react-redux';
import {
  login,
  loginGG
} from '../../rtk/API';
import auth from "@react-native-firebase/auth";
import ButtonCreateNewAccount from '../../components/button/ButtonCreateNewAccount';
import { CustomTextInputEmail, CustomTextInputPassword } from '../../components/textinputs/CustomTextInput';
import LoadingModal from '../../utils/animation/loading/LoadingModal';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/Ionicons';

const Login = (props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  const fcmToken = useSelector(state => state.app.fcmToken);

  const [emailVsPhone, setEmailVsPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorEmailPhone, setErrorEmailPhone] = useState('');
  const [errorPassword, setErrorPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: "94150586774-ju0vq4e5o8k1uce1vs9oqk944i00ultn.apps.googleusercontent.com",
    });
  }, []);

  // Hàm chuẩn hóa email
  const normalizeEmail = (email) => {
    return email.trim().toLowerCase();
  };

  function isValidEmail(email) {
    const normalizedEmail = normalizeEmail(email);
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(normalizedEmail);
  }

  function isValidPhone(phone) {
    return /^(84|0[3|5|7|8|9])[0-9]{8}$/.test(phone);
  }

  function isValidPassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password);
  }

  const validateForm = () => {
    let isValid = true;
    if (!emailVsPhone.trim()) {
      setErrorEmailPhone('Vui lòng nhập số điện thoại hoặc email.');
      isValid = false;
    } else if (!isValidEmail(emailVsPhone) && !isValidPhone(emailVsPhone)) {
      setErrorEmailPhone('Email hoặc số điện thoại không hợp lệ.');
      isValid = false;
    } else {
      setErrorEmailPhone('');
    }

    if (!password.trim()) {
      setErrorPassword('Vui lòng nhập mật khẩu.');
      isValid = false;
    } else if (!isValidPassword(password)) {
      setErrorPassword('Mật khẩu phải có ít nhất 6 ký tự.');
      isValid = false;
    } else {
      setErrorPassword('');
    }
    return isValid;
  };

  const checkLogin = () => {
    if (!validateForm()) return;

    const normalizedEmail = normalizeEmail(emailVsPhone);
    const data = isValidEmail(emailVsPhone)
      ? { email: normalizedEmail, phone: '', password: password, fcmToken: fcmToken }
      : { email: '', phone: emailVsPhone, password: password, fcmToken: fcmToken };

    onLogin(data);
  };

  const onLogin = (data) => {
    setLoading(true);
    dispatch(login(data))
      .unwrap()
      .then((response) => {
        setLoading(false);
      })
      .catch((error) => {
        setErrorPassword(error);
        setLoading(false);
      });
  };

  const onLoginGG = (data) => {
    setLoading(true);
    dispatch(loginGG(data))
      .unwrap()
      .then((response) => {
        setLoading(false);
      })
      .catch((error) => {
        setErrorPassword(error);
        setLoading(false);
      });
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();

      const userInfo = await GoogleSignin.signIn();
      const { idToken } = await GoogleSignin.getTokens();

      if (!idToken) {
        console.log("Không lấy được ID Token!");
        setLoading(false);
        return;
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      const user = userCredential.user;

      const normalizedEmail = normalizeEmail(user.email);
      onLoginGG({ email: normalizedEmail, name: user.displayName, picture: user.photoURL, fcmToken: fcmToken });

    } catch (error) {
      console.log("Lỗi đăng nhập:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <LoadingModal visible={loading} />

      <View style={styles.viewLogo}>
        <Image
          style={styles.logo}
          source={require('../../../assets/images/Logo_app.png')}
        />
      </View>

      <View style={styles.formSectionLogin}>
        <View style={styles.formInput}>
          <CustomTextInputEmail
            placeholder="Số di động hoặc email"
            value={emailVsPhone}
            onChangeText={(text) => {
              setEmailVsPhone(text);
              setErrorEmailPhone('');
            }}
          />
          {errorEmailPhone ? <Text style={styles.errorText}>{errorEmailPhone}</Text> : null}

          {/* Sử dụng CustomTextInputPassword với icon */}
          <CustomTextInputPassword
            placeholder="Mật khẩu"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrorPassword('');
            }}
            secureTextEntry={!showPassword} // Điều khiển ẩn/hiện mật khẩu
            icon={
              <Pressable onPress={toggleShowPassword}>
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={25}
                  color="gray"
                />
              </Pressable>
            }
          />
          {errorPassword ? <Text style={styles.errorText}>{errorPassword}</Text> : null}
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={checkLogin}>
          <Text style={styles.loginButtonText}>Đăng nhập</Text>
        </TouchableOpacity>

        <Pressable onPress={() => navigation.navigate('FindWithEmail')}>
          <Text style={styles.forgotPasswordText}>Bạn quên mật khẩu ư?</Text>
        </Pressable>
        {/* loginGG */}

        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity onPress={handleGoogleLogin} style={{ padding: 5, borderRadius: 25 }}>
            <Image source={require('../../../assets/images/google.png')} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>
      </View>

      <ButtonCreateNewAccount onPress={() => navigation.navigate('Screen1')} />
    </View>
  );
};
export default Login;
