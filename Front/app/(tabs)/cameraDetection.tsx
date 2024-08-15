import React, { useState, useEffect, useRef } from 'react';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function App() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;
        if (permission && permission.granted && cameraRef.current) {
            intervalId = setInterval(async () => {
                if (cameraRef.current) {
                    const picture = await cameraRef.current.takePictureAsync({ base64: true });
                    const uri = picture?.uri; // Base64 string or file URI
                    await uploadImage(uri ?? '');
                }
            }, 1000); // 1000 ms = 1 second
        }

        // Cleanup the interval when the component is unmounted
        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [permission]);

    if (!permission) {
        return <View />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
            >
                <View style={styles.PredictionDiv}>
                    <Text style={styles.text}>Analysing...</Text>
                </View>
            </CameraView>
            <View style={styles.buttonContainer}>
                <Button title="Flip Camera" onPress={toggleCameraFacing} />
            </View>
        </View>
    );
}

const uploadImage = async (uri: string): Promise<void> => {
    const IPCONFIG = process.env.EXPO_PUBLIC_IPCONFIG;
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
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseJson = await response.json();

        Alert.alert('Resultat de la prédiction', `Classe prédit : ${responseJson.predicted_class}`);
    } catch (error) {
        console.error("Erreur lors de l'envoi de l'image: ", error);
        Alert.alert('Erreur Réseaux', 'Impossible de se connecter au serveur.');
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 64,
    },
    PredictionDiv: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        borderRadius: 5,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
});
