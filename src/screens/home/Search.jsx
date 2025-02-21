import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, Modal } from 'react-native';
import { CustomTextInputSearch } from '../../components/textinputs/CustomTextInput';
import SearchItem from '../../components/items/SearchItem';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../rtk/API';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../../styles/screens/search/SearchStyles'; // Import file styles

const Search = props => {
  const { route, navigation } = props;
  const dispatch = useDispatch();
  const token = useSelector(state => state.app.token);

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadSearchHistory();
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await dispatch(getAllUsers({ token })).unwrap();
      setData(response.users);
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const loadSearchHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('searchHistory');
      if (history) setSearchHistory(JSON.parse(history));
    } catch {
      console.log('Lỗi lấy lịch sử tìm kiếm');
    }
  };

  const saveSearch = async user => {
    try {
      let history = await AsyncStorage.getItem('searchHistory');
      history = history
        ? JSON.parse(history).filter(item => item._id !== user._id)
        : [];
      history.unshift(user);
      if (history.length > 10) history.pop();
      await AsyncStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (error) {
      console.log('Lỗi lưu lịch sử:', error);
    }
  };

  const deleteSearchItem = async () => {
    if (!selectedUser) return;
    try {
      const updatedHistory = searchHistory.filter(
        item => item._id !== selectedUser._id,
      );
      setSearchHistory(updatedHistory);
      await AsyncStorage.setItem(
        'searchHistory',
        JSON.stringify(updatedHistory),
      );
      setModalVisible(false);
    } catch (error) {
      console.log('Lỗi xóa lịch sử:', error);
    }
  };

  const handleSearch = query => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredProducts([]);
      setIsSearching(false);
    } else {
      setIsSearching(true);
      setFilteredProducts(
        data.filter(user =>
          (user.first_name + ' ' + user.last_name)
            .toLowerCase()
            .includes(query.toLowerCase()),
        ),
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon
            name="chevron-back"
            size={30}
            color="black"
            style={styles.backButton}
          />
        </TouchableOpacity>
        <CustomTextInputSearch
          placeholder="Tìm kiếm"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      {!isSearching && searchHistory.length > 0 && (
        <View>
          <Text style={styles.historyTitle}>Lịch sử tìm kiếm</Text>
          <FlatList
            data={searchHistory}
            keyExtractor={item => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  saveSearch(item);
                  navigation.navigate('TabHome', {
                    screen: 'Profile',
                    params: { _id: item._id },
                  });
                }}>
                <SearchItem
                  user={item}
                  onDelete={() => {
                    setSelectedUser(item);
                    setModalVisible(true); // Hiện modal xác nhận xóa
                  }}
                />
              </TouchableOpacity>
            )}
          />

          {/* Modal xác nhận xóa */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <Text style={styles.modalTitle}>Xác nhận xóa</Text>
                <Text style={styles.modalText}>
                  Bạn có chắc chắn muốn xóa{' '}
                  <Text style={{ fontWeight: 'bold' }}>
                    {selectedUser?.first_name} {selectedUser?.last_name}
                  </Text>{' '}
                  khỏi lịch sử tìm kiếm?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.cancelButton}>
                    <Text>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={deleteSearchItem}
                    style={styles.deleteButton}>
                    <Text style={styles.deleteText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
              saveSearch(item);
              navigation.navigate('TabHome', {
                screen: 'Profile',
                params: { _id: item._id },
              });
            }}>
            <SearchItem user={item} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default Search;
