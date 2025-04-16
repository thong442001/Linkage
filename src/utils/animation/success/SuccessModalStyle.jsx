import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Làm mờ nền
  },
  messageContainer: {
    flexDirection: 'row', // Đặt LottieView và Text trên cùng một hàng
    alignItems: 'center', // Căn giữa theo chiều dọc
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: width * 0.015, // Khoảng cách bên trong, tương ứng 1.5% chiều rộng màn hình
    borderRadius: width * 0.025, // Bo góc, tương ứng 2.5% chiều rộng màn hình
    borderWidth: 2, // Độ dày border giữ nguyên vì đây là giá trị cố định
    borderColor: '#2BA1EA',
  },
  successAnimation: {
    width: width * 0.18, // Kích thước animation là 18% chiều rộng màn hình
    height: width * 0.18, // Giữ tỉ lệ vuông
    marginRight: width * 0.025, // Khoảng cách giữa animation và text, 2.5% chiều rộng
  },
  successMessage: {
    fontSize: height * 0.02, // Kích thước chữ là 2% chiều cao màn hình
    color: '#fff', // Màu chữ trắng để nổi trên nền
    fontWeight: 'bold',
    fontFamily: 'Inter-Italic-VariableFont_opsz,wght',
  },
});

export default styles;