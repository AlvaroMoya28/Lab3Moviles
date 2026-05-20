import React, { useCallback, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Animated,
  Platform,
} from 'react-native';
import { CameraView } from 'expo-camera';
import Slider from '@react-native-community/slider';
import { useAudioAnalyzer } from '@/hooks/use-audio-analyzer';
import { useFlashlightControl } from '@/hooks/use-flashlight-control';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

const THRESHOLD = 0.2;

export function LightBeats() {
  const { amplitude, isListening, error, startListening, stopListening } =
    useAudioAnalyzer();
  const { isFlashlightOn, requestCameraPermission, updateFlashlightByAmplitude } =
    useFlashlightControl();

  const [isStarted, setIsStarted] = useState(false);
  const [cameraHasPermission, setCameraHasPermission] = useState(false);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;
  const opacityAnim = React.useRef(new Animated.Value(0.5)).current;
  const [beatPercent, setBeatPercent] = useState(50);
  const BEAT_THRESHOLD = beatPercent / 100;

  // Inicializar permisos
  useEffect(() => {
    const initPermissions = async () => {
      if (Platform.OS !== 'web') {
        const hasPermission = await requestCameraPermission();
        setCameraHasPermission(hasPermission);
      }
    };
    initPermissions();
  }, [requestCameraPermission]);

  // Actualizar linterna basado en amplitud
  useEffect(() => {
    if (isListening) {
      updateFlashlightByAmplitude({
        amplitude,
        beatThreshold: BEAT_THRESHOLD,
      });
    }
  }, [amplitude, isListening, updateFlashlightByAmplitude]);

  // Animar indicadores y loguear cambios
  useEffect(() => {
    //console.log('🔦 Linterna:', isFlashlightOn ? 'ON' : 'OFF', '| Amplitud:', amplitude.toFixed(2), '| Permisos:', cameraHasPermission);
    
    if (isFlashlightOn) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.5,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFlashlightOn, scaleAnim, opacityAnim, amplitude, cameraHasPermission]);

  const handleToggle = useCallback(async () => {
    if (!isStarted) {
      await startListening();
      setIsStarted(true);
    } else {
      await stopListening();
      setIsStarted(false);
    }
  }, [isStarted, startListening, stopListening]);

  return (
    <ThemedView style={styles.container}>
      {/* Cámara invisible para acceso a linterna */}
      {Platform.OS !== 'web' && cameraHasPermission && (
        <CameraView
          style={{ width: 1, height: 1, position: 'absolute',opacity : 0 }}
          facing="back"
          enableTorch={isFlashlightOn}
        />
      )}

      <View style={styles.content}>
        {/* Indicador de amplitud */}
        <View style={styles.amplitudeContainer}>
          <ThemedText type="title" style={styles.title}>
            LightBeats
          </ThemedText>

          {/* Visualizador de amplitud */}
          <View style={styles.visualizer}>
            {Array.from({ length: 8 }).map((_, i) => {
              const barHeight = Math.max(
                10,
                Math.min(100, amplitude * 150 * (0.7 + (i % 3) * 0.15))
              );
              return (
                <View
                  key={i}
                  style={[
                    styles.bar,
                    {
                      height: `${barHeight}%`,
                      backgroundColor: isFlashlightOn ? '#FFD700' : '#888',
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Indicador de linterna */}
          <Animated.View
            style={[
              styles.flashIndicator,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
                backgroundColor: isFlashlightOn ? '#FFD700' : '#333',
              },
            ]}
          />

          <ThemedText style={styles.amplitudeText}>
            Amplitud: {(amplitude * 100).toFixed(0)}%
          </ThemedText>

          <ThemedText style={styles.amplitudeText}>
            Umbral: {beatPercent}%
          </ThemedText>

          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={100}
            step={10}
            value={beatPercent}
            onValueChange={(v: number) => setBeatPercent(Math.round(v))}
            minimumTrackTintColor="#FFD700"
            maximumTrackTintColor="#888"
            thumbTintColor="#FFD700"
          />

          {error && (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          )}
        </View>

        {/* Botón de control */}
        <Pressable
          onPress={handleToggle}
          style={[
            styles.button,
            isStarted && styles.buttonActive,
            !cameraHasPermission &&
              Platform.OS !== 'web' && styles.buttonDisabled,
          ]}
        >
          <ThemedText
            style={[
              styles.buttonText,
              isStarted && styles.buttonTextActive,
            ]}
          >
            {isStarted ? 'DETENER' : 'INICIAR'}
          </ThemedText>
        </Pressable>

        {/* Estado */}
        <ThemedText style={styles.status}>
          {isStarted
            ? isListening
              ? '🎵 Escuchando...'
              : 'Iniciando...'
            : '⏸️ Detenido'}
        </ThemedText>

        {Platform.OS === 'web' && isStarted && (
          <ThemedText style={styles.infoText}>
            ℹ️ Modo simulado (audio generado)
          </ThemedText>
        )}

        {!cameraHasPermission && Platform.OS !== 'web' && (
          <ThemedText style={styles.warningText}>
            ⚠️ Se requiere permiso de cámara para usar la linterna
          </ThemedText>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    gap: 30,
    width: '100%',
    maxWidth: 400,
  },
  title: {
    marginBottom: 20,
    textAlign: 'center',
  },
  amplitudeContainer: {
    alignItems: 'center',
    gap: 20,
    width: '100%',
  },
  visualizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 120,
    gap: 8,
    width: '100%',
  },
  bar: {
    width: 20,
    borderRadius: 4,
    minHeight: 10,
  },
  flashIndicator: {
    width: 100,
    height: 100,
    borderRadius: 50,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  amplitudeText: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    backgroundColor: '#333',
    minWidth: 200,
  },
  buttonActive: {
    backgroundColor: '#FFD700',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonTextActive: {
    color: '#000',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  status: {
    fontSize: 14,
    textAlign: 'center',
  },
  infoText: {
    color: '#0099ff',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  warningText: {
    color: '#ff9800',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});
