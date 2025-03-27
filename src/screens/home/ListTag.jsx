import { StyleSheet, Text, TouchableOpacity, View,FlatList } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons';
import ItemListTag from '../../components/items/ItemListTag';
import { useDispatch, useSelector } from 'react-redux';


const ListTag = (props) => {
    const { route, navigation } = props;
    const { params } = route; 
    const me = useSelector(state => state.app.user);
    const filteredListTag = params.ListTag.filter((item) => item._id !== me._id);
    return (
    <View style={styles.container}>
      <View style={styles.containerHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={25} color={'black'} />
        </TouchableOpacity>
        <Text style={styles.TextHeader}>Mọi người</Text>
        <TouchableOpacity onPress={() => navigation.navigate(oStackHome.Search.name)}>
        <Icon name="search" size={25} color={'black'} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredListTag}
        renderItem={({ item }) => <TouchableOpacity  onPress={() => 
            navigation.navigate('TabHome', {
            screen: 'Profile',
            params: {_id: item._id},
          })}>
            <ItemListTag data={item}/>
            </TouchableOpacity>}
        keyExtractor={(item) => item._id}
      />
    </View>
  )
}

export default ListTag

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        backgroundColor: 'white',
      },
      containerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
      },
      TextHeader: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
      },
})