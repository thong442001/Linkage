import React, { createContext, useContext, useRef, useState,useEffect } from 'react';
import { View, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const BottomSheetContext = createContext();

export const BottomSheetProvider = ({ children }) => {
    const bottomSheetRef = useRef(null);
    const [snapPoints, setSnapPoints] = useState(['100%']); // Chiều cao mặc định
    const [content, setContent] = useState(null); // Nội dung động

    const openBottomSheet = (height, content) => {
        setSnapPoints([`${height}%`]); // Cập nhật chiều cao

        setContent(content);
        // setTimeout(() => {
        //     setContent(content);
        //     bottomSheetRef.current?.snapToIndex(0);
        // }, 50);
    };

    const closeBottomSheet = () => {
        bottomSheetRef.current?.close();
        setContent(null);
    };

        // Sử dụng useEffect để mở BottomSheet sau khi content thay đổi
        useEffect(() => {
            if (content) {
                bottomSheetRef.current?.snapToIndex(0);
            }
        }, [content]);

    return (
        <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
            {children}
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                handleComponent={null}
            >
                <BottomSheetView style={{ backgroundColor: '#D9D9D9', height: '100%', borderTopEndRadius: 20, borderTopStartRadius: 20 }}>
                    <View style={{ flex: 1, padding: 20 }}>
                        {content}
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </BottomSheetContext.Provider>
    );
};

export const useBottomSheet = () => useContext(BottomSheetContext);
