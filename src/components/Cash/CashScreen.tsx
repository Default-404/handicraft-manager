import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Alert, TouchableOpacity, Modal } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import { useCash } from '../../context/CashContext';
import { CashItem } from '../../types/types';
import { calculateBalance } from '../../utils/calculateBalance';

const CashScreen = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useCash();
  const [type, setType] = useState<'Entrada' | 'Saída' | ''>('');
  const [amount, setAmount] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<CashItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTransaction = () => {
    if ((type === 'Entrada' || type === 'Saída') && amount) {
      const currentDate = new Date().toISOString().split('T')[0];
      const newTransaction = { type, amount: parseFloat(amount), date: currentDate };
      addTransaction(newTransaction);
      setType('');
      setAmount('');
      setModalVisible(false);
    } else {
      Alert.alert('Erro', 'Escolha um tipo e preencha o valor.');
    }
  };

  const handleEditTransaction = (transaction: CashItem) => {
    setEditingTransaction(transaction);
    setType(transaction.type);
    setAmount(transaction.amount.toString());
    setIsAdding(false);
    setModalVisible(true);
  };

  const saveEditTransaction = () => {
    if (editingTransaction && amount && (type === 'Entrada' || type === 'Saída')) {
      const updatedTransaction: CashItem = {
        ...editingTransaction,
        type,
        amount: parseFloat(amount),
      };
      updateTransaction(updatedTransaction);
      setModalVisible(false);
      setEditingTransaction(null);
    } else {
      Alert.alert('Erro', 'Todos os campos devem ser preenchidos.');
    }
  };

  const handleDeleteTransaction = (id: number) => {
    Alert.alert(
      'Confirmar exclusão', 
      'Você tem certeza de que deseja excluir esta transação?', 
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', 
          style: 'destructive', 
          onPress: () => {
            deleteTransaction(id);
            setModalVisible(false);
            setEditingTransaction(null);
          },
        },
      ]
    );
  };

  const openAddModal = () => {
    setType('');
    setAmount('');
    setEditingTransaction(null);
    setIsAdding(true);
    setModalVisible(true);
  };

  const balance = calculateBalance(transactions);


  return (
    <View style={styles.container}>
      <Text style={styles.titlePage}>Saldo do Caixa</Text>
      <Text style={styles.balance}>R$ {balance.toFixed(2)}</Text>
      <FlatList
        data={transactions}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemContainerRow}>
              <View>
                <Text style={styles.itemTextName}>{item.type}</Text>
                <Text style={styles.itemText}>Valor: R$ {item.amount.toFixed(2)}</Text>
                <Text style={styles.itemText}>Data: {item.date}</Text>
              </View>
              <TouchableOpacity onPress={() => handleEditTransaction(item)}>
                <Ionicons name="ellipsis-vertical" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={openAddModal}>
        <Text style={styles.buttonText}>+ Adicionar Transação</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.itemContainerRow}>
              <Text style={styles.title}>
                {isAdding ? 'Adicionar transação' : 'Editar transação'}
              </Text>
              {!isAdding && editingTransaction && (
                <TouchableOpacity
                  style={styles.trash}
                  onPress={() => handleDeleteTransaction(editingTransaction.id)}
                >
                  <Ionicons name="trash" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.inputLabel}>Tipo de transação</Text>
            <View style={styles.typeButtonsContainer}>
              <TouchableOpacity
                style={[styles.typeButton, type === 'Entrada' && styles.selectedTypeButton]}
                onPress={() => setType('Entrada')}
              >
                <Text style={styles.buttonText}>Entrada</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeButton, type === 'Saída' && styles.selectedTypeButton]}
                onPress={() => setType('Saída')}
              >
                <Text style={styles.buttonText}>Saída</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Valor"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.button} onPress={isAdding ? handleAddTransaction : saveEditTransaction}>
              <Text style={styles.buttonText}>{isAdding ? 'Adicionar' : 'Salvar'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

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
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  typeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 8,
  },
  typeButton: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  selectedTypeButton: {
    backgroundColor: '#0066FF',
  },
  input: {
    borderWidth: 1, 
    padding: 8, 
    marginVertical: 8, 
    borderRadius: 4,
    borderColor: '#ccc',
    fontSize: 18,
  },
  button: {
    backgroundColor: '#0066FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { 
    color: '#ffffff', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  trash: {
    marginBottom: 16,
  },
  titlePage: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8
  },
  balance: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
});

export default CashScreen;
