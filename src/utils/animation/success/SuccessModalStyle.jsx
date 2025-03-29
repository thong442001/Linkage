import { StyleSheet } from 'react-native';

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
    padding: 5, // Khoảng cách bên trong
    borderRadius: 10, // Bo góc
    borderWidth: 2, // Độ dày border
    borderColor: '#2BA1EA', 
  },
  successAnimation: {
    width: 90, // Giảm kích thước để vừa với hàng ngang
    height: 90,
    marginRight: 10, // Khoảng cách giữa animation và text
  },
  successMessage: {
    fontSize: 16, // Giảm kích thước chữ để vừa với hàng ngang
    color: '#fff', // Màu chữ tối để nổi trên nền trắng
    fontWeight: 'bold',
    fontFamily: 'Inter-Italic-VariableFont_opsz,wght',
  },
});

export default styles;