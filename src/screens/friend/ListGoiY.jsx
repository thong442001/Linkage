import { FlatList, StyleSheet, Text, TouchableOpacity, View, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { TextInput } from 'react-native-gesture-handler';
import ItemListGoiY from '../../components/items/ItemListGoiY';
import { useDispatch, useSelector } from 'react-redux';
import {
  getGoiYBanBe,
  getRelationshipAvsB,
  guiLoiMoiKetBan,
} from '../../rtk/API';
const { width, height } = Dimensions.get('window');
const ListGoiY = (props) => {
  const { navigation, route } = props;
  const { params } = route;
  const [listGoiY, setListGoiY] = useState([]);
  const dispatch = useDispatch();
  const token = useSelector(state => state.app.token);
  const me = useSelector(state => state.app.user);

  useEffect(() => {
    callGetAllFriendOfID_user();
  }, [])

  //call api getAllFriendOfID_user
  const callGetAllFriendOfID_user = async () => {
    try {

      await dispatch(getGoiYBanBe({ me: params._id, token: token }))
        .unwrap()
        .then((response) => {
          //console.log(response.groups)
          setListGoiY(response.data);
        })
        .catch((error) => {
          console.log('Error1 getAllFriendOfID_user:', error);
        });

    } catch (error) {
      console.log(error)
    }
  }

  const callGetRelationshipAvsB = async (ID_user) => {
    try {
      const paramsAPI = {
        ID_user: ID_user,
        me: me._id,
      };

      await dispatch(getRelationshipAvsB(paramsAPI))
        .unwrap()
        .then(async (response) => {
          //console.log(response.relationship);
          callGuiLoiMoiKetBan(response.relationship._id, ID_user)
        })
        .catch(error => {
          console.log('❌ Lỗi khi callGetRelationshipAvsB:', error);
          // setDialogreload(true);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const callGuiLoiMoiKetBan = async (ID_relationship, ID_user) => {
    try {
      const paramsAPI = {
        ID_relationship: ID_relationship,
        me: me._id,
      };

      await dispatch(guiLoiMoiKetBan(paramsAPI))
        .unwrap()
        .then(async (response) => {
          console.log(response);
          // setRelationship(response.relationship);
          setListGoiY(prevPosts => prevPosts.filter(item => item.user._id !== ID_user));
        })
        .catch(error => {
          console.log('❌ Lỗi khi callGuiLoiMoiKetBan:', error);
          // setDialogreload(true);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.TextHeader}>Gợi ý</Text>
        <View></View>
        {/* <Icon name="add" size={25} color={'black'} /> */}
      </View>
      {/* <View style={styles.containerInput}>
        <Icon name="search" size={25} color={'black'} />
        <TextInput
          placeholder="Tìm kiếm bạn bè"
        />
      </View> */}
      {/* <Text style={styles.title}>Bạn bè</Text> */}
      {/* <Text>{friends.length} người bạn</Text> */}
      <View>
        <View
          style={{ paddingBottom: width * 0.1 }}
        >
          <FlatList
            data={listGoiY}
            renderItem={({ item }) =>
              <TouchableOpacity
                onPress={() => navigation.navigate('Profile', { _id: item.user._id })}
              >
                <ItemListGoiY
                  item={item}
                  _id={params._id}
                  onThemBanBe={callGetRelationshipAvsB}
                />
              </TouchableOpacity>
            }
            keyExtractor={(item) => item.userId}
          />
        </View>

      </View>
    </View>
  );
};

export default ListGoiY;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  TextHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  containerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 28,
    borderColor: '#D6D6D6',
    marginVertical: 10,
  },
  title: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'medium',
  }
});
