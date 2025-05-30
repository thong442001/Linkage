import React from 'react';
import { View, Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width } = Dimensions.get('window');

const ChatHomeLoading = () => {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View style={{ padding: 10 }}>
        {/* Story Bar */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <View
                key={`story-${index}`}
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 30, // Hình tròn
                  marginRight: 10,
                }}
              />
            ))}
        </View>

        {/* Chat Items */}
        {Array(9)
          .fill(0)
          .map((_, index) => (
            <View
              key={`chat-${index}`}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 10, // Khoảng cách giữa các item
              }}>
              {/* Avatar */}
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25, // Hình tròn
                  marginRight: 15, // Khoảng cách với nội dung
                }}
              />

              {/* Chat Content */}
              <View style={{flex: 1, top: 15}}>
                {/* Tên */}
                <View
                  style={{
                    width: width * 0.3 + Math.random() * width * 0.2, // Chiều dài ngẫu nhiên từ 30% đến 50%
                    height: 16, // Chiều cao giống font-size tên
                    borderRadius: 4,
                    marginBottom: 8, // Khoảng cách với tin nhắn
                  }}
                />

                {/* Tin nhắn (1 hoặc 2 dòng ngẫu nhiên) */}
                <View
                  style={{
                    width: width * 0.5 ,
                    height: 14, // Chiều cao giống font-size tin nhắn
                    borderRadius: 4,
                  }}
                />
               
              </View>
            </View>
          ))}
      </View>
    </SkeletonPlaceholder>
  );
};

export default ChatHomeLoading;