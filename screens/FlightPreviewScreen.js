import React from 'react';
import { Button, SafeAreaView, StyleSheet, View } from 'react-native';
import MapPreview from '../components/MapPreview';
import ThemedText from '../components/ThemedText';

export default function FlightPreviewScreen({ navigation, route }) {
  const flight = route.params?.flight;

  if (!flight) {
    return (
      <SafeAreaView style={styles.container}>
        <ThemedText>No flight data available</ThemedText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ThemedText style={styles.title}>Flight Logged Successfully!</ThemedText>
        <MapPreview 
          departure={flight.departure}
          arrival={flight.arrival}
          width={320}
          height={160}
        />
        <View style={styles.details}>
          <ThemedText style={styles.detailText}>Date: {flight.date}</ThemedText>
          {flight.duration && (
            <ThemedText style={styles.detailText}>Duration: {flight.duration}</ThemedText>
          )}
          {flight.aircraft && (
            <ThemedText style={styles.detailText}>Aircraft: {flight.aircraft}</ThemedText>
          )}
          {flight.notes && (
            <ThemedText style={styles.detailText}>Notes: {flight.notes}</ThemedText>
          )}
        </View>
        <Button 
          title="Continue to Home" 
          onPress={() => {
            navigation.navigate('FlightClub', { newFlight: flight });
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  details: {
    width: '100%',
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 8,
  },
}); 