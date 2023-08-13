import * as React from 'react';
import { useCallback, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import detectObjects from './src/ObjectDetector';
import CameraScreen from './src/screens/CameraScreen';
import LoadingScreen from './src/screens/LoadingScreen';
import ResultsScreen from './src/screens/ResultsScreen';

const ScreenStates = {
  CAMERA: 0,
  LOADING: 1,
  RESULTS: 2,
};

export default function ObjectDetectionExample() {
  const [image, setImage] = useState(null);
  const [boundingBoxes, setBoundingBoxes] = useState(null);
  const [screenState, setScreenState] = useState(ScreenStates.CAMERA);

  // Handle the reset button and return to the camera capturing mode
  const handleReset = useCallback(async () => {
    setScreenState(ScreenStates.CAMERA);
    if (image != null) {
      await image.release();
    }
    setImage(null);
    setBoundingBoxes(null);
  }, [image, setScreenState]);

  // This handler function handles the camera's capture event
  async function handleImage(capturedImage) {
    setImage(capturedImage);
    // Wait for image to process through DETR model and draw resulting image
    setScreenState(ScreenStates.LOADING);
    try {
      const newBoxes = await detectObjects(capturedImage);
      setBoundingBoxes(newBoxes);
      // Switch to the ResultsScreen to display the detected objects
      setScreenState(ScreenStates.RESULTS);
    } catch (err) {
      // In case something goes wrong, go back to the CameraScreen to take a new picture
      handleReset();
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      {screenState === ScreenStates.CAMERA && (
        <CameraScreen onCapture={handleImage} />
      )}
      {screenState === ScreenStates.LOADING && <LoadingScreen />}
      {screenState === ScreenStates.RESULTS && (
        <ResultsScreen
          image={image}
          boundingBoxes={boundingBoxes}
          onReset={handleReset}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});