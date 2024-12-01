import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useInventory } from '../../context/InventoryContext';
import { useProducts } from '../../context/ProductsContext';
import { useSales } from '../../context/SalesContext';
import { useCash } from '../../context/CashContext';
import { calculateBalance } from '../../utils/calculateBalance';

const HomeScreen = () => {
  const { items: inventoryItems } = useInventory();
  const { items: productItems } = useProducts();
  const { sales } = useSales();
  const { transactions } = useCash();

  const paymentStatusCount = sales.reduce(
    (acc, sale) => {
      if (sale.paymentStatus === 'Não pago') acc.naoPago++;
      if (sale.paymentStatus === '50% pago') acc.cinquentaPago++;
      if (sale.paymentStatus === 'Totalmente pago') acc.totalmentePago++;
      return acc;
    },
    { naoPago: 0, cinquentaPago: 0, totalmentePago: 0 }
  );

  const productionStatusCount = sales.reduce(
    (acc, sale) => {
      if (sale.productionStatus === 'Não iniciada') acc.naoIniciada++;
      if (sale.productionStatus === 'Em produção') acc.emProducao++;
      if (sale.productionStatus === 'Pronta') acc.pronta++;
      return acc;
    },
    { naoIniciada: 0, emProducao: 0, pronta: 0 }
  );

  const balance = calculateBalance(transactions);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Artesão Organizado</Text>

      <View style={styles.summaryContainer}>
        <View style={styles.itemContainer}>
          <Text style={styles.summaryTitle}>Inventário</Text>
          <Text style={styles.summaryText}>
            Total de Produtos: {productItems.length}
          </Text>
          <Text style={styles.summaryText}>
            Total de Materiais: {inventoryItems.length}
          </Text>
        </View>
        <View style={styles.itemContainer}>
          <View>
            <Text style={styles.summaryTitle}>Vendas</Text>
            <Text style={styles.summaryTextBold}>Status de pagamento</Text>
            <Text style={styles.summaryText}>
              Não pago: {paymentStatusCount.naoPago}
            </Text>
            <Text style={styles.summaryText}>
              50% pago: {paymentStatusCount.cinquentaPago}
            </Text>
            <Text style={styles.summaryText}>
              Totalmente pago: {paymentStatusCount.totalmentePago}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.summaryTextBold}>Status de produção</Text>
            <Text style={styles.summaryText}>
              Não iniciada: {productionStatusCount.naoIniciada}
            </Text>
            <Text style={styles.summaryText}>
              Em produção: {productionStatusCount.emProducao}
            </Text>
            <Text style={styles.summaryText}>
              Pronta: {productionStatusCount.pronta}
            </Text>
          </View>
        </View>
        <View style={styles.itemContainerLast}>
          <Text style={styles.summaryTitle}>Caixa</Text>
          <Text style={styles.summaryText}>Saldo do Caixa: R$ {balance.toFixed(2)}</Text>
        </View>
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
    backgroundColor: '#ffffff',
  },
  summaryContainer: {
    width: '100%',
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemContainerLast: {
    padding: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 60,
    marginTop: 80
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 18,
  },
  summaryTextBold: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  card: {
    marginTop: 4,
  },
});

export default HomeScreen;
