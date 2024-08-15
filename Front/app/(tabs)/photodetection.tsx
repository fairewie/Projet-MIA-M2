import React, { useState, useRef } from 'react';
import { View, Button, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export default function App() {
    const IPCONFIG = process.env.EXPO_PUBLIC_IPCONFIG;
    const [facing, setFacing] = useState<CameraType>('back');
    const [cameraActive, setCameraActive] = useState(false);
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={styles.container}>
                <Text style={styles.message}>Permission camera requis</Text>
                <Button onPress={requestPermission} title="Grant Permission" />
            </View>
        );
    }

    const testServerConnection = async () => {
        fetch(`http://${IPCONFIG}:5000/`, {
            method: 'GET',
        })
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    };

    const toggleCameraFacing = () => {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    };

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            if (photo) {
                uploadImage(photo.uri);
            }
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

    const uploadImage = async (uri: string): Promise<void> => {
        const uriParts = uri.split('.');
        const fileType = uriParts[uriParts.length - 1];  // Suppose que l'URI a une extension de fichier valide

        const formData = new FormData();
        const fileForUpload = {
            uri: uri,
            name: `photo.${fileType}`,  // Nom du fichier pour le serveur, doit inclure une extension appropriée
            type: `image/${fileType}`  // Déduire le type MIME de l'extension de fichier
        };

        formData.append('file', fileForUpload as any);

        try {
            const response = await fetch(`http://${IPCONFIG}:5000/predict`, {
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

            Alert.alert('Resultat de la prédiction', `Classe prédit : ${responseJson.predicted_class}`);
        } catch (error) {
            console.error("Erreur lors de l'envoie de l'image: ", error);
            Alert.alert('Erreur Reseaux', 'Impossible de se connecter au serveur.');
        }
    };

    return (
        <View style={styles.container}>
            {cameraActive ? (
                <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
                    <View style={styles.cameraControls}>
                        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                            <Text style={styles.text}>Flip Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
                            <View style={styles.innerCaptureButton} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button} onPress={() => setCameraActive(false)}>
                            <Text style={styles.text}>Fermer Camera</Text>
                        </TouchableOpacity>
                    </View>
                </CameraView>
            ) : (
                <View style={styles.buttonContainer}>
                    <Button title="Importer une image" onPress={pickImage} />
                    <Button title="Activer la caméra" onPress={() => setCameraActive(true)} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    buttonContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row', // Place les boutons côte à côte
        marginTop: 20,        // Ajoute un peu d'espace en haut du conteneur de boutons
    },
    cameraControls: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    button: {
        marginHorizontal: 10, // Espace horizontal entre les boutons
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
    },
    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    innerCaptureButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'red',
    },
    text: {
        color: 'white',
        fontSize: 16,
    },
});
