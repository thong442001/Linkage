import React, { useState, useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, Platform, PermissionsAndroid } from "react-native";
import { Camera, useCameraDevices, useCodeScanner } from "react-native-vision-camera";

const QRScannerScreen = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false); // ✅ Cờ tránh quét trùng
  const devices = useCameraDevices();
  const {navigation} = props;
  // const auth = getAuth();

  useEffect(() => {
    if (devices.length > 0) {
      const backCamera = devices.find((d) => d.position === "back");
      setSelectedDevice(backCamera || devices[0]);
    }
  }, [devices]);

  useEffect(() => {
    const checkCameraPermission = async () => {
      let permissionStatus;
      if (Platform.OS === "ios") {
        permissionStatus = await Camera.requestCameraPermission();
      } else {
        permissionStatus = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA
        );
      }

      if (permissionStatus === "authorized" || permissionStatus === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true);
      } else {
        setHasPermission(false);
        Alert.alert(
          "Quyền bị từ chối",
          "Bạn cần cấp quyền camera để quét QR.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    };

    checkCameraPermission();
  }, []);

  const handleUserPress = (_id) => {
    navigation.navigate('TabHome', {
      screen: 'Profile',
      params: {_id: _id},
    });
  };
  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: (codes) => {
      if (codes.length > 0 && !isProcessing) {
        setIsProcessing(true);
        const scannedData = codes[0].value;
        console.log("📌 Mã QR đã quét:", scannedData);
  
        if (scannedData.startsWith("chatapp://chat/")) {
          try {
            // Tách `userId` từ URL
            const parts = scannedData.split("/chat/");
            if (parts.length < 2) {
              throw new Error("URL không hợp lệ!");
            }
            const _id = parts[1].split("?")[0]; // Chỉ lấy `userId`, bỏ qua query params
  
            console.log("UserID:", _id);
  
            // ✅ Gọi hàm xử lý với chỉ userId
            handleUserPress(_id);
  
            // ✅ Đợi 2 giây trước khi quét tiếp
            setTimeout(() => setIsProcessing(false), 2000);
          } catch (error) {
            console.error("Lỗi khi xử lý mã QR:", error);
            Alert.alert("Lỗi", "Mã QR không hợp lệ!");
            setIsProcessing(false);
          }
        } else {
          Alert.alert("Lỗi", "Mã QR không hợp lệ!");
          setIsProcessing(false);
        }
      }
    },
  });
  
  

  if (hasPermission === null) {
    return <Text>Đang kiểm tra quyền truy cập camera...</Text>;
  }

  if (!hasPermission) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: "red", textAlign: "center" }}>
          Không có quyền truy cập camera
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 10 }}>
          <Text style={{ color: "blue" }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!selectedDevice) {
    return <Text>Đang khởi tạo camera...</Text>;
  }

  return (
    <Camera
      style={{ flex: 1 }}
      device={selectedDevice}
      isActive={true}
      codeScanner={codeScanner}
    />
  );
};

export default QRScannerScreen;
