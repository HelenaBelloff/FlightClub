import React, { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import MapPreview from './MapPreview';
import ThemedText from './ThemedText';

export default function FlightCard({ flight }) {
  const [likes, setLikes] = useState(flight.likes);

  return (
    <View style={styles.card}>
      <ThemedText style={styles.route}>{flight.route}</ThemedText>
      <MapPreview 
        departure={flight.departure}
        arrival={flight.arrival}
        width={280}
        height={140}
      />
      <View style={styles.details}>
        <ThemedText style={styles.pilot}>Pilot: {flight.pilot}</ThemedText>
        <ThemedText style={styles.time}>Duration: {flight.flightTime}</ThemedText>
        <ThemedText style={styles.date}>Date: {flight.date}</ThemedText>
      </View>
      <View style={styles.footer}>
        <ThemedText>Likes: {likes}</ThemedText>
        <Button title="Like ❤️" onPress={() => setLikes(likes + 1)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    margin: 12,
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  route: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  details: {
    marginBottom: 12,
  },
  pilot: {
    marginBottom: 4,
  },
  time: {
    marginBottom: 4,
    color: '#666',
  },
  date: {
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});
