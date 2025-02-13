import { View, Text, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";

const Comment = ({ comment, onReplyPress }) => {
    const [showReplies, setShowReplies] = useState(false);

    return (
        <View style={{ padding: 10, borderBottomWidth: 0.5 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image source={require('../../../assets/images/person.jpg')} style={{ width: 40, height: 40, borderRadius: 20 }} />
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontWeight: "bold" }}>An</Text>
                    <Text>CHill</Text>
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                        <TouchableOpacity>
                            <Icon name="heart-outline" size={16} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 10 }}>
                            <Text style={{ color: "blue" }}>Trả lời</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Hiển thị reply
      {comment.replies.length > 0 && (
        <TouchableOpacity onPress={() => setShowReplies(!showReplies)}>
          <Text style={{ marginLeft: 50, color: "gray" }}>{showReplies ? "Ẩn" : "Xem"} {comment.replies.length} phản hồi</Text>
        </TouchableOpacity>
      )}
      {showReplies &&
        comment.replies.map(reply => <CommentItem key={reply.id} comment={reply} onReplyPress={onReplyPress} />)} */}
        </View>
    );
};

export default Comment;
