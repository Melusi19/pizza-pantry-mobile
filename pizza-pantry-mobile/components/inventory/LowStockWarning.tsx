import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { InventoryItem } from '../../types';
import { Card, CardHeader } from '../ui/Card';

interface LowStockWarningProps {
  items: InventoryItem[];
  maxItems?: number;
  onItemPress?: (itemId: string) => void;
}

export const LowStockWarning: React.FC<LowStockWarningProps> = ({
  items,
  maxItems = 5,
  onItemPress,
}) => {
  const router = useRouter();

  const lowStockItems = items
    .filter(item => item.quantity <= item.minStock)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, maxItems);

  const handleItemPress = (itemId: string) => {
    if (onItemPress) {
      onItemPress(itemId);
    } else {
      router.push(`/item-detail?itemId=${itemId}`);
    }
  };

  const getStockLevelColor = (quantity: number, minStock: number) => {
    if (quantity === 0) return '#FF3B30';
    if (quantity <= minStock * 0.5) return '#FF9500';
    return '#FFCC00';
  };

  const getStockLevelText = (quantity: number, minStock: number) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity <= minStock * 0.5) return 'Very Low';
    return 'Low Stock';
  };

  if (lowStockItems.length === 0) {
    return null;
  }

  return (
    <Card style={styles.container}>
      <CardHeader
        title="Low Stock Alert"
        subtitle={`${lowStockItems.length} item${lowStockItems.length > 1 ? 's' : ''} need attention`}
      />
      
      <View style={styles.itemsList}>
        {lowStockItems.map((item, index) => {
          const stockColor = getStockLevelColor(item.quantity, item.minStock);
          const stockText = getStockLevelText(item.quantity, item.minStock);
          
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.item,
                index < lowStockItems.length - 1 && styles.itemWithBorder,
              ]}
              onPress={() => handleItemPress(item.id)}
            >
              <View style={styles.itemLeft}>
                <View
                  style={[styles.stockIndicator, { backgroundColor: stockColor }]}
                />
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemDetails}>
                    {item.quantity} {item.unit} • Min: {item.minStock} {item.unit}
                  </Text>
                </View>
              </View>
              
              <View style={styles.itemRight}>
                <View
                  style={[styles.stockLevelBadge, { backgroundColor: `${stockColor}20` }]}
                >
                  <Text style={[styles.stockLevelText, { color: stockColor }]}>
                    {stockText}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#C6C6C8" />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
      
      {items.filter(item => item.quantity <= item.minStock).length > maxItems && (
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            +{items.filter(item => item.quantity <= item.minStock).length - maxItems} more items need attention
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  itemsList: {
    paddingVertical: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  itemWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  stockIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stockLevelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stockLevelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  footerText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    textAlign: 'center',
  },
});