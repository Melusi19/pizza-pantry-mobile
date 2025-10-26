import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { quantityAdjustmentSchema, QuantityAdjustmentData } from '../lib/validation';
import { useInventoryItem, useAdjustQuantity } from '../hooks/useInventory';

const ADJUSTMENT_REASONS = [
  'Delivery Received',
  'Stock Count Correction',
  'Waste/Damage',
  'Theft/Loss',
  'Production Usage',
  'Transfer In',
  'Transfer Out',
  'Other'
];

export default function AdjustQuantityScreen() {
  const { itemId } = useLocalSearchParams();
  const router = useRouter();
  const { data: item, isLoading, error } = useInventoryItem(itemId as string);
  const adjustMutation = useAdjustQuantity();
  
  const [showReasonDropdown, setShowReasonDropdown] = useState(false);
  const [adjustmentType, setAdjustmentType] = useState<'add' | 'remove'>('add');

  const { control, handleSubmit, formState: { errors }, watch, setValue } = useForm<QuantityAdjustmentData>({
    resolver: zodResolver(quantityAdjustmentSchema),
    defaultValues: {
      adjustment: 0,
      reason: '',
    },
    mode: 'onChange',
  });

  const adjustmentValue = watch('adjustment') || 0;
  const currentQuantity = item?.quantity || 0;
  const newQuantity = currentQuantity + adjustmentValue;

  const onSubmit = (data: QuantityAdjustmentData) => {
    if (data.adjustment === 0) {
      Alert.alert('Invalid Adjustment', 'Adjustment amount cannot be zero.');
      return;
    }

    if (newQuantity < 0) {
      Alert.alert('Invalid Adjustment', 'Resulting quantity cannot be negative.');
      return;
    }

    adjustMutation.mutate(
      { itemId: itemId as string, data },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Quantity adjusted successfully!', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        },
        onError: (error) => {
          Alert.alert('Error', error.message || 'Failed to adjust quantity');
        },
      }
    );
  };

  const handleCancel = () => {
    router.back();
  };

  const selectReason = (reason: string) => {
    setValue('reason', reason, { shouldValidate: true });
    setShowReasonDropdown(false);
  };

  const handleQuickAdjust = (amount: number) => {
    setValue('adjustment', Math.abs(amount), { shouldValidate: true });
    setAdjustmentType(amount > 0 ? 'add' : 'remove');
  };

  const handleAdjustmentTypeChange = (type: 'add' | 'remove') => {
    setAdjustmentType(type);
    // Keep the absolute value but change sign if needed
    const currentValue = Math.abs(adjustmentValue);
    setValue('adjustment', type === 'add' ? currentValue : -currentValue, { shouldValidate: true });
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading item...</Text>
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>Error loading item</Text>
        <Text style={styles.errorSubtext}>{error?.message || 'Item not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Adjust Quantity</Text>
          <Text style={styles.subtitle}>{item.name}</Text>
        </View>

        {/* Current Quantity Card */}
        <View style={styles.quantityCard}>
          <Text style={styles.quantityLabel}>Current Quantity</Text>
          <Text style={styles.quantityValue}>
            {currentQuantity} {item.unit}
          </Text>
        </View>

        <View style={styles.form}>
          {/* Adjustment Type Toggle */}
          <View style={styles.field}>
            <Text style={styles.label}>Adjustment Type</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  styles.toggleLeft,
                  adjustmentType === 'add' && styles.toggleActive
                ]}
                onPress={() => handleAdjustmentTypeChange('add')}
              >
                <Ionicons 
                  name="add-circle" 
                  size={20} 
                  color={adjustmentType === 'add' ? 'white' : '#007AFF'} 
                />
                <Text style={[
                  styles.toggleText,
                  adjustmentType === 'add' && styles.toggleTextActive
                ]}>
                  Add Stock
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  styles.toggleRight,
                  adjustmentType === 'remove' && styles.toggleActive
                ]}
                onPress={() => handleAdjustmentTypeChange('remove')}
              >
                <Ionicons 
                  name="remove-circle" 
                  size={20} 
                  color={adjustmentType === 'remove' ? 'white' : '#FF3B30'} 
                />
                <Text style={[
                  styles.toggleText,
                  adjustmentType === 'remove' && styles.toggleTextActive
                ]}>
                  Remove Stock
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Adjustment Amount */}
          <View style={styles.field}>
            <Text style={styles.label}>Adjustment Amount *</Text>
            <Controller
              control={control}
              name="adjustment"
              render={({ field: { onChange, value } }) => (
                <View>
                  <TextInput
                    style={[styles.input, errors.adjustment && styles.inputError]}
                    value={value ? Math.abs(value).toString() : ''}
                    onChangeText={(text) => {
                      const num = text ? parseInt(text) : 0;
                      const absoluteValue = isNaN(num) ? 0 : Math.abs(num);
                      onChange(adjustmentType === 'add' ? absoluteValue : -absoluteValue);
                    }}
                    placeholder="0"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                  <Text style={styles.unitLabel}>{item.unit}</Text>
                </View>
              )}
            />
            {errors.adjustment && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{errors.adjustment.message}</Text>
              </View>
            )}

            {/* Quick Adjust Buttons */}
            <View style={styles.quickAdjustContainer}>
              <Text style={styles.quickAdjustLabel}>Quick Adjust:</Text>
              <View style={styles.quickAdjustButtons}>
                {[1, 5, 10, 25].map((amount) => (
                  <TouchableOpacity
                    key={amount}
                    style={styles.quickAdjustButton}
                    onPress={() => handleQuickAdjust(
                      adjustmentType === 'add' ? amount : -amount
                    )}
                  >
                    <Text style={styles.quickAdjustText}>
                      {adjustmentType === 'add' ? '+' : '-'}{amount}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Reason Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Reason *</Text>
            <Controller
              control={control}
              name="reason"
              render={({ field: { value } }) => (
                <View>
                  <TouchableOpacity
                    style={[styles.input, styles.dropdownTrigger, errors.reason && styles.inputError]}
                    onPress={() => setShowReasonDropdown(!showReasonDropdown)}
                  >
                    <Text style={value ? styles.dropdownText : styles.placeholderText}>
                      {value || 'Select reason'}
                    </Text>
                    <Ionicons 
                      name={showReasonDropdown ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                  
                  {showReasonDropdown && (
                    <View style={styles.dropdown}>
                      <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                        {ADJUSTMENT_REASONS.map((reason) => (
                          <TouchableOpacity
                            key={reason}
                            style={styles.dropdownItem}
                            onPress={() => selectReason(reason)}
                          >
                            <Text style={styles.dropdownItemText}>{reason}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}
            />
            {errors.reason && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{errors.reason.message}</Text>
              </View>
            )}
          </View>

          {/* Preview Card */}
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Adjustment Preview</Text>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Current:</Text>
              <Text style={styles.previewValue}>{currentQuantity} {item.unit}</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Adjustment:</Text>
              <Text style={[
                styles.previewValue,
                adjustmentValue > 0 ? styles.positive : styles.negative
              ]}>
                {adjustmentValue > 0 ? '+' : ''}{adjustmentValue} {item.unit}
              </Text>
            </View>
            <View style={[styles.previewRow, styles.previewTotal]}>
              <Text style={styles.previewLabel}>New Quantity:</Text>
              <Text style={[
                styles.previewValue,
                styles.previewTotalValue,
                newQuantity < 0 && styles.negative
              ]}>
                {newQuantity} {item.unit}
              </Text>
            </View>
            
            {newQuantity <= item.minStock && newQuantity >= 0 && (
              <View style={styles.lowStockWarning}>
                <Ionicons name="warning" size={16} color="#FF9500" />
                <Text style={styles.lowStockText}>
                  This will bring the item to or below minimum stock level
                </Text>
              </View>
            )}
            
            {newQuantity < 0 && (
              <View style={styles.negativeWarning}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.negativeWarningText}>
                  Resulting quantity cannot be negative
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={adjustMutation.isPending}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.submitButton,
              (adjustmentValue === 0 || newQuantity < 0 || adjustMutation.isPending) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={adjustmentValue === 0 || newQuantity < 0 || adjustMutation.isPending}
          >
            {adjustMutation.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="checkmark-circle-outline" size={20} color="white" />
            )}
            <Text style={styles.submitButtonText}>
              {adjustMutation.isPending ? 'Adjusting...' : 'Confirm Adjustment'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Overlay for dropdown */}
      {showReasonDropdown && (
        <TouchableOpacity
          style={styles.dropdownOverlay}
          onPress={() => setShowReasonDropdown(false)}
        />
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  quantityCard: {
    backgroundColor: 'white',
    padding: 20,
    margin: 16,
    marginTop: 8,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quantityLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  quantityValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  form: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 8,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    backgroundColor: '#f8f8f8',
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 6,
  },
  toggleLeft: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  toggleRight: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  toggleActive: {
    backgroundColor: '#007AFF',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: 'white',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e1e1e1',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: 'white',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  unitLabel: {
    position: 'absolute',
    right: 16,
    top: 16,
    fontSize: 16,
    color: '#666',
  },
  quickAdjustContainer: {
    marginTop: 12,
  },
  quickAdjustLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  quickAdjustButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAdjustButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  quickAdjustText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  dropdownTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    fontSize: 16,
    color: '#999',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e1e1e1',
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dropdownScroll: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
  previewCard: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewTotal: {
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
    paddingTop: 8,
    marginTop: 4,
  },
  previewLabel: {
    fontSize: 14,
    color: '#666',
  },
  previewValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  previewTotalValue: {
    fontSize: 16,
    color: '#007AFF',
  },
  positive: {
    color: '#34C759',
  },
  negative: {
    color: '#FF3B30',
  },
  lowStockWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    gap: 6,
  },
  lowStockText: {
    color: '#856404',
    fontSize: 12,
    flex: 1,
  },
  negativeWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8D7DA',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
    gap: 6,
  },
  negativeWarningText: {
    color: '#721C24',
    fontSize: 12,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  cancelButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e1e1e1',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#007AFF',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  dropdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    zIndex: 999,
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