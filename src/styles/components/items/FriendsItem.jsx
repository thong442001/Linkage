import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: 'row',
    padding: 10,
  },
  imgWrap: {
    width: '30%',
  },
  wrapper: {
    width: '70%',
  },
  image: {
    width: "90%",
    height: "90%",
    borderRadius: 500,
    alignSelf: 'center'
    //marginLeft: 5,
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    color: 'black',
    marginLeft: 10,
  },
  mutualFriends: {
    color: 'gray',
    marginLeft: 10,
    marginTop: 10,
    fontWeight: '600',
  },
  sentTime: {
    color: '#888',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  acpButton: {
    // backgroundColor: '#0265ff',
    borderRadius: 10,
    width: '46%',
    height: 35,
    marginLeft: 10,
    justifyContent: 'center',
  },
  acpTxt: {
    color: 'white',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  delButton: {
    backgroundColor: '#393d3e',
    width: '46%',
    borderRadius: 10,
    justifyContent: 'center',
  },
  delTxt: {
    color: 'white',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default styles;
