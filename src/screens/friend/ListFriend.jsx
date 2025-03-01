import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, { useEffect,useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {TextInput} from 'react-native-gesture-handler';
import ItemListFriend from '../../components/items/ItemListFriend';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAllFriendOfID_user,
} from '../../rtk/API';
const ListFriend = (props) => {
    const {navigation,route} = props;
    const {params} = route;
    const [friends, setFriends] = useState([]);
    const dispatch = useDispatch();
    const me = useSelector(state => state.app.user);
    const token = useSelector(state => state.app.token);
    const [id, setid] = useState(null)

    useEffect(() => {
        callGetAllFriendOfID_user();
    }, [])
    
        //call api getAllFriendOfID_user
        const callGetAllFriendOfID_user = async () => {
            try {

                await dispatch(getAllFriendOfID_user({ me: params._id, token: token }))
                    .unwrap()
                    .then((response) => {
                        //console.log(response.groups)
                        setFriends(response.relationships);
                    })
                    .catch((error) => {
                        console.log('Error1 getAllFriendOfID_user:', error);
                    });
    
            } catch (error) {
                console.log(error)
            }
        }
        console.log(friends);
  return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
        <Icon name="chevron-back" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.TextHeader}>Bạn bè</Text>
        <Icon name="add" size={25} color={'black'} />
      </View>
      <View style={styles.containerInput}>
        <Icon name="search" size={25} color={'black'} />
        <TextInput placeholder="Tìm kiếm bạn bè" />
      </View>
      <Text style={styles.title}>Bạn bè</Text>
      <Text>{friends.length} người bạn</Text>
      <View>
        <FlatList 
        data={friends}
        renderItem={({item})=><ItemListFriend item = {item} _id={params._id}/>}
        keyExtractor={(item) => item.id}
        />
      </View>
    </View>
  );
};

export default ListFriend;

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
  title:{
    fontSize:16,
    color:'black',
    fontWeight:'medium',
  }
});


const data =[
    {
        id:1,
        img: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        name:'canhphan'
    }
]