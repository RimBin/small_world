import React, { useMemo, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

type Mission = {
  id: number;
  prompt: string;
  options: number[];
  answer: number;
  reward: string;
};

const MISSIONS: Mission[] = [
  {
    id: 1,
    prompt: 'Bebrams tiltui trūksta lentų. Kiek reikia pridėti, kad būtų 4?',
    options: [1, 2, 3],
    answer: 2,
    reward: 'Pirmoji tilto dalis jau pastatyta!',
  },
  {
    id: 2,
    prompt: 'Meškiukas rado seką: 1, 2, 3… Kas toliau?',
    options: [2, 4, 5],
    answer: 4,
    reward: 'Tiltas tapo ilgesnis!',
  },
  {
    id: 3,
    prompt: 'Lapė prašo eiti į dešinę. Kur rodo dešinė?',
    options: [0, 1, 2],
    answer: 1,
    reward: 'Kelias per upę beveik baigtas!',
  },
];

export default function App() {
  const [missionIndex, setMissionIndex] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [message, setMessage] = useState('Padėk gyvūnams auginti jų pasaulį.');
  const [finished, setFinished] = useState(false);

  const mission = MISSIONS[missionIndex];
  const bridge = useMemo(() => '🪵'.repeat(Math.max(1, completed + 1)), [completed]);

  const choose = (value: number) => {
    if (finished) return;

    if (value !== mission.answer) {
      setMessage('Beveik! Pabandyk dar kartą.');
      return;
    }

    const nextCompleted = completed + 1;
    setCompleted(nextCompleted);
    setMessage(mission.reward);

    if (missionIndex === MISSIONS.length - 1) {
      setFinished(true);
      return;
    }

    setMissionIndex((current) => current + 1);
  };

  const restart = () => {
    setMissionIndex(0);
    setCompleted(0);
    setMessage('Padėk gyvūnams auginti jų pasaulį.');
    setFinished(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>MANO MAŽASIS PASAULIS</Text>
          <Text style={styles.title}>Miško upė</Text>
          <Text style={styles.progress}>Misijos {completed}/{MISSIONS.length}</Text>
        </View>

        <View style={styles.world}>
          <Text style={styles.sky}>☀️      ☁️</Text>
          <View style={styles.landRow}>
            <Text style={styles.tree}>🌲</Text>
            <Text style={styles.bear}>🐻</Text>
            <Text style={styles.tree}>🌳</Text>
          </View>
          <View style={styles.river}>
            <Text style={styles.bridge}>{bridge}</Text>
          </View>
          <Text style={styles.worldCaption}>{message}</Text>
        </View>

        {!finished ? (
          <View style={styles.card}>
            <Text style={styles.missionLabel}>DABAR PADĖK</Text>
            <Text style={styles.prompt}>{mission.prompt}</Text>
            <View style={styles.options}>
              {mission.options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.option}
                  activeOpacity={0.75}
                  onPress={() => choose(option)}
                >
                  <Text style={styles.optionText}>
                    {mission.id === 3 ? (option === 0 ? '←' : option === 1 ? '→' : '↑') : option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.doneEmoji}>🌙</Text>
            <Text style={styles.prompt}>Šiandien jau daug nuveikėme.</Text>
            <Text style={styles.doneText}>Tiltas pastatytas. Rytoj pasaulis galės augti toliau.</Text>
            <TouchableOpacity style={styles.restartButton} onPress={restart}>
              <Text style={styles.restartText}>Pakartoti prototipą</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7F1E3',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  header: {
    marginBottom: 14,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#6B7350',
  },
  title: {
    marginTop: 4,
    fontSize: 30,
    fontWeight: '900',
    color: '#26351F',
  },
  progress: {
    marginTop: 4,
    color: '#66725D',
    fontWeight: '600',
  },
  world: {
    flex: 1,
    minHeight: 300,
    borderRadius: 28,
    padding: 20,
    justifyContent: 'space-between',
    backgroundColor: '#DDECC8',
    overflow: 'hidden',
  },
  sky: {
    fontSize: 30,
    textAlign: 'center',
  },
  landRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
  },
  tree: {
    fontSize: 58,
  },
  bear: {
    fontSize: 70,
  },
  river: {
    minHeight: 86,
    borderRadius: 24,
    backgroundColor: '#A7D5E8',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  bridge: {
    fontSize: 35,
  },
  worldCaption: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    color: '#35422D',
  },
  card: {
    marginTop: 16,
    borderRadius: 24,
    padding: 18,
    backgroundColor: '#FFFDF8',
  },
  missionLabel: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.2,
    color: '#A16F35',
  },
  prompt: {
    marginTop: 7,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800',
    color: '#2C322A',
  },
  options: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  option: {
    flex: 1,
    minHeight: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0D69A',
  },
  optionText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#3F3524',
  },
  doneEmoji: {
    fontSize: 34,
  },
  doneText: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 21,
    color: '#60675A',
  },
  restartButton: {
    marginTop: 16,
    minHeight: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#385B36',
  },
  restartText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
});
