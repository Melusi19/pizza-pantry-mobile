import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { InventoryItem } from '../../types';

const fetchInventory = async (): Promise<InventoryItem[]> => {
  const response = await fetch('/api/inventory');
  if (!response.ok) throw new Error('Failed to fetch inventory');
  return response.json();
};

export default function InventoryListScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const { data: inventory, error, isLoading, refetch } = useQuery({
    queryKey: ['inventory'],
    queryFn: fetchInventory,
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filteredInventory = inventory?.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text>Loading inventory...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>Error loading inventory</Text>
        <TouchableOpacity onPress={() => refetch()}>
          <Text style={styles.retryButton}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search inventory..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <FlatList
        data={filteredInventory}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.center}>
            <Text>No items found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemCard}
            onPress={() => router.push(`/item-detail?itemId=${item.id}`)}
          >
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text
                style={[
                  styles.quantity,
                  item.quantity <= item.minStock && styles.lowStock,
                ]}
              >
                {item.quantity} {item.unit}
              </Text>
            </View>
            <Text style={styles.category}>{item.category}</Text>
            {item.quantity <= item.minStock && (
              <Text style={styles.lowStockWarning}>Low Stock!</Text>
            )}
          </TouchableOpacity>
        )}
      />
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-item')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '600',
  },
  lowStock: {
    color: '#FF3B30',
  },
  category: {
    color: '#666',
    marginTop: 4,
  },
  lowStockWarning: {
    color: '#FF3B30',
    fontWeight: '600',
    marginTop: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    color: '#007AFF',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});