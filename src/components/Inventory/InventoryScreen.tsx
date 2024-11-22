import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';

import { useInventory } from '../../context/InventoryContext';
import { InventoryItem } from '../../types/types';

export default function InventoryScreen() {
  const { items, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useInventory();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleAddInventoryItem = () => {
    if (name && quantity && price) {
      
      const newItem: InventoryItem = {
        id: Date.now().toString(),
        name,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
      };
      
      addInventoryItem(newItem);
      setName('');
      setQuantity('');
      setPrice('');
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setName(item.name);
    setQuantity(item.quantity.toString());
    setPrice(item.price.toString());
    setModalVisible(true);
  };

  const saveEditItem = () => {
    if (editingItem && name && quantity && price) {
      const updatedItem: InventoryItem = {
        ...editingItem,
        name,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
      };
      updateInventoryItem(updatedItem);
      setModalVisible(false);
      setEditingItem(null);
    }
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Você tem certeza de que deseja excluir este item?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => deleteInventoryItem(id) },
      ]
    );
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventário</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{`${item.name} - Quantidade: ${item.quantity}, Preço: R$ ${item.price}`}</Text>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditItem(item)}
              >
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteItem(item.id)}
              >
                <Text style={styles.buttonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
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
      <Button title="Adicionar" onPress={handleAddInventoryItem} />

      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Editar Item</Text>
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
            <Button title="Salvar" onPress={saveEditItem} />
            <Button
              title="Cancelar"
              onPress={() => {
                setModalVisible(false);
                setEditingItem(null);
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  subTitle: { fontSize: 18, marginTop: 16 },
  input: { borderWidth: 1, padding: 8, marginVertical: 8, borderRadius: 4 },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  itemText: { flex: 1 },
  buttonsContainer: { flexDirection: 'row' },
  editButton: { backgroundColor: 'blue', padding: 8, marginHorizontal: 4 },
  deleteButton: { backgroundColor: 'red', padding: 8, marginHorizontal: 4 },
  buttonText: { color: 'white' },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
});
