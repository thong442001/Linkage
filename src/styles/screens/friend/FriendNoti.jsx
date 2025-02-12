import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  HeaderWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginTop: 10,
  },
  findButton: {
    marginRight: 10,
    marginTop: 10,
    width: 35,
    height: 35,
    textAlign: 'center',
    borderRadius: 500,
    paddingTop: 3,
  },
  titleWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title2: {
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 10,
  },
  seeAll: {
    marginRight: 10,
    color: '#0065ff',
  },
  goiYWrap: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  goiY: {
    fontSize: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 500,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default styles;
