import React from 'react';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';
import ThemedText from '../components/ThemedText';
import ThemedView from '../components/ThemedView';
import { useFlightStats } from '../contexts/FlightStatsContext';

const dummyProfile = {
  name: 'Kim Kissh',
  favoriteAircraft: 'Cessna 172',
  certificates: ['Private Pilot', 'Instrument Rating', 'Multi-Commercial Certification', 'Commercial Single Engine Add On']
};

export default function ProfileScreen() {
  const { stats } = useFlightStats();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.avatar}
          source={{ uri: 'https://via.placeholder.com/100' }}
        />
        <ThemedText style={styles.name}>{dummyProfile.name}</ThemedText>
      </View>

      <ThemedView style={styles.statsContainer}>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>{stats.totalFlights}</ThemedText>
          <ThemedText style={styles.statLabel}>Flights</ThemedText>
        </View>
        <View style={styles.statItem}>
          <ThemedText style={styles.statNumber}>{stats.totalHours}</ThemedText>
          <ThemedText style={styles.statLabel}>Hours</ThemedText>
        </View>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Favorite Aircraft</ThemedText>
        <ThemedText>{dummyProfile.favoriteAircraft}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Licenses & Certifications</ThemedText>
        {dummyProfile.certificates.map((cert, index) => (
          <ThemedText key={index} style={styles.certificate}>{cert}</ThemedText>
        ))}
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  certificate: {
    fontSize: 16,
    marginBottom: 5,
  },
}); 