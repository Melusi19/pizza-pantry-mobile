import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { InventoryItem as InventoryItemType } from '../../types';
import { Card, CardContent } from '../ui/Card';

interface InventoryItemProps {
  item: InventoryItemType;
  onAdjust?: (itemId: string) => void;
  onEdit?: (itemId: string) => void;
  onDelete?: (itemId: string) => void;
}

export const InventoryItem: React.FC<InventoryItemProps> = ({
  item,
  onAdjust,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();

  const handleItemPress = () => {
    router.push(`/item-detail?itemId=${item.id}`);
  };

  const handleAdjustPress = () => {
    if (onAdjust) {
      onAdjust(item.id);
    } else {
      router.push(`/adjust-quantity?itemId=${item.id}`);
    }
  };

  const handleEditPress = () => {
    if (onEdit) {
      onEdit(item.id);
    } else {
      router.push(`/edit-item?itemId=${item.id}`);
    }
  };

  const handleDeletePress = () => {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (onDelete) {
              onDelete(item.id);
            }
          },
        },
      ]
    );
  };

  const isLowStock = item.quantity <= item.minStock;
  const isOutOfStock = item.quantity === 0;

  const getStockStatusColor = () => {
    if (isOutOfStock) return '#FF3B30';
    if (isLowStock) return '#FF9500';
    return '#34C759';
  };

  const getStockStatusText = () => {
    if (isOutOfStock) return 'Out of Stock';
    if (isLowStock) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <Card elevation="medium" style={styles.card}>
      <TouchableOpacity onPress={handleItemPress}>
        <CardContent padded={false}>
          <View style={styles.content}>
            {/* Main Info */}
            <View style={styles.mainInfo}>
              <View style={styles.header}>
                <Text style={styles.name} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.quantityBadge}>
                  <Text style={styles.quantityText}>
                    {item.quantity} {item.unit}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.category}>{item.category}</Text>
              
              <View style={styles.details}>
                <View style={styles.detailItem}>
                  <Ionicons name="pricetag-outline" size={14} color="#666" />
                  <Text style={styles.detailText}>
                    ${item.price.toFixed(2)}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Ionicons name="business-outline" size={14} color="#666" />
                  <Text style={styles.detailText} numberOfLines={1}>
                    {item.supplier}
                  </Text>
                </View>
              </View>
            </View>

            {/* Stock Status */}
            <View style={styles.statusSection}>
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: getStockStatusColor() },
                ]}
              />
              <Text
                style={[
                  styles.statusText,
                  { color: getStockStatusColor() },
                ]}
              >
                {getStockStatusText()}
              </Text>
            </View>
          </View>

          {/* Warning Messages */}
          {isLowStock && (
            <View style={styles.warning}>
              <Ionicons name="warning" size={16} color="#FF9500" />
              <Text style={styles.warningText}>
                {isOutOfStock
                  ? 'This item is out of stock'
                  : `Only ${item.quantity} ${item.unit} left (min: ${item.minStock})`}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.adjustButton]}
              onPress={handleAdjustPress}
            >
              <Ionicons name="add-circle-outline" size={18} color="#007AFF" />
              <Text style={styles.actionButtonText}>Adjust</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.editButton]}
              onPress={handleEditPress}
            >
              <Ionicons name="create-outline" size={18} color="#666" />
              <Text style={styles.actionButtonText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDeletePress}
            >
              <Ionicons name="trash-outline" size={18} color="#FF3B30" />
              <Text style={[styles.actionButtonText, styles.deleteText]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </CardContent>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  mainInfo: {
    flex: 1,
    marginRight: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    flex: 1,
    marginRight: 8,
  },
  quantityBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C1C1E',
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  statusSection: {
    alignItems: 'center',
    minWidth: 80,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    padding: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    gap: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#996500',
    fontWeight: '500',
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  adjustButton: {
    borderRightWidth: 1,
    borderRightColor: '#F2F2F7',
  },
  editButton: {
    borderRightWidth: 1,
    borderRightColor: '#F2F2F7',
  },
  deleteButton: {
    // No border on last item
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  deleteText: {
    color: '#FF3B30',
  },
});