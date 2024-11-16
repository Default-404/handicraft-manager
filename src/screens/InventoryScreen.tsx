import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { useInventory } from '../context/InventoryContext';

export default function InventoryScreen() {
  const { items, addItem } = useInventory();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');

  const handleAddItem = () => {
    if (name && quantity && price) {
      addItem({
        id: Date.now().toString(),
        name,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
      });
      setName('');
      setQuantity('');
      setPrice('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventário</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text>{`${item.name} - Quantidade: ${item.quantity}, Preço: R$ ${item.price}`}</Text>
        )}
      />
      <Text style={styles.subTitle}>Adicionar Item</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Preço"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <Button title="Adicionar" onPress={handleAddItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  subTitle: { fontSize: 18, marginTop: 16 },
  input: { borderWidth: 1, padding: 8, marginVertical: 8, borderRadius: 4 },
});
