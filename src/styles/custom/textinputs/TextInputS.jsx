import { Dimensions, StyleSheet } from "react-native";


const { width, height } = Dimensions.get('window');

const inputStyles = StyleSheet.create({
  inputContainer: {
    width: width * 0.9,
    height:  height * 0.075,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#CED5DF',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
});

export default inputStyles;
