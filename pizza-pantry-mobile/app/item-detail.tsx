import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useInventoryItem, useDeleteItem } from '../hooks/useInventory';

export default function ItemDetailScreen() {
  const { itemId } = useLocalSearchParams();
  const router = useRouter();
  const { data: item, isLoading, error } = useInventoryItem(itemId as string);
  const deleteMutation = useDeleteItem();

  const handleDelete = () => {
    Alert.alert(
      'Delete Item',
      'Are you sure you want to delete this item? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteMutation.mutate(itemId as string, {
              onSuccess: () => {
                Alert.alert('Success', 'Item deleted successfully');
                router.back();
              },
              onError: (error) => {
                Alert.alert('Error', error.message);
              },
            });
          }
        },
      ]
    );
  };

  const handleAdjustQuantity = () => {
    router.push(`/adjust-quantity?itemId=${itemId}`);
  };

  const handleEditItem = () => {
    router.push(`/edit-item?itemId=${itemId}`);
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading item...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>Error loading item</Text>
        <Text style={styles.errorSubtext}>{error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!item) {
    return (
      <View style={styles.center}>
        <Text>Item not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isLowStock = item.quantity <= item.minStock;

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={[styles.card, styles.headerCard]}>
        <View style={styles.headerRow}>
          <Text style={styles.name}>{item.name}</Text>
          <View style={[styles.quantityBadge, isLowStock && styles.lowStockBadge]}>
            <Text style={styles.quantityBadgeText}>
              {item.quantity} {item.unit}
            </Text>
          </View>
        </View>
        <Text style={styles.category}>{item.category}</Text>
        
        {isLowStock && (
          <View style={styles.lowStockWarning}>
            <Ionicons name="warning" size={16} color="#FF9500" />
            <Text style={styles.lowStockText}>Low Stock Alert</Text>
          </View>
        )}
      </View>

      {/* Details Card */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Item Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Minimum Stock:</Text>
          <Text style={styles.value}>{item.minStock} {item.unit}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.value}>${item.price.toFixed(2)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Supplier:</Text>
          <Text style={styles.value}>{item.supplier}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Last Updated:</Text>
          <Text style={styles.value}>
            {new Date(item.lastUpdated).toLocaleDateString()}
          </Text>
        </View>
      </View>

      {/* Recent Adjustments Card */}
      {item.adjustments && item.adjustments.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recent Adjustments</Text>
          {item.adjustments.slice(0, 5).map((adjustment: any, index: number) => (
            <View key={index} style={styles.adjustmentRow}>
              <View style={styles.adjustmentInfo}>
                <Text style={styles.adjustmentReason}>{adjustment.reason}</Text>
                <Text style={styles.adjustmentDate}>
                  {new Date(adjustment.timestamp).toLocaleDateString()}
                </Text>
              </View>
              <Text 
                style={[
                  styles.adjustmentValue,
                  adjustment.adjustment > 0 ? styles.positive : styles.negative
                ]}
              >
                {adjustment.adjustment > 0 ? '+' : ''}{adjustment.adjustment}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]}
          onPress={handleAdjustQuantity}
        >
          <Ionicons name="add-circle-outline" size={20} color="white" />
          <Text style={styles.buttonText}>Adjust Quantity</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]}
          onPress={handleEditItem}
        >
          <Ionicons name="create-outline" size={20} color="#007AFF" />
          <Text style={styles.secondaryButtonText}>Edit Item</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.dangerButton]}
          onPress={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <Ionicons name="trash-outline" size={20} color="white" />
          <Text style={styles.buttonText}>
            {deleteMutation.isPending ? 'Deleting...' : 'Delete Item'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FF3B30',
    marginTop: 12,
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerCard: {
    marginTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 12,
  },
  quantityBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  lowStockBadge: {
    backgroundColor: '#FF3B30',
  },
  quantityBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  lowStockWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  lowStockText: {
    color: '#856404',
    marginLeft: 6,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  adjustmentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  adjustmentInfo: {
    flex: 1,
  },
  adjustmentReason: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  adjustmentDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  adjustmentValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  positive: {
    color: '#34C759',
  },
  negative: {
    color: '#FF3B30',
  },
  actions: {
    padding: 16,
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  secondaryButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  retryButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});