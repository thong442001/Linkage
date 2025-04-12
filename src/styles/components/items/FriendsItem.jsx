import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginVertical: height * 0.006, // 5 / 812 ≈ 0.006
    borderRadius: width * 0.026, // 10 / 375 ≈ 0.026
    flexDirection: 'row',
    padding: width * 0.026, // 10 / 375 ≈ 0.026
  },
  imgWrap: {
    width: '30%', // Giữ nguyên vì đã là tương đối
  },
  wrapper: {
    width: '70%', // Giữ nguyên vì đã là tương đối
  },
  image: {
    width: width * 0.24, // Giữ nguyên vì đã responsive
    height: height * 0.12, // Giữ nguyên vì đã responsive
    borderRadius: width * 5,
    alignSelf: 'center',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: '600',
    fontSize: width * 0.043, // 16 / 375 ≈ 0.043
    color: 'black',
    marginLeft: width * 0.026, // 10 / 375 ≈ 0.026
  },
  mutualFriends: {
    color: 'gray',
    marginLeft: width * 0.026, // 10 / 375 ≈ 0.026
    marginTop: height * 0.012, // 10 / 812 ≈ 0.012
    fontWeight: '600',
  },
  sentTime: {
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.012, // 10 / 812 ≈ 0.012
  },
  acpButton: {
    // backgroundColor: '#0265ff', // Giữ nguyên (bị comment)
    borderRadius: width * 0.026, // 10 / 375 ≈ 0.026
    width: '46%', // Giữ nguyên vì đã là tương đối
    height: height * 0.043, // 35 / 812 ≈ 0.043
    marginLeft: width * 0.026, // 10 / 375 ≈ 0.026
    justifyContent: 'center',
  },
  acpTxt: {
    color: 'white',
    fontSize: width * 0.040, // 15 / 375 ≈ 0.040
    fontWeight: '600',
    textAlign: 'center',
  },
  delButton: {
    backgroundColor: '#393d3e',
    width: '46%', // Giữ nguyên vì đã là tương đối
    borderRadius: width * 0.026, // 10 / 375 ≈ 0.026
    justifyContent: 'center',
  },
  delTxt: {
    color: 'white',
    fontSize: width * 0.040, // 15 / 375 ≈ 0.040
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default styles;