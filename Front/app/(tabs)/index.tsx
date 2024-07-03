import React from 'react';
import { StyleSheet, Image, Platform } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView'; import { HelloWave } from '@/components/HelloWave';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Projet de fin d'année: Détection et reconnaissance de composants</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Étape 1 : Reconnaissance des composants</ThemedText>
        <ThemedText>
          Cette section de l'application vous aide à identifier les différents composants d'ordinateur. Modifiez <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> pour voir les changements.
          Appuyez sur{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          pour ouvrir les outils de développement.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Étape 2 : Reconnaissance des circuits imprimés</ThemedText>
        <ThemedText>
          Explorez cette partie pour apprendre à reconnaître les circuits imprimés. Cette fonctionnalité est essentielle pour comprendre le fonctionnement interne des appareils électroniques.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Étape 3 : Commencez à neuf</ThemedText>
        <ThemedText>
          Lorsque vous êtes prêt, exécutez{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> pour obtenir un nouveau répertoire{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText>. Cela déplacera le répertoire actuel{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> vers{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  reactLogo: {
    height: 178,
    width: 290,
    position: 'absolute',
    alignSelf: 'center',
    top: 100, // Adjust the position as needed
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 250, // Adjust this value to position the content below the header image
  },
  stepContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
  },
});
