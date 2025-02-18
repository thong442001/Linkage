import React from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


const SkeletonPlaceholderComponent = () => {
  return (
    <SkeletonPlaceholder>
      {/* Tạo một danh sách các skeleton item với số lượng 8 bằng cách dùng Array và map */}
      {[...Array(8)].map((_, index) => (
          // Tạo một danh sách skeleton item với số lượng 8
          // 1. `Array(8)` tạo ra một mảng rỗng với độ dài là 8
          // 2. `...Array(8)` sử dụng toán tử ... để biến mảng rỗng thành 
          //    một mảng đầy đủ với 8 phần tử undefined ([undefined, undefined, ...]).
          // 3. `.map()` được sử dụng để lặp qua từng phần tử trong mảng, nhưng giá trị phần tử (`_`) không quan trọng,
          //    chỉ sử dụng `index` để gán key duy nhất cho từng item được render.

        // Từng item skeleton sẽ là một hàng ngang (row) bao gồm ảnh đại diện và thông tin
        <SkeletonPlaceholder.Item
          key={index} // Mỗi item cần một key duy nhất, sử dụng `index` từ map
          flexDirection="row" 
          alignItems="center" 
          marginBottom={20} 
        >
          
          {/* Skeleton hình tròn đại diện cho avatar */}
          <SkeletonPlaceholder.Item
            width={60} 
            height={60} 
            borderRadius={30} 
          />
          
          
          <SkeletonPlaceholder.Item marginLeft={10}> 
            
            <SkeletonPlaceholder.Item
              width={140} 
              height={20} 
              borderRadius={4}
            />
            
            <SkeletonPlaceholder.Item
              marginTop={6} 
              width={100} 
              height={20} 
              borderRadius={4} 
            />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder.Item>
      ))}
    </SkeletonPlaceholder>
  );
};

export default SkeletonPlaceholderComponent;
