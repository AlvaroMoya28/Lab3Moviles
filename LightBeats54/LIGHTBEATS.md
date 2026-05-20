# LightBeats - App de Linterna al Ritmo

Una aplicación React Native + Expo que enciende la linterna del dispositivo al ritmo de la música captada por el micrófono.

## Características

✨ **Captura de Audio en Tiempo Real**
- Usa el micrófono para capturar audio
- Analiza la amplitud del sonido en tiempo real
- Suavizado de datos para una experiencia más estable

🔦 **Control de Linterna Inteligente**
- Detecta beats (golpes) en la música
- Enciende la linterna al ritmo automáticamente
- Efecto de flash sincronizado con los beats

📊 **Visualización en Tiempo Real**
- Visualizador de amplitud con barras animadas
- Indicador circular que muestra el estado de la linterna
- Indicador de amplitud en porcentaje

## Permisos Necesarios

La aplicación requiere los siguientes permisos:

### Android
- `RECORD_AUDIO` - Para acceder al micrófono
- `CAMERA` - Para acceder a la linterna

### iOS
- `NSMicrophoneUsageDescription` - Acceso al micrófono
- `NSCameraUsageDescription` - Acceso a la linterna

## Instalación y Uso

### 1. Clonar y instalar dependencias
```bash
cd LightBeats
npm install
# o
yarn install
```

### 2. Ejecutar en desarrollo

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Web:**
```bash
npm run web
```

### 3. Usar la aplicación

1. Abre la app en tu dispositivo
2. Presiona el botón "INICIAR"
3. Otorga los permisos de micrófono cuando se soliciten
4. ¡La linterna empezará a parpadear al ritmo de la música!

## Ajustes de Sensibilidad

Puedes modificar los umbrales en [src/components/light-beats.tsx](src/components/light-beats.tsx):

```typescript
const THRESHOLD = 0.2;        // Amplitud mínima para encender (0-1)
const BEAT_THRESHOLD = 0.5;   // Umbral para detectar beats (0-1)
```

## Estructura del Proyecto

```
src/
├── components/
│   └── light-beats.tsx              # Componente principal
├── hooks/
│   ├── use-audio-analyzer.ts        # Hook de captura de audio
│   └── use-flashlight-control.ts    # Hook de control de linterna
└── app/
    └── index.tsx                    # Pantalla principal
```

## Hooks

### `useAudioAnalyzer()`
Captura audio del micrófono y proporciona:
- `amplitude` - Amplitud normalizada (0-1)
- `isListening` - Estado de la grabación
- `error` - Errores durante la captura
- `startListening()` - Iniciar captura
- `stopListening()` - Detener captura

### `useFlashlightControl()`
Controla la linterna y proporciona:
- `isFlashlightOn` - Estado de la linterna
- `cameraRef` - Referencia a la cámara
- `requestCameraPermission()` - Solicitar permisos
- `updateFlashlightByAmplitude()` - Actualizar estado de linterna

## Notas Técnicas

- El análisis de audio usa el valor `metering` de `expo-av`
- Los datos se suavizan usando un factor de suavizado (0.8)
- El control de la linterna incluye un mínimo de 100ms entre beats
- El efecto de flash dura 150ms por beat detectado

## Limitaciones

- **Web**: La linterna no funciona en navegadores web
- **iOS**: Requiere iOS 12.0+
- **Android**: Funciona mejor en dispositivos con Android 6.0+

## Desarrollo Futuro

Posibles mejoras:
- [ ] Detección de frecuencias específicas
- [ ] Modos de visualización adicionales
- [ ] Presets de sensibilidad
- [ ] Grabación de patrones
- [ ] Sincronización con múltiples dispositivos

## Licencia

MIT
