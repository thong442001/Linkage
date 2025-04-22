import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';

const HuggingFaceImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Updated to use a currently supported model for image generation
  const MODEL_URL = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0';
  const API_KEY = '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'; // Consider moving to .env file
  
  const generateImage = async () => {
    if (!prompt) {
      Alert.alert('Lỗi', 'Vui lòng nhập mô tả để tạo ảnh.');
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(MODEL_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          inputs: prompt,
        }),
      });
      
      // Check if the model is still loading
      if (response.status === 503) {
        const json = await response.json();
        if (json.error && json.error.includes("Loading")) {
          // Model is loading, retry after a delay
          Alert.alert(
            'Thông báo', 
            'Mô hình đang được khởi động. Vui lòng thử lại sau vài giây.',
            [{ text: 'OK' }]
          );
          setLoading(false);
          return;
        }
      }
      
      // Check for other errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error('Không thể tạo ảnh từ API: ' + errorText.substring(0, 100));
      }
      
      // Convert response to base64
      const arrayBuffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);
      const imageUri = `data:image/jpeg;base64,${base64}`;
      setImage(imageUri);
      console.log('Image generated successfully');
    } catch (error) {
      console.error('Error generating image:', error);
      Alert.alert('Lỗi', `Không thể tạo ảnh: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to convert ArrayBuffer to base64
  const arrayBufferToBase64 = (buffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };
  
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nhập mô tả để tạo ảnh..."
        value={prompt}
        onChangeText={setPrompt}
        multiline
      />
      <Button 
        title={loading ? "Đang tạo..." : "Tạo ảnh"} 
        onPress={generateImage} 
        disabled={loading} 
      />
      
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Đang tạo ảnh, vui lòng đợi...</Text>
        </View>
      )}
      
      {image && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
    color: 'black',
  },
  loadingContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#0000ff',
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
});

export default HuggingFaceImageGenerator;