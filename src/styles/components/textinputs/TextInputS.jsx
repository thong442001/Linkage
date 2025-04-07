import { Dimensions, StyleSheet } from "react-native";
const { width, height } = Dimensions.get('window');

const inputStyles = StyleSheet.create({
  inputContainer: {
    width: width * 0.9,
    height: height * 0.075,
    marginVertical: 5,
    flexDirection: 'row', // Đã có, giữ nguyên để sắp xếp ngang
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#CED5DF',
  },
  iconContainer: {
    marginLeft: 10, // Khoảng cách giữa TextInput và icon
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1, // Đảm bảo TextInput chiếm phần lớn không gian
    fontSize: 16,
    color: 'black',
  },
});

export default inputStyles;
