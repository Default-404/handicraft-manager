import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

// Placeholder para os dados do histórico de vendas
const salesData = [
  { id: '1', item: 'Amigurumi de Coelho', price: 50.0, date: '2024-11-10' },
  { id: '2', item: 'Chaveiro de Coração', price: 15.0, date: '2024-11-10' },
  { id: '3', item: 'Amigurumi de Ursinho', price: 45.0, date: '2024-11-10' },
];

const SalesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vendas do Dia</Text>
      <FlatList
        data={salesData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.item}</Text>
            <Text style={styles.itemText}>R$ {item.price.toFixed(2)}</Text>
            <Text style={styles.itemText}>Data: {item.date}</Text>
          </View>
        )}
      />
      <Button title="Registrar Nova Venda" onPress={() => {}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 18,
  },
});

export default SalesScreen;
