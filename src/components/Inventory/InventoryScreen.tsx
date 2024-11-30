import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import { useInventory } from '../../context/InventoryContext';
import { InventoryItem } from '../../types/types';

const InventoryScreen = () => {
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
      'Você tem certeza de que deseja excluir este material?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', 
          style: 'destructive', 
          onPress: () => {
            deleteInventoryItem(id);
            setModalVisible(false);
            setEditingItem(null);
          },
        },
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
      <FlatList
        data={items}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemContainerRow}>
              <View>
                <Text style={styles.itemTextName}>{item.name}</Text>
                <Text style={styles.itemText}>Quantidade: {item.quantity}</Text>
                <Text style={styles.itemText}>Preço Unitário: R$ {item.price.toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleEditItem(item)}
              >
                <Ionicons name="ellipsis-vertical" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={openAddModal}>
        <Text style={styles.buttonText}>+ Adicionar Material</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.itemContainerRow}>
              <Text style={styles.title}>
                {isAdding ? 'Adicionar novo material' : 'Editar material'}
              </Text>
              {!isAdding && editingItem && (
                <TouchableOpacity
                  style={styles.trash}
                  onPress={() => handleDeleteItem(editingItem.id)}
                >
                  <Ionicons name="trash" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
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
              placeholder="Preço Unitário"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={isAdding ? handleAddInventoryItem : saveEditItem}>
              <Text style={styles.buttonText}>
                {isAdding ? 'Adicionar' : 'Salvar'} 
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => {
                setModalVisible(false);
                setEditingItem(null);
              }}>
              <Text style={styles.buttonText}>
                Cancelar 
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemContainerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 18,
  },
  itemTextName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  trash: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 16,
  },
  input: {
    borderWidth: 1, 
    padding: 8, 
    marginVertical: 8, 
    borderRadius: 4,
    borderColor: '#ccc',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#0066FF',
    padding: 12,
    marginTop: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { 
    color: '#ffffff', 
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default InventoryScreen;