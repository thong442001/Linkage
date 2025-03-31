import React, { useState, useEffect } from 'react';
import { View, FlatList, TouchableOpacity, Text, Modal } from 'react-native';
import { CustomTextInputSearch } from '../../components/textinputs/CustomTextInput';
import SearchItem from '../../components/items/SearchItem';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers } from '../../rtk/API';
import Icon from 'react-native-vector-icons/Ionicons';
import styles from '../../styles/screens/search/SearchStyles'; // Import file styles
import { addSearch, removeSearch, clearHistory } from '../../rtk/Reducer';
const Search = props => {
  const { route, navigation } = props;
  const dispatch = useDispatch();
  const token = useSelector(state => state.app.token);

  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
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
  // lấy lịch sử tìm kiếm
  const searchHistory = useSelector(state => state.app.history) || [];
  //thêm làm lịch sử tìm kiếm
  const saveSearch = user => {
    dispatch(addSearch(user));
  };
  //xóa người tìm kiếm được chọn
  const deleteSearchItem = userID => {
    dispatch(removeSearch(userID));
  };
  // xóa tất cả lịch sử
  const clearHistorySearch = () => {
    setModalVisible(true);
  };
  const normalizeText = (text) => {
    return text
      .toLowerCase()
      .normalize('NFD') // Tách dấu ra khỏi chữ
      .replace(/[\u0300-\u036f]/g, '') // Xóa dấu
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
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
          normalizeText((user.first_name + ' ' + user.last_name))
            .toLowerCase()
            .includes(normalizeText(query).toLowerCase()),
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
          <View style={styles.containerHistory}>
            <Text style={styles.historyTitle}>Lịch sử tìm kiếm</Text>
            <TouchableOpacity onPress={clearHistorySearch}>
              <Text style={styles.textAllhistry}>Xóa tất cả</Text>
            </TouchableOpacity>
          </View>


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
                <SearchItem user={item} onDelete={deleteSearchItem} />
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
                  Bạn có chắc muốn xóa tất cả lịch sử ?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.cancelButton}>
                    <Text>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      dispatch(clearHistory());
                    }}
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
