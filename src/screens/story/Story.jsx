import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Image,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux"; // Import useSelector
import { addStory, getUser } from "../../rtk/Reducer"; // Import getUser
import { oStackHome } from "../../navigations/HomeNavigation";
import Icon from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const Story = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [stories, setStories] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedIndices, setCompletedIndices] = useState([]);
  const progress = useRef(new Animated.Value(0)).current;

  const token = useSelector((state) => state.app.token);
  const user = useSelector((state) => state.app.user);

  useEffect(() => {
    if (!user && token) {
      dispatch(getUser(token)); // Gọi API lấy thông tin user nếu chưa có
    }
  }, [user, token, dispatch]);

  
  useEffect(() => {
    if (route.params?.newStory) {
      setStories([
        {
          id: new Date().getTime(),
          image: { uri: route.params.newStory },
          avatar: { uri: user?.avatar },
          name: user?.first_name + " " + user?.last_name,
        },
      ]);
      setCurrentIndex(0);
      setCompletedIndices([]);
    }
  }, [route.params?.newStory]);

 


  const saveStory = () => {
    if (stories.length > 0) {
      dispatch(addStory(stories[0])); // Lưu story vào Redux
      navigation.navigate(oStackHome.TabHome.name); // Quay về trang Home
    }
  };



  return (
    <TouchableWithoutFeedback >
      <View style={styles.container}>
        <Image source={stories[currentIndex]?.image} style={styles.image} />
        
        {/* <View style={styles.progressBarContainer}>
          {stories.map((_, index) => (
            <View key={index} style={styles.progressBar}>
              <View
                style={[
                  styles.progress,
                  {
                    backgroundColor: completedIndices.includes(index)
                      ? "white"
                      : "gray",
                  },
                ]}
              >
                {index === currentIndex && (
                  <Animated.View
                    style={[
                      styles.progress,
                      {
                        backgroundColor: "white",
                        width: progress.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["0%", "100%"],
                        }),
                      },
                    ]}
                  />
                )}
              </View>
            </View>
          ))}
        </View> */}

        {/* Avatar & Nút Thoát */}
        <View style={styles.headerContainer}>
          <View style={styles.userInfoContainer}>
            <Image source={{ uri: user?.avatar }} style={styles.avatar} />
            <Text style={styles.username}>{user?.first_name} {user?.last_name}</Text>
          </View>
          <TouchableOpacity style={styles.exitButton} onPress={() => navigation.navigate(oStackHome.TabHome.name)}>
            <Text style={styles.exitText}>❌</Text>
          </TouchableOpacity>
        </View>

        
{/*  Nút Gắn thẻ và Nhập văn bản" */}
<TouchableOpacity style={styles.textInputButton} onPress={() => console.log("Nhập văn bản")}>
  <Icon name="text" size={24} color="white" />
</TouchableOpacity>

<TouchableOpacity style={styles.tagButton} onPress={() => console.log("Gắn thẻ")}>
  <Icon name="person-add" size={24} color="white" />
</TouchableOpacity>

<TouchableOpacity style={styles.settingsButton} onPress={() => console.log("Mở cài đặt")}>
  <Icon name="settings" size={24} color="white" />
</TouchableOpacity>


        {/* Nút Đăng */}
        <TouchableOpacity style={styles.postButton} onPress={saveStory}>
          <Text style={styles.postText}>Đăng</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: StatusBar.currentHeight || 0,
  },
  image: {
    width,
    height: height,
    resizeMode: "cover",
  },
  progressBarContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 15,
    left: 10,
    right: 10,
    justifyContent: "center",
  },
  progressBar: {
    flex: 1,
    height: 5,
    marginHorizontal: 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "white",
  },
  progress: {
    height: "100%",
    borderRadius: 2,
  },
  headerContainer: {
    position: "absolute",
    top: 30,
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  exitButton: {
    padding: 8,
    borderRadius: 20,
  },
  exitText: {
    fontSize: 20,
    color: "white",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  emptyText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
  postButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#71AFD8",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  postText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  textInputButton: {
    position: "absolute",
    top: 90,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  
  tagButton: {
    position: "absolute",
    top: 150,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  settingsButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  
});

export default Story;
