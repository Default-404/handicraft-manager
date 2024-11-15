import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

// Placeholder para os dados do inventário
const inventoryData = [
  { id: '1', name: 'Linha de Crochê', quantity: 10 },
  { id: '2', name: 'Agulha de Crochê', quantity: 5 },
  { id: '3', name: 'Fibra de Enchimento', quantity: 3 },
];

const InventoryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventário de Materiais</Text>
      <FlatList
        data={inventoryData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.name}</Text>
            <Text style={styles.itemText}>Quantidade: {item.quantity}</Text>
          </View>
        )}
      />
      <Button title="Adicionar Novo Material" onPress={() => {}} />
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

export default InventoryScreen;
