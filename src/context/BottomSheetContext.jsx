import React, { createContext, useContext, useRef, useState } from 'react';
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
        bottomSheetRef.current?.snapToIndex(0);
        // setTimeout(() => {
        //     setContent(content);
        //     bottomSheetRef.current?.snapToIndex(0);
        // }, 50);
    };

    const closeBottomSheet = () => {
        bottomSheetRef.current?.close();
        setContent(null);
    };

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
                <BottomSheetView style={{ backgroundColor: 'white', height: '100%' }}>
                    <View style={{ flex: 1, padding: 20 }}>
                        {content}
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </BottomSheetContext.Provider>
    );
};

export const useBottomSheet = () => useContext(BottomSheetContext);
