import { SafeAreaView } from 'react-native-safe-area-context';
import { LightBeats } from '@/components/light-beats';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <LightBeats />
    </SafeAreaView>
  );
}
