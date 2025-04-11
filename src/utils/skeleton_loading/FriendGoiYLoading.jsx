import React from 'react';
import { View, Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const { width } = Dimensions.get('window');

const FriendGoiYLoading = () => {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View style={{ padding: 5, top: 15}}>
  

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
                  width: 55,
                  height: 55,
                  borderRadius: 30, // Hình tròn
                  marginRight: 15, // Khoảng cách với nội dung
                }}
              />

              {/* Chat Content */}
              <View style={{ flex: 1 }}>
                {/* Tên */}
                <View
                  style={{
                    width: width * 0.3 + Math.random() * width * 0.2, // Chiều dài ngẫu nhiên từ 30% đến 50%
                    height: 12, // Chiều cao giống font-size tên
                    borderRadius: 10,
                    marginBottom: 8, // Khoảng cách với tin nhắn
                  }}
                />
                 <View
                  style={{
                    width: width * 0.2 ,
                    height: 10, // Chiều cao giống font-size tên
                    borderRadius: 4,
                    marginBottom: 8, // Khoảng cách với tin nhắn
                  }}
                />

                {/* Tin nhắn (1 hoặc 2 dòng ngẫu nhiên) */}
                <View
                  style={{
                    width: width * 0.65 ,
                    height: 27, // Chiều cao giống font-size tin nhắn
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

export default FriendGoiYLoading;