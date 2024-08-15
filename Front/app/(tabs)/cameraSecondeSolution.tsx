// import React, { useEffect, useState, useRef } from 'react';
// import { Button, StyleSheet, Text, View } from 'react-native';
// import { Camera, CameraView, CameraType, useCameraPermissions } from 'expo-camera';
// import * as tf from '@tensorflow/tfjs';
// import '@tensorflow/tfjs-react-native';
// import * as cocoSsd from '@tensorflow-models/coco-ssd';

// export default function App() {
//     const [facing, setFacing] = useState<CameraType>('back');
//     const [permission, requestPermission] = useCameraPermissions();
//     const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);

//     useEffect(() => {
//         async function loadModel() {
//             await tf.ready();
//             const loadedModel = await cocoSsd.load();
//             setModel(loadedModel);
//         }
//         loadModel();
//     }, []);

//     if (!permission) {
//         return <View />;
//     }

//     if (!permission.granted) {
//         return (
//             <View style={styles.container}>
//                 <Text style={styles.message}>We need your permission to show the camera</Text>
//                 <Button onPress={requestPermission} title="grant permission" />
//             </View>
//         );
//     }

//     const handleCameraStream = async () => {
//         if (cameraRef.current && model) {
//             const photo = await cameraRef.current.takePictureAsync({ base64: true });
//             const imageTensor = tf.browser.fromPixels(photo as any);
//             const predictions = await model.detect(imageTensor);
//             console.log(predictions);
//             // Ici vous pouvez mettre à jour l'UI pour montrer les résultats de prédiction
//         }
//     };

//     const toggleCameraFacing = () => {
//         setFacing((currentFacing) => (currentFacing === 'back' ? 'front' : 'back'));
//     };

//     return (
//         <View style={styles.container}>
//             <CameraView
//                 style={styles.camera}
//                 type={facing}
//                 ref={cameraRef}
//             >
//                 <View style={styles.PredictionDiv}>
//                     <Text style={styles.text}>Camera</Text>
//                 </View>
//             </CameraView>
//             <Button title="Take Picture" onPress={handleCameraStream} />
//             <Button title="Switch Camera" onPress={toggleCameraFacing} />
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//     },
//     message: {
//         textAlign: 'center',
//         paddingBottom: 10,
//     },
//     camera: {
//         flex: 1,
//     },
//     PredictionDiv: {
//         position: 'absolute',
//         top: 50,
//         left: 0,
//         right: 0,
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: 'rgba(0, 0, 0, 0.5)',
//         padding: 10,
//         borderRadius: 5,
//     },
//     text: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: 'white',
//         textAlign: 'center',
//     },
// });
