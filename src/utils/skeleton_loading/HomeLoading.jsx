import React from 'react';
import { Dimensions } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


// Lấy kích thước màn hình
const { width } = Dimensions.get('window');

const HomeLoading = () => {
  return (
    <SkeletonPlaceholder>
      {[...Array(8)].map((_, index) => (
        <SkeletonPlaceholder.Item
          key={index}
          flexDirection="row"
          alignItems="center"
          paddingVertical={10}
          borderBottomWidth={1}
          borderBottomColor={'#ddd'}
          width={width * 0.9} // Chiều rộng item = 90% màn hình
          alignSelf="center" // Căn giữa trên màn hình
        >
          {/* Avatar Skeleton */}
          <SkeletonPlaceholder.Item
            width={width * 0.12} // Avatar = 12% chiều rộng màn hình
            height={width * 0.12} // Avatar hình vuông
            borderRadius={width * 0.06} // Bo tròn theo avatar
            marginRight={10}
          />

          {/* Thông tin Skeleton */}
          <SkeletonPlaceholder.Item marginLeft={10} width={width * 0.6}>
            <SkeletonPlaceholder.Item
              width={width * 0.4} // Tên user = 40% chiều rộng
              height={20}
              borderRadius={4}
            />
            <SkeletonPlaceholder.Item
              marginTop={6}
              width={width * 0.3} // Tin nhắn preview = 30% chiều rộng
              height={20}
              borderRadius={4}
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      ))}
    </SkeletonPlaceholder>
  );
};

export default HomeLoading;
