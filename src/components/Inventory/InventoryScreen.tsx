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
  const [isAdding, setIsAdding] = useState(false);

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
      setModalVisible(false);
    } else {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos.');
    }
  };

  const handleEditItem = (item: InventoryItem) => {
    setEditingItem(item);
    setName(item.name);
    setQuantity(item.quantity.toString());
    setPrice(item.price.toString());
    setIsAdding(false);
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
    } else {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos.');
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

  const openAddModal = () => {
    setName('');
    setQuantity('');
    setPrice('');
    setEditingItem(null);
    setIsAdding(true);
    setModalVisible(true);
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
      <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
        <Text style={styles.addButtonText}>+ Adicionar Item</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>
              {isAdding ? 'Adicionar Novo Item' : 'Editar Item'}
            </Text>
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
            <Button
              title={isAdding ? 'Adicionar' : 'Salvar'}
              onPress={isAdding ? handleAddInventoryItem : saveEditItem}
            />
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
  addButton: {
    backgroundColor: 'green',
    padding: 12,
    marginTop: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: { color: 'white', fontWeight: 'bold' },
});
