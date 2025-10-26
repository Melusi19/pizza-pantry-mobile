import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { QuantityAdjustment } from '../../types';
import { Card, CardHeader } from '../ui/Card';

interface QuantityAdjustmentHistoryProps {
  adjustments: QuantityAdjustment[];
  maxItems?: number;
}

export const QuantityAdjustmentHistory: React.FC<QuantityAdjustmentHistoryProps> = ({
  adjustments,
  maxItems = 10,
}) => {
  const displayedAdjustments = adjustments.slice(0, maxItems);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getAdjustmentIcon = (adjustment: number) => {
    if (adjustment > 0) {
      return { name: 'add-circle' as const, color: '#34C759' };
    } else {
      return { name: 'remove-circle' as const, color: '#FF3B30' };
    }
  };

  if (adjustments.length === 0) {
    return (
      <Card>
        <CardHeader title="Adjustment History" />
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={48} color="#C6C6C8" />
          <Text style={styles.emptyStateText}>No adjustments yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Quantity adjustments will appear here
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader 
        title="Recent Adjustments" 
        subtitle={`Last ${displayedAdjustments.length} of ${adjustments.length} adjustments`}
      />
      
      <FlatList
        data={displayedAdjustments}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        renderItem={({ item }) => {
          const icon = getAdjustmentIcon(item.adjustment);
          
          return (
            <View style={styles.adjustmentItem}>
              <View style={styles.adjustmentLeft}>
                <Ionicons name={icon.name} size={20} color={icon.color} />
                <View style={styles.adjustmentInfo}>
                  <Text style={styles.adjustmentReason}>{item.reason}</Text>
                  <Text style={styles.adjustmentDate}>
                    {formatDate(item.timestamp)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.adjustmentRight}>
                <Text
                  style={[
                    styles.adjustmentValue,
                    { color: icon.color },
                  ]}
                >
                  {item.adjustment > 0 ? '+' : ''}{item.adjustment}
                </Text>
                <Text style={styles.adjustmentFromTo}>
                  {item.previousQuantity} → {item.newQuantity}
                </Text>
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      
      {adjustments.length > maxItems && (
        <View style={styles.moreItems}>
          <Text style={styles.moreItemsText}>
            +{adjustments.length - maxItems} more adjustments
          </Text>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
  adjustmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  adjustmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  adjustmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  adjustmentReason: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
    marginBottom: 2,
  },
  adjustmentDate: {
    fontSize: 12,
    color: '#666',
  },
  adjustmentRight: {
    alignItems: 'flex-end',
  },
  adjustmentValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  adjustmentFromTo: {
    fontSize: 12,
    color: '#666',
  },
  separator: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginHorizontal: 16,
  },
  moreItems: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  moreItemsText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    textAlign: 'center',
  },
});