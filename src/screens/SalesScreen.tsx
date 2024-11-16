import React, { useState } from 'react';
import { View, Text, FlatList, Button, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSales } from '../context/SalesContext';
import { useInventory } from '../context/InventoryContext';

export default function SalesScreen() {
  const { sales, addSale } = useSales();
  const { items, updateItemQuantity } = useInventory();
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  
  const [paymentStatus, setPaymentStatus] = useState<'Não pago' | '50% pago' | 'Totalmente pago'>('Não pago');
  const [productionStatus, setProductionStatus] = useState<'Não iniciada' | 'Em produção' | 'Pronta'>('Não iniciada');

  const handleAddSale = () => {
    const item = items.find((item) => item.id === selectedItem);
    if (item && quantity) {
      const saleQuantity = parseInt(quantity, 10);
      if (saleQuantity > item.quantity) {
        alert('Quantidade insuficiente em estoque.');
        return;
      }
      addSale({
        id: Date.now().toString(),
        itemId: item.id,
        quantity: saleQuantity,
        price: item.price * saleQuantity,
        paymentStatus,
        productionStatus,
      });
      updateItemQuantity(item.id, item.quantity - saleQuantity);
      setSelectedItem('');
      setQuantity('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vendas</Text>
      <FlatList
        data={sales}
        keyExtractor={(sale) => sale.id}
        renderItem={({ item }) => (
          <Text>{`Item: ${item.itemId}, Quantidade: ${item.quantity}, Total: R$ ${item.price}`}</Text>
        )}
      />
      <Text style={styles.subTitle}>Registrar Venda</Text>
      <Picker
        selectedValue={selectedItem}
        onValueChange={(value) => setSelectedItem(value as string)}
        style={styles.input}
      >
        <Picker.Item label="Selecione um item" value="" />
        {items.map((item) => (
          <Picker.Item key={item.id} label={item.name} value={item.id} style={styles.font} />
        ))}
      </Picker>
      <TextInput
        style={styles.input}
        placeholder="Quantidade"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <Picker
        selectedValue={paymentStatus}
        onValueChange={(value) => setPaymentStatus(value as 'Não pago' | '50% pago' | 'Totalmente pago')}
        style={styles.input}
      >
        <Picker.Item label="Não pago" value="Não pago" style={styles.font}/>
        <Picker.Item label="50% pago" value="50% pago" style={styles.font}/>
        <Picker.Item label="Totalmente pago" value="Totalmente pago" style={styles.font}/>
      </Picker>
      <Picker
        selectedValue={productionStatus}
        onValueChange={(value) => setProductionStatus(value as 'Não iniciada' | 'Em produção' | 'Pronta')}
        style={styles.input}
      >
        <Picker.Item label="Não iniciada" value="Não iniciada" style={styles.font}/>
        <Picker.Item label="Em produção" value="Em produção" style={styles.font}/>
        <Picker.Item label="Pronta" value="Pronta" style={styles.font}/>
      </Picker>
      <Button title="Registrar Venda" onPress={handleAddSale} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  subTitle: { fontSize: 22, marginTop: 16 },
  input: { borderWidth: 1, padding: 8, marginVertical: 8, borderRadius: 4, fontSize: 18 },
  font: { fontSize: 18 },
});
