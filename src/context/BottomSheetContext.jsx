import React, { createContext, useContext, useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { View, Pressable, BackHandler } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

const BottomSheetContext = createContext();

export const BottomSheetProvider = ({ children }) => {
    const bottomSheetRef = useRef(null);
    const [snapPoints, setSnapPoints] = useState(['100%']);
    const [content, setContent] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [onCloseCallback, setOnCloseCallback] = useState(null); // Callback khi Bottom Sheet đóng

    const openBottomSheet = useCallback((height, content, callback) => {
        setSnapPoints([`${height}%`]);
        setContent(content);
        setIsVisible(true);
        setOnCloseCallback(() => callback); // Lưu callback để gọi khi đóng
        bottomSheetRef.current?.snapToIndex(0);
    }, []);

    const closeBottomSheet = useCallback(() => {
        setIsVisible(false);
        setContent(null);
        bottomSheetRef.current?.close();
        if (onCloseCallback) {
            onCloseCallback(); // Gọi callback khi đóng
            setOnCloseCallback(null); // Reset callback sau khi gọi
        }
    }, [onCloseCallback]);

    const contextValue = useMemo(() => ({
        openBottomSheet,
        closeBottomSheet,
    }), [openBottomSheet, closeBottomSheet]);

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
    }, [isVisible, closeBottomSheet]);

    return (
        <BottomSheetContext.Provider value={contextValue}>
            {children}
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
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={snapPoints}
                enableContentPanningGesture={true}
                enablePanDownToClose={true}
                onClose={() => {
                    setIsVisible(false);
                    if (onCloseCallback) {
                        onCloseCallback(); // Gọi callback khi vuốt đóng
                        setOnCloseCallback(null);
                    }
                }}
                onChange={(index) => {
                    if (index === -1) {
                        setIsVisible(false);
                        if (onCloseCallback) {
                            onCloseCallback(); // Gọi callback khi vuốt đóng
                            setOnCloseCallback(null);
                        }
                    }
                }}
                handleComponent={null}
                animationConfigs={{
                    duration: 250,
                }}
            >
                <BottomSheetView style={{ backgroundColor: '#fff', height: '100%', borderTopEndRadius: 20, borderTopStartRadius: 20 }}>
                    <View style={{ flex: 1, padding: 15 }}>
                        {content}
                    </View>
                </BottomSheetView>
            </BottomSheet>
        </BottomSheetContext.Provider>
    );
};

export const useBottomSheet = () => useContext(BottomSheetContext);