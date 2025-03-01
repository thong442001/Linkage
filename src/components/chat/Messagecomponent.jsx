import {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
  Dimensions,
  Clipboard, //copy
  FlatList,
} from 'react-native';
import {Snackbar} from 'react-native-paper'; // thông báo (ios and android)
import {useSelector} from 'react-redux';
import Video from 'react-native-video';
import {useBottomSheet} from '../../context/BottomSheetContext';
import Icon4 from 'react-native-vector-icons/FontAwesome';

export default function MessageComponent({
  currentUserID,
  message,
  onReply,
  onRevoke,
  onIcon,
}) {
  const isCurrentUser = message.sender._id === currentUserID; // Kiểm tra tin nhắn có phải của user hiện tại không

  const reactions = useSelector(state => state.app.reactions);

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  }); // Vị trí của menu
  const messageRef = useRef(null); // ref để tham chiếu tới tin nhắn
  const [dialogCopyVisible, setDialogCopyVisible] = useState(false); // dialog copy

  const {openBottomSheet, closeBottomSheet} = useBottomSheet();
  const [selectedTab, setSelectedTab] = useState('all');
  const [isFirstRender, setIsFirstRender] = useState(true);
  

// gọi lại buttonsheet khi tab thay đổi
      useEffect(() => {
        if (isFirstRender) {
          setIsFirstRender(false);
          return; // Bỏ qua lần chạy đầu tiên
      }
  
        if (selectedTab !== null) {
            openBottomSheet(50, renderBottomSheetContent());
        }
    }, [selectedTab]);

    //buttonsheet
    const renderBottomSheetContent = () => {
        return (
            <View style={styles.container}>
                <View style={styles.headerReaction}>
                    <TouchableOpacity style={styles.backButton} onPress={closeBottomSheet}>
                        <Icon4 name="angle-left" size={20} color="black" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Người đã bày tỏ cảm xúc</Text>
                </View>
                {/* Tabs */}
                <View style={styles.tabContainer}>
                    <FlatList
                        data={tabs}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[styles.tab, selectedTab === item.id && styles.selectedTab]}
                                onPress={() => setSelectedTab(item.id)}>
                                <Text style={styles.tabIcon}>{item.icon}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
    
                {/* Danh sách người dùng */}
                <FlatList
                    data={filteredUsers}
                    renderItem={({ item }) => (
                        <View style={styles.userItem}>
                            <Image source={{ uri: item.avatar }} style={styles.avatar} />
                            <View style={styles.container_listReaction}>
                                <Text style={styles.nameItemReaction}>{item.name}</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.nameItemReaction}>{item.reactionIcon}</Text>
                                    <Text style={{ marginLeft: 5, color: 'black' }}>{item.quantity}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>
        );
    };
  // Tạo danh sách tab từ message.message_reactionList
  const uniqueReactions = Array.from(
    new Map(
      message?.message_reactionList.map(reaction => [
        reaction.ID_reaction._id,
        reaction.ID_reaction,
      ]),
    ).values(),
  );

  const tabs = [
    {id: 'all', icon: 'Tất cả'},
    ...uniqueReactions.map(reaction => ({
      id: reaction._id,
      icon: reaction.icon,
    })),
  ];

  // Cảnh
  // message_reactionList: list reactions của tin nhắn
  //console.log(message?.message_reactionList);

  const formatTime = timestamp => {
    if (!timestamp) return '';

    const date = new Date(timestamp);
    return date.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // Hiển thị 24h (Bỏ dòng này nếu muốn 12h)
    });
  };

  const handleLongPress = () => {
    if (messageRef.current) {
      messageRef.current.measure((x, y, width, height, pageX, pageY) => {
        setMenuPosition({
          top: pageY - 57,
          left: pageX,
          right: pageX,
        });
        setMenuVisible(true);
      });
    }
  };

  // Hàm copy tin nhắn
  const copyToClipboard = text => {
    Clipboard.setString(text);
    setDialogCopyVisible(true); // hiện dialog copy
  };

  // Lọc danh sách người dùng theo reaction được chọn
  const filteredUsers = message?.message_reactionList
    .filter(
      reaction =>
        selectedTab === 'all' || reaction.ID_reaction._id === selectedTab,
    )
    .map(reaction => ({
      id: `${reaction.ID_user._id}-${reaction._id}`, // Tạo key duy nhất
      userId: reaction.ID_user._id, // ID của người dùng
      name: `${reaction.ID_user.first_name} ${reaction.ID_user.last_name}`,
      avatar: reaction.ID_user.avatar,
      reactionId: reaction.ID_reaction._id,
      reactionIcon: reaction.ID_reaction.icon,
      quantity: reaction.quantity,
    }));

  return (
    <View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}>
      {!isCurrentUser && (
        <Image style={styles.avatar} source={{uri: message.sender.avatar}} />
      )}

      {/* Nhấn giữ tin nhắn để mở menu */}
      <TouchableWithoutFeedback
        onLongPress={() => {
          if (message._destroy != true) {
            handleLongPress();
          }
        }}>
        <View>
          <View>
            {!isCurrentUser && (
              <Text style={styles.username}>
                {message.sender?.first_name} {message.sender?.last_name}
              </Text>
            )}
          </View>
          <View
            ref={messageRef} // Gắn ref vào đây
            style={[
              styles.messageWrapper,
              isCurrentUser && styles.currentUserMessage,
            ]}>
            {/* Hiển thị tin nhắn trả lời nếu có */}
            {message.ID_message_reply && message._destroy == false && (
              <View>
                <View style={styles.replyContainer}>
                  <Text style={styles.replyText} numberOfLines={2}>
                    {message.ID_message_reply.content ||
                      'Tin nhắn không tồn tại'}
                  </Text>
                </View>
              </View>
            )}
            {/* Nội dung tin nhắn chính */}
            {
              // tin nhắn bị thu hồi
              message._destroy == true ? (
                <Text style={[styles.messageTextThuHoi]}>
                  Tin nhắn đã được thu hồi
                </Text>
              ) : message.type == 'text' ? (
                <Text
                  style={[
                    styles.messageText,
                    isCurrentUser && styles.currentUserText,
                  ]}>
                  {message.content}
                </Text>
              ) : message.type == 'image' ? (
                <Image
                  style={[
                    styles.messageImage,
                    isCurrentUser && styles.currentUserText,
                  ]}
                  source={{uri: message.content}}
                />
              ) : (
                message.type == 'video' && (
                  <Video
                    source={{uri: message.content}} // URL video
                    style={[
                      styles.messageVideo,
                      isCurrentUser && styles.currentUserText,
                    ]}
                    controls={true} // Hiển thị điều khiển video
                    resizeMode="contain" // Cách hiển thị video
                  />
                )
              )
            }
            {/* thời gian */}
            <Text style={styles.messageTime}>
              {formatTime(message.createdAt)}
            </Text>
            {/* butonsheet reaction biểu cảm */}
            <TouchableOpacity
             onPress={() => openBottomSheet(50, renderBottomSheetContent())}>
                <View style={{flexDirection:'row'}}>
                {message?.message_reactionList.map((reaction, index) => (
                <View key={index} style={styles.reactionButton}>
                  <Text style={styles.reactionText}>
                    {reaction.ID_reaction.icon} {reaction.quantity}
                  </Text>
                </View>
              ))}
                </View>

            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {/* Hiển thị Snackbar dưới cùng màn hình */}
      <Snackbar
        visible={dialogCopyVisible}
        onDismiss={() => setDialogCopyVisible(false)}
        duration={1000}>
        Đã sao chép tin nhắn!
      </Snackbar>

      {/* Menu tùy chọn khi nhấn giữ */}
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setMenuVisible(false)}>
          <View style={styles.overlay}>
            <View
              style={[
                {
                  position: 'absolute',
                  top: menuPosition.top,
                },
                isCurrentUser
                  ? {
                      right: 10,
                      alignItems: 'flex-end', // Căn phải
                    }
                  : {
                      left: menuPosition.left,
                    },
              ]} // Cập nhật vị trí menu
            >
              <View style={[styles.reactionBar]}>
                {/* reaction biểu cảm */}
                {reactions.map((reaction, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.reactionButton}
                    onPress={() => {
                      onIcon(message._id, reaction._id);
                      setMenuVisible(false);
                    }}>
                    <Text style={styles.onreactionText}>{reaction.icon}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View
                style={[
                  styles.messageWrapper,
                  isCurrentUser && styles.currentUserMessage,
                ]}>
                {!isCurrentUser && (
                  <Text style={styles.username}>
                    {message.sender?.first_name} {message.sender?.last_name}
                  </Text>
                )}
                {/* Hiển thị tin nhắn trả lời nếu có */}
                {message.ID_message_reply && message._destroy == false && (
                  <View style={styles.replyContainer}>
                    <Text style={styles.replyText} numberOfLines={2}>
                      {message.ID_message_reply.content}
                    </Text>
                  </View>
                )}
                {/* Nội dung tin nhắn chính */}
                {
                  // tin nhắn bị thu hồi
                  message._destroy == true ? (
                    <Text style={[styles.messageTextThuHoi]}>
                      Tin nhắn đã được thu hồi
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.messageText,
                        isCurrentUser && styles.currentUserText,
                      ]}>
                      {message.content}
                    </Text>
                  )
                }
                {/* thời gian */}
                <Text style={styles.messageTime}>
                  {formatTime(message.createdAt)}
                </Text>
              </View>

              <View style={[styles.menu]}>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    onReply(message); // Gửi tin nhắn được chọn về component cha
                    setMenuVisible(false); // tắc modal
                  }}>
                  <Text style={styles.menuText}>Trả lời</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    copyToClipboard(message.content); // copy
                    setMenuVisible(false); // tắc modal
                  }}>
                  <Text style={styles.menuText}>Sao chép</Text>
                </TouchableOpacity>
                {isCurrentUser && (
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      onRevoke(message._id); // Thu hồi tin nhắn
                      setMenuVisible(false); // tắc modal
                    }}>
                    <Text style={styles.menuText}>Thu hồi</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  currentUserContainer: {
    justifyContent: 'flex-end',
  },
  otherUserContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
    marginRight: 8,
  },
  messageWrapper: {
    maxWidth: Dimensions.get('window').width * 0.7,
    padding: 10,
    borderRadius: 15,
    backgroundColor: '#d9d9d9', // Màu tin nhắn của người khác
  },
  currentUserMessage: {
    backgroundColor: '#3A6DF0', // Màu tin nhắn của người dùng hiện tại
  },
  username: {
    fontSize: 12,
    color: '#888',
    marginBottom: 3,
    marginLeft: 10,
  },
  messageText: {
    color: '#000000', // Màu chữ cho tin nhắn của người khác
    fontSize: 16,
  },
  messageTextThuHoi: {
    color: 'grey',
    fontSize: 16,
  },
  currentUserText: {
    color: '#fff', // Màu chữ trắng cho tin nhắn của bạn
  },
  messageTime: {
    fontSize: 10,
    color: '#aaa',
    marginVertical: 5,
    marginLeft: 5,
    alignSelf: 'flex-start',
  },
  //reply
  replyContainer: {
    backgroundColor: '#F0F0F0',
    padding: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#3A6DF0',
    marginBottom: 5,
    borderRadius: 10,
  },
  replyText: {
    fontSize: 14,
    color: '#666',
  },
  //modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  reactionBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFF',
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  reactionButton: {
    marginLeft:3,
    backgroundColor:'white',
    paddingHorizontal:3,
    borderRadius:20
  },
  reactionText: {
    fontSize: 10,
    color: '#000',
    alignSelf: 'flex-end',
  },
  onreactionText:{
    fontSize: 25,
    color: '#000',
    alignSelf: 'flex-end',
  },
  menu: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    width: 180,
    marginTop: 10, // Đặt menu dưới messageWrapper
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  menuText: {
    color: '#000',
    fontSize: 14,
    textAlign: 'center',
  },
  //img
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 5,
  },
  //video
  messageVideo: {
    width: 250,
    height: 250,
    borderRadius: 5,
  },

  //button sheet reaction
  container: {
    flex: 1,
    backgroundColor: '#D9D9D9',
  },
  headerReaction: {
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
    color:'black',
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
    color:'black'
  },
  tabLabel: {
    color: 'black',
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
  container_listReaction: {
    flexDirection: 'column',
  },
  nameItemReaction:{
    color:'black',
  }
});
