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
import { useSelector, useDispatch } from "react-redux";
import { getUser } from "../../rtk/Reducer";
import { oStackHome } from "../../navigations/HomeNavigation";

const { width, height } = Dimensions.get("window");

const Story = ({ route }) => {
  const { StoryView } = route.params; // Lấy newStory từ route.params 
  console.log("StoryView:", StoryView); // Kiểm tra dữ liệu nhận được
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
      dispatch(getUser(token));
    }
  }, [user, token, dispatch]);

  useEffect(() => {
    if (stories.length > 0) {
      startProgress();
    }
  }, [currentIndex, stories]);

  const startProgress = () => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(({ finished }) => finished && nextStory());
  };

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCompletedIndices((prev) => [...prev, currentIndex]);
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      setCurrentIndex(0);
      setCompletedIndices([]);
    }
  };

  const prevStory = () => {
    if (currentIndex > 0) {
      setCompletedIndices((prev) =>
        prev.filter((index) => index !== currentIndex - 1)
      );
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handlePress = (event) => {
    const { locationX } = event.nativeEvent;
    if (locationX < width / 2) {
      prevStory();
    } else {
      nextStory();
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        <Image source={StoryView.image} style={styles.image} />
        
        <View style={styles.progressBarContainer}>
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
        </View>

        <View style={styles.headerContainer}>
          <View style={styles.userInfoContainer}>
            <Image source={StoryView.avatar} style={styles.avatar} />
            <Text style={styles.username}>{StoryView.name} {StoryView.last_name}</Text>
          </View>
          <TouchableOpacity style={styles.exitButton} onPress={() => navigation.navigate(oStackHome.TabHome.name)}>
            <Text style={styles.exitText}>❌</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 20,
  },
  exitText: {
    fontSize: 20,
    color: "white",
  },
});

export default Story;
