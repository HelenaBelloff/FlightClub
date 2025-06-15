import React, { useState } from 'react';
import { Alert, Button, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import ThemedText from '../components/ThemedText';
import { useFlightStats } from '../contexts/FlightStatsContext';

export default function LogFlightScreen({ navigation, route }) {
  const { addFlight } = useFlightStats();
  const [flightData, setFlightData] = useState({
    departure: '',
    arrival: '',
    aircraft: '',
    date: new Date().toISOString().split('T')[0], // Default to today's date
    duration: '',
    notes: ''
  });

  const formatDuration = (duration) => {
    if (!duration) return '';
    const [hours, minutes] = duration.split(':');
    return `${parseInt(hours)}h ${minutes}m`;
  };

  const handleSubmit = () => {
    if (!flightData.departure || !flightData.arrival) {
      Alert.alert('Missing Information', 'Please fill in departure and arrival airports');
      return;
    }

    // Validate duration format (HH:MM)
    if (flightData.duration && !/^\d{1,2}:\d{2}$/.test(flightData.duration)) {
      Alert.alert('Invalid Duration', 'Please enter duration in HH:MM format (e.g., 2:30)');
      return;
    }

    // Convert to uppercase and create route string first
    const departure = flightData.departure.toUpperCase();
    const arrival = flightData.arrival.toUpperCase();
    const route = `${departure} → ${arrival}`;

    const newFlight = {
      id: Date.now().toString(),
      pilot: 'Kim Kissh',
      route: route,
      departure: departure,
      arrival: arrival,
      likes: 0,
      flightTime: formatDuration(flightData.duration),
      date: flightData.date,
      aircraft: flightData.aircraft,
      notes: flightData.notes
    };

    // Update flight stats if duration is provided
    if (flightData.duration) {
      addFlight(flightData.duration);
    }

    // Navigate to the preview screen with the flight data
    navigation.navigate('FlightPreview', { flight: newFlight });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        <ThemedText style={styles.label}>Date *</ThemedText>
        <TextInput
          style={styles.input}
          value={flightData.date}
          onChangeText={(text) => setFlightData({ ...flightData, date: text })}
          placeholder="YYYY-MM-DD"
          keyboardType="numbers-and-punctuation"
        />

        <ThemedText style={styles.label}>Departure Airport *</ThemedText>
        <TextInput
          style={styles.input}
          value={flightData.departure}
          onChangeText={(text) => setFlightData({ ...flightData, departure: text })}
          placeholder="MIA"
          autoCapitalize="characters"
        />

        <ThemedText style={styles.label}>Arrival Airport *</ThemedText>
        <TextInput
          style={styles.input}
          value={flightData.arrival}
          onChangeText={(text) => setFlightData({ ...flightData, arrival: text })}
          placeholder="JFK"
          autoCapitalize="characters"
        />

        <ThemedText style={styles.label}>Duration</ThemedText>
        <TextInput
          style={styles.input}
          value={flightData.duration}
          onChangeText={(text) => setFlightData({ ...flightData, duration: text })}
          placeholder="2:30 (HH:MM)"
          keyboardType="numbers-and-punctuation"
        />

        <ThemedText style={styles.label}>Aircraft</ThemedText>
        <TextInput
          style={styles.input}
          value={flightData.aircraft}
          onChangeText={(text) => setFlightData({ ...flightData, aircraft: text })}
          placeholder=""
        />

        <ThemedText style={styles.label}>Notes</ThemedText>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={flightData.notes}
          onChangeText={(text) => setFlightData({ ...flightData, notes: text })}
          placeholder="Flight notes..."
          multiline
        />

        <Button title="Log Flight" onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
}); 