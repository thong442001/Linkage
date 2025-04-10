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
                key={index}
                style={{
                  width: 80,
                  height: 100,
                  borderRadius: 50,
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
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginVertical: 5,
                bottom: 20,
              }}
            >
              {/* Avatar */}
              

              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginRight: 10,
                }}
              />
              {/* Chat content */}
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    width: width * 0.8,
                    height: 50,
                    borderRadius: 20,
              
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
