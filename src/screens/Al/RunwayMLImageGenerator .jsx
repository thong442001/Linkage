import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, ActivityIndicator } from 'react-native';

const HuggingFaceImageGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Mô hình tạo ảnh
  const MODEL_URL = 'https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5';
  const API_KEY = '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'; // Thay bằng API key của bạn

  const generateImage = async () => {
    if (!prompt) return;

    try {
      setLoading(true);

      const response = await fetch(MODEL_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: prompt }),
      });

      // Chuyển đổi response thành base64
      const arrayBuffer = await response.arrayBuffer();
      const base64 = arrayBufferToBase64(arrayBuffer);
      setImage(`data:image/jpeg;base64,${base64}`);
      console.log(`data:image/jpeg;base64,${base64}`);
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm chuyển đổi ArrayBuffer thành base64
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
      <Button title="Tạo ảnh" onPress={generateImage} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#0000ff" />} 
      {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
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
  },
  imageContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
});

export default HuggingFaceImageGenerator;
