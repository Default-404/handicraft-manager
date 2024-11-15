import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Handicraft Manager!</Text>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Resumo do Inventário: 100 itens</Text>
        <Text style={styles.summaryText}>Vendas do Dia: R$ 500,00</Text>
        <Text style={styles.summaryText}>Saldo do Caixa: R$ 200,00</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summaryContainer: {
    marginTop: 20,
    width: '100%',
  },
  summaryText: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default HomeScreen;
