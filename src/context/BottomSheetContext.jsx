import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { View, Pressable, BackHandler, Text } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const BottomSheetContext = createContext();

export const BottomSheetProvider = ({ children }) => {
    const bottomSheetRef = useRef(null);
    const [snapPoints, setSnapPoints] = useState(['100%']);
    const [content, setContent] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const openBottomSheet = (height, content) => {
        setSnapPoints([`${height}%`]);
        setContent(content);
        setIsVisible(true); // Show overlay
        bottomSheetRef.current?.snapToIndex(0);
    };

    const closeBottomSheet = () => {
        bottomSheetRef.current?.close();
        setContent(null);
        setIsVisible(false); // Hide overlay
    };

    //canh
    // Sử dụng useEffect để mở BottomSheet sau khi content thay đổi
    useEffect(() => {
        if (content) {
            bottomSheetRef.current?.snapToIndex(0);
        }
    }, [content]);

    useEffect(() => {
        const handleBackPress = () => {
            if (isVisible) {
                closeBottomSheet();
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);


        return () => backHandler.remove();
    }, [isVisible]);

    return (
        <BottomSheetContext.Provider value={{ openBottomSheet, closeBottomSheet }}>
            {children}
            {/* Overlay View */}
            {isVisible && (
                <Pressable
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                    activeOpacity={1}
                    onPress={closeBottomSheet}
                />
            )}
            {/* Bottom Sheet */}
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                onClose={closeBottomSheet} // Ensure overlay hides when sheet closes
                handleComponent={null}
            >
                <BottomSheetView style={{ backgroundColor: '#fff', height: '100%', borderTopEndRadius: 20, borderTopStartRadius: 20 }}>
                    <View style={{ flex: 1, padding: 20 }}>
                        {content}
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </BottomSheetContext.Provider>
    );
};

export const useBottomSheet = () => useContext(BottomSheetContext);
