import React from 'react';
import { StyleSheet, View, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { IPCONFIG } from '@env'


interface FileForUpload {
    uri: string;
    name: string;
    type: string;
}

export default function App() {
    const [hasPermission, setHasPermission] = React.useState(false);

    const testServerConnection = async () => {
        console.log("Tentative de connexion au serveur...");
        try {
            const response = await fetch(`${IPCONFIG}:5000/`);
            const responseJson = await response.json();
            console.log("Réponse du serveur :", responseJson);

            if (response.ok) {
                Alert.alert('Server Response', `Message from server: ${responseJson.message}`);
            } else {
                Alert.alert('Server Error', 'Server returned an error response.');
            }
        } catch (error) {
            console.error("Erreur de connexion:", error);
            Alert.alert('Network Error', 'Failed to connect to the server.');
        }
    };

    const uploadImage = async (uri: string): Promise<void> => {
        const uriParts = uri.split('.');
        const fileType = uriParts[uriParts.length - 1];  // Suppose que l'URI a une extension de fichier valide

        const formData = new FormData();
        const fileForUpload: FileForUpload = {
            uri: uri,
            name: `photo.${fileType}`,  // Nom du fichier pour le serveur, doit inclure une extension appropriée
            type: `image/${fileType}`  // Déduire le type MIME de l'extension de fichier
        };

        formData.append('file', fileForUpload as any);

        try {
            const response = await fetch(`${IPCONFIG}:5000/predict`, {
                method: 'POST',
                body: formData,
                headers: {
                    // 'Content-Type': 'multipart/form-data' est automatiquement ajouté par fetch quand on utilise FormData
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const responseJson = await response.json();

            Alert.alert('Prediction Result', `Predicted Class: ${responseJson.predicted_class}`);
        } catch (error) {
            console.error("Error uploading image: ", error);
            Alert.alert('Network Error', 'Failed to connect to the server.');
        }
    };
    React.useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            const imagePickerStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            setHasPermission(cameraStatus.status === 'granted' && imagePickerStatus.status === 'granted');
        })();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <View style={styles.container}>
            <Button title="Grant permission in settings" onPress={() => Alert.alert("Permissions required", "Please enable permissions in settings.")} />
        </View>;
    }

    const openCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            // handle the image or video captured
            Alert.alert('Image Captured', result.assets[0].uri);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.container}>
            <Button title="Importer une image" onPress={pickImage} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
