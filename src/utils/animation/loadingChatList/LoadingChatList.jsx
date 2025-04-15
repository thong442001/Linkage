import { Modal, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'
const LoadingChatList = ({visible}) => {
  return (
      <View style={{alignItems: 'center', justifyContent: 'center' }}>
        <LottieView
          source={require('./loadingChatList.json')} 
          autoPlay
          loop
          style={{width: 80, height: 80}}/>
      </View>
  )
}

export default LoadingChatList

const styles = StyleSheet.create({})