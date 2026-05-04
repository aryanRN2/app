import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Alert, 
  SafeAreaView, 
  StatusBar 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { FileText, Upload, X } from 'lucide-react-native';

export default function App() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const createPDF = async () => {
    if (!image) return;

    setLoading(true);
    try {
      // Create a simple HTML template with the image
      const html = `
        <html>
          <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;background-color:white;">
            <img src="${image}" style="width:100%; height:auto;" />
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      
      // Share/Save the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Success', 'PDF generated at: ' + uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create PDF');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <FileText size={32} color="#FFF" />
          </View>
          <Text style={styles.title}>Aryan</Text>
          <Text style={styles.subtitle}>Premium Document Suite</Text>
        </View>

        {!image ? (
          <TouchableOpacity style={styles.uploadArea} onPress={pickImage} activeOpacity={0.7}>
            <Upload size={40} color="#666" />
            <Text style={styles.uploadText}>Select Image from Gallery</Text>
            <Text style={styles.uploadHint}>Supports JPG, PNG, WEBP</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.previewContainer}>
            <Image source={{ uri: image }} style={styles.preview} />
            <TouchableOpacity style={styles.removeBtn} onPress={() => setImage(null)}>
              <X size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.button, !image && styles.buttonDisabled]} 
          onPress={createPDF}
          disabled={!image || loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <FileText size={20} color="white" />
              <Text style={styles.buttonText}>Convert to PDF</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by Aryan • More features coming soon</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0A',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconCircle: {
    backgroundColor: '#A855F7',
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  uploadArea: {
    width: '100%',
    height: 220,
    borderWidth: 2,
    borderColor: '#222',
    borderStyle: 'dashed',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111',
    marginBottom: 30,
  },
  uploadText: {
    color: '#EEE',
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
  },
  uploadHint: {
    color: '#444',
    fontSize: 12,
    marginTop: 4,
  },
  previewContainer: {
    width: '100%',
    height: 300,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#111',
  },
  preview: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  removeBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 20,
  },
  button: {
    backgroundColor: '#A855F7',
    width: '100%',
    height: 60,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#222',
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  footer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
  }
});
