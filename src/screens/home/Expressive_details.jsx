import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ReactionScreen = () => {
  const [selectedTab, setSelectedTab] = useState('all');

  const tabs = [
    { id: 'all', label: 'Tất cả' },
    { id: 'like', icon: '👍', label: 'Thích' },
    { id: 'love', icon: '❤️', label: 'Yêu thích' },
    { id: 'haha', icon: '😂', label: 'Haha' },
    { id: 'wow', icon: '😮', label: 'Wow' },
    { id: 'sad', icon: '😢', label: 'Buồn' },
    { id: 'angry', icon: '😡', label: 'Phẫn nộ' },
  ];

  const users = [
    {
      id: '1',
      name: 'Jonathan',
      avatar:
        'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      reactionType: 'like',
    },
    {
      id: '2',
      name: 'Jonathan',
      avatar:
        'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      reactionType: 'love',
    },
    {
      id: '3',
      name: 'Jonathan',
      avatar:
        'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      reactionType: 'like',
    },
    {
      id: '4',
      name: 'Jonathan',
      avatar:
        'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      reactionType: 'like',
    },

    // Thêm data người dùng vào đây
  ];

  const renderUser = ({ item }) => (
    <View style={styles.userItem}>
      <View>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <Text style={styles.icon}>
          {tabs.find(tab => tab.id === item.reactionType)?.icon}
        </Text>
      </View>
      <Text style={styles.userName}>{item.name}</Text>
    </View>
  );

  const filteredUsers =
    selectedTab === 'all'
      ? users
      : users.filter(user => user.reactionType === selectedTab);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Icon name="angle-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Người đã bày tỏ cảm xúc</Text>
      </View>

      <View style={styles.tabContainer}>
        <FlatList
          data={tabs}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tab,
                selectedTab === item.id && styles.selectedTab,
              ]}
              onPress={() => setSelectedTab(item.id)}>
              {item.icon && <Text style={styles.tabIcon}>{item.icon}</Text>}
              <Text style={styles.tabLabel}>{item.label}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={item => item.id}
        />
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUser}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  tabContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E4E4E4',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1877F2',
  },
  tabIcon: {
    marginRight: 4,
    fontSize: 16,
  },
  tabLabel: {
    color: '#65676B',
    fontSize: 14,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 14,
    fontWeight: '500',
  },
  icon: {
    position: 'absolute',
    marginLeft: 25,
    marginTop: 25,
  },
});

export default ReactionScreen;
