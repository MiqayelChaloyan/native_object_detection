import * as React from 'react';
import { useRef } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { Camera } from 'react-native-pytorch-core';

export default function CameraScreen({ onCapture }) {
    const cameraRef = useRef(null);
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="transparent" translucent={true} />
            <Camera
                ref={cameraRef}
                style={styles.camera}
                onCapture={onCapture}
                targetResolution={{ width: 1080, height: 1920 }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    camera: { width: '100%', height: '100%' },
});