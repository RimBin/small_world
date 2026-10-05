import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const TOTAL_PLANKS = 4;
const STARTING_PLANKS = 2;
const CORRECT_ANSWER = TOTAL_PLANKS - STARTING_PLANKS;

const speak = (text: string) => {
  try {
    const synth = (globalThis as any).speechSynthesis;
    const Utterance = (globalThis as any).SpeechSynthesisUtterance;

    if (!synth || !Utterance) return;

    synth.cancel();
    const utterance = new Utterance(text);
    utterance.lang = 'lt-LT';
    utterance.rate = 0.82;
    utterance.pitch = 1.05;
    synth.speak(utterance);
  } catch {
    // Voice is a convenience layer. The task remains fully understandable visually.
  }
};

export default function App() {
  const [finished, setFinished] = useState(false);
  const [wrongChoice, setWrongChoice] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);

  const playInstruction = () => {
    speak('Meškiukui reikia pastatyti tiltą. Tiltui reikia keturių lentų. Dvi lentos jau yra. Kiek lentų dar trūksta?');
  };

  const choose = (value: number) => {
    setAttempts((current) => current + 1);

    if (value === CORRECT_ANSWER) {
      setWrongChoice(null);
      setFinished(true);
      speak('Taip! Trūko dviejų lentų. Tiltas pastatytas!');
      return;
    }

    setWrongChoice(value);
    speak('Dar kartą. Pažiūrėk į tuščias vietas ant tilto.');
  };

  const restart = () => {
    setFinished(false);
    setWrongChoice(null);
    setAttempts(0);
  };

  const bridgeSlots = Array.from({ length: TOTAL_PLANKS }, (_, index) => {
    const isFilled = finished || index < STARTING_PLANKS;

    return (
      <View key={index} style={[styles.bridgeSlot, !isFilled && styles.emptySlot]}>
        <Text style={styles.plank}>{isFilled ? '🪵' : '＋'}</Text>
      </View>
    );
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <View style={styles.topBar}>
          <View>
            <Text style={styles.eyebrow}>MANO MAŽASIS PASAULIS</Text>
            <Text style={styles.title}>Pastatyk tiltą</Text>
          </View>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Paklausyti užduoties"
            activeOpacity={0.75}
            style={styles.soundButton}
            onPress={playInstruction}
          >
            <Text style={styles.soundIcon}>🔊</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.world}>
          <View style={styles.skyRow}>
            <Text style={styles.skyIcon}>☀️</Text>
            <Text style={styles.skyIcon}>☁️</Text>
          </View>

          <View style={styles.characterRow}>
            <View style={styles.characterBlock}>
              <Text style={styles.bear}>{finished ? '🐻‍❄️' : '🐻'}</Text>
              <Text style={styles.characterLabel}>{finished ? 'Valio!' : 'Padėk man!'}</Text>
            </View>
            <Text style={styles.arrow}>{finished ? '🎉' : '➡️'}</Text>
            <View style={styles.treeBlock}>
              <Text style={styles.tree}>🌳</Text>
              <Text style={styles.tree}>🌲</Text>
            </View>
          </View>

          <View style={styles.river}>
            <View style={styles.bridgeRow}>{bridgeSlots}</View>
          </View>

          {!finished ? (
            <View style={styles.visualQuestion}>
              <Text style={styles.countLine}>🪵 🪵  ＋  ＋</Text>
              <Text style={styles.question}>Kiek lentų trūksta?</Text>
              <Text style={styles.helper}>Pažiūrėk į 2 tuščias vietas 👀</Text>
            </View>
          ) : (
            <View style={styles.successBox}>
              <Text style={styles.successEmoji}>⭐ ⭐ ⭐</Text>
              <Text style={styles.successTitle}>Tiltas pastatytas!</Text>
              <Text style={styles.successText}>Buvo 2 lentos. Pridėjai dar 2.</Text>
            </View>
          )}
        </View>

        {!finished ? (
          <View style={styles.answerArea}>
            <Text style={styles.tapHint}>PASPAUSK, KIEK LENTŲ REIKIA</Text>
            <View style={styles.options}>
              {[1, 2, 3].map((option) => {
                const isWrong = wrongChoice === option;
                return (
                  <TouchableOpacity
                    key={option}
                    activeOpacity={0.78}
                    onPress={() => choose(option)}
                    style={[styles.option, isWrong && styles.wrongOption]}
                  >
                    <Text style={styles.optionNumber}>{option}</Text>
                    <Text style={styles.optionPlanks}>{'🪵'.repeat(option)}</Text>
                    {isWrong && <Text style={styles.tryAgain}>Pažiūrėk dar kartą</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.restartButton} activeOpacity={0.8} onPress={restart}>
            <Text style={styles.restartText}>↻  Žaisti dar kartą</Text>
          </TouchableOpacity>
        )}

        {attempts > 0 && !finished && (
          <TouchableOpacity style={styles.listenAgain} onPress={playInstruction}>
            <Text style={styles.listenAgainText}>🔊 Paklausyti dar kartą</Text>
          </TouchableOpacity>
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
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 18,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.3,
    color: '#6F775C',
  },
  title: {
    marginTop: 3,
    fontSize: 28,
    fontWeight: '900',
    color: '#26351F',
  },
  soundButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD86B',
    borderWidth: 3,
    borderColor: '#FFF4C6',
  },
  soundIcon: {
    fontSize: 30,
  },
  world: {
    flex: 1,
    minHeight: 390,
    borderRadius: 30,
    padding: 18,
    backgroundColor: '#DFF1CD',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  skyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  skyIcon: {
    fontSize: 30,
  },
  characterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  characterBlock: {
    alignItems: 'center',
    minWidth: 96,
  },
  bear: {
    fontSize: 72,
  },
  characterLabel: {
    marginTop: 3,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFDF7',
    color: '#394532',
    fontWeight: '900',
    fontSize: 15,
  },
  arrow: {
    fontSize: 34,
  },
  treeBlock: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  tree: {
    fontSize: 46,
  },
  river: {
    minHeight: 112,
    borderRadius: 26,
    backgroundColor: '#9FD8F1',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderWidth: 4,
    borderColor: '#C7EBF8',
  },
  bridgeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  bridgeSlot: {
    width: 64,
    height: 72,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EAB56E',
    borderWidth: 3,
    borderColor: '#A86935',
  },
  emptySlot: {
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderStyle: 'dashed',
    borderColor: '#FFFFFF',
  },
  plank: {
    fontSize: 34,
  },
  visualQuestion: {
    alignItems: 'center',
    paddingTop: 6,
  },
  countLine: {
    fontSize: 28,
    letterSpacing: 2,
  },
  question: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 25,
    lineHeight: 30,
    fontWeight: '900',
    color: '#2B3925',
  },
  helper: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '700',
    color: '#5B6853',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  successEmoji: {
    fontSize: 27,
  },
  successTitle: {
    marginTop: 5,
    fontSize: 25,
    fontWeight: '900',
    color: '#2A3A24',
  },
  successText: {
    marginTop: 3,
    fontSize: 16,
    fontWeight: '700',
    color: '#596650',
  },
  answerArea: {
    marginTop: 14,
  },
  tapHint: {
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.1,
    color: '#7C664A',
  },
  options: {
    flexDirection: 'row',
    gap: 9,
  },
  option: {
    flex: 1,
    minHeight: 108,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFDF7',
    borderWidth: 3,
    borderColor: '#E8D8B5',
    paddingHorizontal: 4,
  },
  wrongOption: {
    backgroundColor: '#FFF0E6',
    borderColor: '#E7A37D',
  },
  optionNumber: {
    fontSize: 32,
    lineHeight: 35,
    fontWeight: '900',
    color: '#3E3528',
  },
  optionPlanks: {
    marginTop: 5,
    fontSize: 20,
  },
  tryAgain: {
    marginTop: 4,
    fontSize: 9,
    fontWeight: '800',
    color: '#A65E42',
    textAlign: 'center',
  },
  restartButton: {
    marginTop: 14,
    minHeight: 66,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#416E3C',
  },
  restartText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 19,
  },
  listenAgain: {
    marginTop: 9,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listenAgainText: {
    color: '#5E654E',
    fontWeight: '800',
    fontSize: 14,
  },
});
