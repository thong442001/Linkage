import React, { useState, useEffect } from 'react';
import { Text, View, Image } from 'react-native';
import styles from '../styles/WelcomeS';

const Welcome = () => {
  const [dots, setDots] = useState('');  

  useEffect(() => {
    // Tạo hiệu ứng dấu chấm chạy
    const interval = setInterval(() => {
      setDots(prevDots => (prevDots.length < 3 ? prevDots + '.' : ''));
    }, 500);

    return () => clearInterval(interval); 
  }, []);

  return (
    <View style={styles.container}>
      <View >
        <Image
          style={styles.logo}
          source={require('../../assets/images/Logo_app.png')}
        />
      </View>
      
      <View style={styles.dotContainer}>
        <Text style={styles.headerText}>
          {dots}
        </Text>
      </View>
    </View>
  );
};

export default Welcome;
