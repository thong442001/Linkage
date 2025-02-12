import { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Modal,
  TouchableOpacity,
  Dimensions,
} from "react-native";
// Lỗi copy
//import Clipboard from '@react-native-clipboard/clipboard';// copy
import { Snackbar } from 'react-native-paper';// thông báo (ios and android)
import { useSelector } from 'react-redux';

export default function MessageComponent({
  currentUserID,
  message,
  onReply,
  onRevoke,
  onIcon
}) {

  const isCurrentUser = message.sender._id === currentUserID; // Kiểm tra tin nhắn có phải của user hiện tại không

  const reactions = useSelector(state => state.app.reactions)

  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, bottom: 0, left: 0, right: 0 }); // Vị trí của menu
  const messageRef = useRef(null); // ref để tham chiếu tới tin nhắn
  const [dialogCopyVisible, setDialogCopyVisible] = useState(false);// dialog copy

  //console.log(message?.message_reactionList);

  const formatTime = (timestamp) => {
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
  const copyToClipboard = (text) => {
    //Clipboard.setString(text);
    setDialogCopyVisible(true)// hiện dialog copy
  };

  return (
    <View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.currentUserContainer : styles.otherUserContainer,
      ]}
    >
      {!isCurrentUser && (
        <Image style={styles.avatar} source={{ uri: message.sender.avatar }} />
      )}

      {/* Nhấn giữ tin nhắn để mở menu */}
      <TouchableWithoutFeedback onLongPress={() => {
        message._destroy != true && handleLongPress()
      }}>
        <View
          ref={messageRef} // Gắn ref vào đây
          style={[styles.messageWrapper, isCurrentUser && styles.currentUserMessage]}
        >
          {!isCurrentUser && <Text style={styles.username}>{message.sender?.first_name} {message.sender?.last_name}</Text>}
          {/* Hiển thị tin nhắn trả lời nếu có */}
          {
            (message.ID_message_reply && message._destroy == false) && (
              <View style={styles.replyContainer}>
                <Text
                  style={styles.replyText}
                  numberOfLines={2}>
                  {message.ID_message_reply.content || "Tin nhắn không tồn tại"}
                </Text>
              </View>
            )}
          {/* Nội dung tin nhắn chính */}
          {
            // tin nhắn bị thu hồi
            message._destroy == true
              ? <Text style={[styles.messageTextThuHoi]}>
                Tin nhắn đã được thu hồi
              </Text>
              : ((message.type == 'text'
                ? < Text style={[styles.messageText, isCurrentUser && styles.currentUserText]}>
                  {message.content}
                </Text>
                : ((message.type == 'image'
                  && <Image
                    style={[styles.messageText, isCurrentUser && styles.currentUserText]}
                    source={{ uri: message.content }}
                  />))
              ))
          }
          {/* thời gian */}
          <Text style={styles.messageTime}>{formatTime(message.createdAt)}</Text>
          {/* reaction biểu cảm */}
          {
            message?.message_reactionList.map((reaction, index) => (
              <TouchableOpacity
                key={index}
                style={styles.reactionButton}
              >
                <Text style={styles.reactionText}
                >{reaction.ID_reaction.icon} {reaction.quantity}</Text>
              </TouchableOpacity>
            ))
          }
        </View>
      </TouchableWithoutFeedback >

      {/* Hiển thị Snackbar dưới cùng màn hình */}
      < Snackbar
        visible={dialogCopyVisible}
        onDismiss={() => setDialogCopyVisible(false)
        }
        duration={1000}
      >
        Đã sao chép tin nhắn!
      </Snackbar >

      {/* Menu tùy chọn khi nhấn giữ */}
      < Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.overlay}>
            <View
              style={[
                {
                  position: "absolute",
                  top: menuPosition.top,
                },
                isCurrentUser ? {
                  right: 10,
                  alignItems: "flex-end", // Căn phải
                }
                  : {
                    left: menuPosition.left,
                  }
              ]} // Cập nhật vị trí menu
            >
              <View
                style={[styles.reactionBar]}
              >
                {/* reaction biểu cảm */}
                {
                  reactions.map((reaction, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.reactionButton}
                      onPress={() => {
                        onIcon(message._id, reaction._id);
                        setMenuVisible(false);// tắc modal
                      }}
                    >
                      <Text style={styles.reactionText}>{reaction.icon}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

              <View style={[styles.messageWrapper, isCurrentUser && styles.currentUserMessage]}>
                {!isCurrentUser && <Text style={styles.username}>{message.sender?.first_name} {message.sender?.last_name}</Text>}
                {/* Hiển thị tin nhắn trả lời nếu có */}
                {
                  (message.ID_message_reply && message._destroy == false) && (
                    <View style={styles.replyContainer}>
                      <Text style={styles.replyText} numberOfLines={2}>{message.ID_message_reply.content}</Text>
                    </View>
                  )}
                {/* Nội dung tin nhắn chính */}
                {
                  // tin nhắn bị thu hồi
                  message._destroy == true
                    ? <Text style={[styles.messageTextThuHoi]}>
                      Tin nhắn đã được thu hồi</Text>
                    : <Text style={[styles.messageText, isCurrentUser && styles.currentUserText]}>
                      {message.content}</Text>
                }
                {/* thời gian */}
                <Text style={styles.messageTime}>{formatTime(message.createdAt)}</Text>
              </View>

              <View
                style={[styles.menu]}
              >
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    onReply(message); // Gửi tin nhắn được chọn về component cha
                    setMenuVisible(false);// tắc modal
                  }}>
                  <Text style={styles.menuText}>Trả lời</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => {
                    copyToClipboard(message.content);// copy
                    setMenuVisible(false);// tắc modal
                  }}
                >
                  <Text style={styles.menuText}>Sao chép</Text>
                </TouchableOpacity>
                {
                  isCurrentUser
                  && <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => {
                      onRevoke(message._id); // Thu hồi tin nhắn
                      setMenuVisible(false);// tắc modal
                    }} >
                    <Text style={styles.menuText}>Thu hồi</Text>
                  </TouchableOpacity>
                }
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal >
    </View >
  );
}

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  currentUserContainer: {
    justifyContent: "flex-end",
  },
  otherUserContainer: {
    justifyContent: "flex-start",
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
    backgroundColor: "#D9D9D9", // Màu tin nhắn của người khác 
  },
  currentUserMessage: {
    backgroundColor: "#3A6DF0", // Màu tin nhắn của người dùng hiện tại 
  },
  username: {
    fontSize: 12,
    color: "#888",
    marginBottom: 3,
  },
  messageText: {
    color: "#000000", // Màu chữ cho tin nhắn của người khác
    fontSize: 16,
  },
  messageTextThuHoi: {
    color: "grey",
    fontSize: 16,
  },
  currentUserText: {
    color: "#fff", // Màu chữ trắng cho tin nhắn của bạn
  },
  messageTime: {
    fontSize: 10,
    color: "#aaa",
    marginTop: 3,
    alignSelf: "flex-end",
  },
  //reply
  replyContainer: {
    backgroundColor: "#F0F0F0",
    padding: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#3A6DF0",
    marginBottom: 5,
    borderRadius: 10,
  },
  replyText: {
    fontSize: 14,
    color: "#666",
  },
  //modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  reactionBar: {
    flexDirection: "row",
    backgroundColor: "#FFFF",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  reactionButton: {
    marginHorizontal: 5,
  },
  reactionText: {
    fontSize: 20,
    color: "#000",
  },
  menu: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    borderRadius: 10,
    width: 180,
    marginTop: 10, // Đặt menu dưới messageWrapper
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  menuText: {
    color: "#000",
    fontSize: 14,
    textAlign: "center",
  },
});
