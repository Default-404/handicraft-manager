import React, { useState, useRef } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, Alert, TouchableOpacity, Modal} from 'react-native';

import { Picker } from '@react-native-picker/picker';

import Ionicons from '@expo/vector-icons/Ionicons';

import { useSales } from '../../context/SalesContext';
import { useProducts } from '../../context/ProductsContext';
import { ProductsItem, SalesItem } from '../../types/types';

const SalesScreen = () => {
  const { sales, addSale, updateSale, deleteSale } = useSales();
  const { items } = useProducts();
  const [selectedProducts, setSelectedProducts] = useState<ProductsItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'Não pago' | '50% pago' | 'Totalmente pago'>('Não pago');
  const [productionStatus, setProductionStatus] = useState<'Não iniciada' | 'Em produção' | 'Pronta'>('Não iniciada');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSale, setEditingSale] = useState<SalesItem | null>(null);
  const [expandedSales, setExpandedSales] = useState<{ [key: string]: boolean }>({});
  const flatListRef = useRef<FlatList>(null);

  const handleAddProduct = () => {
    const product = items.find((item) => item.id === selectedProductId);
    const quantity = parseInt(productQuantity, 10);
  
    if (!product || quantity <= 0) {
      Alert.alert('Erro', 'Quantidade inválida ou insuficiente.');
      return;
    }
  
    const isDuplicate = selectedProducts.some((item) => item.id === selectedProductId);
  
    if (isDuplicate) {
      Alert.alert('Erro', 'Este produto já foi adicionado.');
      return;
    }
  
    setSelectedProducts((prevProducts) => {
      const updatedProducts = [...prevProducts, { ...product, quantity }];
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      return updatedProducts;
    });
    setSelectedProductId('');
    setProductQuantity('');
  };

  const handleAddSale = () => {
    if (selectedProducts.length === 0) {
      Alert.alert('Erro', 'Adicione pelo menos um produto à venda.');
      return;
    }

    const totalPrice = selectedProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);

    if (editingSale) {
      updateSale({
        id: editingSale.id,
        price: totalPrice,
        paymentStatus,
        productionStatus,
        products: selectedProducts.map(product => ({
          itemId: product.id,
          name: product.name,
          quantity: product.quantity,
          price: product.price,
        })),
      });
      setEditingSale(null);
    } else {
      addSale({
        products: selectedProducts.map((product) => ({
          itemId: product.id,
          name: product.name,
          quantity: product.quantity,
          price: product.price,
        })),
        price: totalPrice,
        paymentStatus,
        productionStatus,
      });
    }

    setSelectedProducts([]);
    setModalVisible(false);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((product) => product.id !== productId));
  };
  
  const openAddModal = () => {
    setSelectedProducts([]);
    setSelectedProductId('');
    setProductQuantity('');
    setPaymentStatus('Não pago');
    setProductionStatus('Não iniciada');
    setModalVisible(true);
  };

  const openEditModal = (sale: SalesItem) => {
    setEditingSale(sale);
    setSelectedProducts(
      sale.products.map(product => ({
        id: product.itemId,
        name: product.name,
        quantity: product.quantity,
        price: product.price,
      }))
    );
    setPaymentStatus(sale.paymentStatus);
    setProductionStatus(sale.productionStatus);
    setModalVisible(true);
  };

  const handleDeleteSale = (saleId: string) => {
    Alert.alert(
      'Confirmar exclusão',
      'Você tem certeza de que deseja excluir este produto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', 
          style: 'destructive', 
          onPress: () => {
            deleteSale(saleId);
            setModalVisible(false);
            setEditingSale(null);
          },
        },
      ]
    );
  };

  const toggleExpand = (id: string) => {
    setExpandedSales((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sales}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        keyExtractor={(sale) => sale.id}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemContainerRow}>
              <View style={styles.infoContainer}>
                <View style={styles.itemContainerRow}>
                  <View>
                    <Text style={styles.itemTextName}>{`Venda N°: ${index + 1}`}</Text>
                    <Text style={styles.itemText}>{`Total: R$ ${item.price}`}</Text>
                  </View>
                  <View style={styles.iconsContainer}>
                    <TouchableOpacity style={styles.icon} onPress={() => openEditModal(item)}>
                      <Ionicons name="ellipsis-horizontal" size={24} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.icon} onPress={() => toggleExpand(item.id)}>
                      <Ionicons
                        name={expandedSales[item.id] ? 'chevron-up' : 'chevron-down'}
                        size={24}
                        color="black"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.pickerContainer}>
                  <View style={styles.pickerContent}>
                    <Picker
                      selectedValue={item.paymentStatus}
                      onValueChange={(value) => {
                        const updatedSale = {
                          ...item,
                          paymentStatus: value,
                          products: [...item.products],
                        };
                        updateSale(updatedSale);
                      }}
                    >
                      <Picker.Item label="Não pago" value="Não pago" style={styles.font}/>
                      <Picker.Item label="50% pago" value="50% pago" style={styles.font}/>
                      <Picker.Item label="Totalmente pago" value="Totalmente pago" style={styles.font}/>
                    </Picker>
                  </View>
                  <View style={styles.pickerContent}>
                    <Picker
                      selectedValue={item.productionStatus}
                      onValueChange={(value) => {
                        const updatedSale = {
                          ...item,
                          productionStatus: value,
                          products: [...item.products],
                        };
                        updateSale(updatedSale);
                      }}
                    >
                      <Picker.Item label="Não iniciada" value="Não iniciada" style={styles.font}/>
                      <Picker.Item label="Em produção" value="Em produção" style={styles.font}/>
                      <Picker.Item label="Pronta" value="Pronta" style={styles.font}/>
                    </Picker>
                  </View>
                </View>
              </View>
            </View>
            {expandedSales[item.id] && (
              <View style={styles.productsContainer}>
                <Text style={styles.expandedSalesTitle}>Produtos:</Text>
                {item.products.map((product) => (
                  <Text key={product.itemId} style={styles.expandedSalesItem}>
                    {`${product.name} - Quantidade: ${product.quantity}`}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={openAddModal}>
        <Text style={styles.buttonText}>+ Registrar Venda</Text>
      </TouchableOpacity>
      
      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.itemContainerRow}>
              <Text style={styles.title}>
                {editingSale ? 'Atualizar venda' : 'Registrar nova venda'}
              </Text>
              {editingSale && (
                <TouchableOpacity
                  style={styles.trash}
                  onPress={() => handleDeleteSale(editingSale.id)}
                >
                  <Ionicons name="trash" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerContent}>
                <Picker
                  selectedValue={selectedProductId}
                  onValueChange={setSelectedProductId}
                >
                  <Picker.Item label="Selecione um produto" value="" style={styles.font} />
                  {items.map((item) => (
                    <Picker.Item key={item.id} label={item.name} value={item.id} style={styles.font} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={styles.itemContainerRow}>
              <TextInput
                style={styles.inputQuantity}
                placeholder="Quantidade"
                value={productQuantity}
                onChangeText={setProductQuantity}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.addbutton} onPress={handleAddProduct}>
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
            <FlatList
              ref={flatListRef}
              data={selectedProducts}
              showsVerticalScrollIndicator={false}
              overScrollMode="never"
              style={styles.flatList}
              keyExtractor={(product) => product.id}
              renderItem={({ item }) => (
                <View style={styles.productItemContainer}>
                  <Text>{`${item.name} - Quantidade: ${item.quantity}`}</Text>
                  <TouchableOpacity onPress={() => handleRemoveProduct(item.id)}>
                    <Ionicons name="trash" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              )}
            />
            <View style={styles.pickerContainer}>
              <View style={styles.pickerContent}>
                <Picker
                  selectedValue={paymentStatus}
                  onValueChange={setPaymentStatus}
                >
                  <Picker.Item label="Não pago" value="Não pago" style={styles.font}/>
                  <Picker.Item label="50% pago" value="50% pago" style={styles.font}/>
                  <Picker.Item label="Totalmente pago" value="Totalmente pago" style={styles.font}/>
                </Picker>
              </View>
              <View style={styles.pickerContent}>
                <Picker
                  selectedValue={productionStatus}
                  onValueChange={setProductionStatus}
                >
                  <Picker.Item label="Não iniciada" value="Não iniciada" style={styles.font}/>
                  <Picker.Item label="Em produção" value="Em produção" style={styles.font}/>
                  <Picker.Item label="Pronta" value="Pronta" style={styles.font}/>
                </Picker>
              </View>
            </View>
            <TouchableOpacity style={styles.button} onPress={handleAddSale}>
              <Text style={styles.buttonText}>
                {editingSale ? 'Atualizar' : 'Registrar'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => {
                setModalVisible(false);
                setEditingSale(null);
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  button: {
    backgroundColor: '#0066FF',
    padding: 12,
    marginTop: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  addbutton: {
    backgroundColor: '#0066FF',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { 
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
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
  productsContainer: {
    marginTop: 8,
    paddingLeft: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputQuantity: { 
    borderWidth: 1,
    padding: 8,
    marginVertical: 8,
    borderRadius: 4,
    fontSize: 18,
    flex: 1,
    marginRight: 16,
    borderColor: '#ccc',
  },
  font: { 
    fontSize: 18,
  },
  productItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  flatList: { 
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    height: 100,
    borderColor: '#ccc',
  },
  trash: {
    marginBottom: 16,
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  icon: {
    marginLeft: 16,
  },
  infoContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 18,
  },
  itemTextName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  pickerContainer: {
    marginTop: 4,
  },
  pickerContent: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: 4,
  },
  expandedSalesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  expandedSalesItem: {
    fontSize: 16,
  },
});

export default SalesScreen;