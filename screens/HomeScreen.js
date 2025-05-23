import React, { useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import FlightCard from '../components/FlightCard';
import ThemedText from '../components/ThemedText';

const dummyFlights = [
  { 
    id: '1', 
    pilot: 'Kim Kissh', 
    route: 'ORD → LGA', 
    departure: 'ORD',
    arrival: 'LGA',
    likes: 2,
    flightTime: '2h 15m',
    date: '2024-03-15'
  },
  { 
    id: '2', 
    pilot: 'Ava Sky', 
    route: 'LAX → HND', 
    departure: 'LAX',
    arrival: 'HND',
    likes: 5,
    flightTime: '11h 45m',
    date: '2024-03-14'
  },
];

export default function HomeScreen({ navigation, route }) {
  const [flights, setFlights] = useState(dummyFlights);

  // Handle new flights
  useEffect(() => {
    if (route.params?.newFlight) {
      setFlights(currentFlights => [route.params.newFlight, ...currentFlights]);
      // Clear the params to prevent duplicate additions
      navigation.setParams({ newFlight: undefined });
    }
  }, [route.params?.newFlight]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          onPress={() => navigation.navigate('Profile')}
          title="Profile"
        />
      ),
    });
  }, [navigation]);

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyText}>No flights logged yet</ThemedText>
      <ThemedText style={styles.emptySubtext}>Tap "Log New Flight" to get started!</ThemedText>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Button
          title="Log New Flight"
          onPress={() => navigation.navigate('Log Flight')}
          style={styles.button}
        />
        <FlatList
          data={flights}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FlightCard flight={item} />}
          contentContainerStyle={[
            styles.list,
            flights.length === 0 && styles.emptyList
          ]}
          ListEmptyComponent={renderEmptyList}
          showsVerticalScrollIndicator={true}
          bounces={true}
          overScrollMode="always"
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
  },
  button: {
    margin: 16,
  },
  list: {
    padding: 16,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
  },
});
