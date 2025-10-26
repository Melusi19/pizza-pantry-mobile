import React, { useState, useEffect } from 'react';
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
import { inventoryItemSchema, InventoryItemFormData } from '../lib/validation';
import { useInventoryItem, useUpdateItem } from '../hooks/useInventory';

const CATEGORIES = [
  'Dough & Flour',
  'Sauces',
  'Cheeses',
  'Meats',
  'Vegetables',
  'Toppings',
  'Spices & Herbs',
  'Packaging',
  'Beverages',
  'Other'
];

const UNITS = [
  'units',
  'kg',
  'g',
  'lbs',
  'oz',
  'liters',
  'ml',
  'pack',
  'box',
  'case'
];

export default function EditItemScreen() {
  const { itemId } = useLocalSearchParams();
  const router = useRouter();
  const { data: item, isLoading, error } = useInventoryItem(itemId as string);
  const updateMutation = useUpdateItem();
  
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const { control, handleSubmit, formState: { errors, isDirty }, setValue, reset } = useForm<InventoryItemFormData>({
    resolver: zodResolver(inventoryItemSchema),
    mode: 'onChange',
  });

  // Populate form when item data loads
  useEffect(() => {
    if (item) {
      reset({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        minStock: item.minStock,
        unit: item.unit,
        price: item.price,
        supplier: item.supplier,
      });
    }
  }, [item, reset]);

  const onSubmit = (data: InventoryItemFormData) => {
    updateMutation.mutate(
      { itemId: itemId as string, data },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Item updated successfully!', [
            { text: 'OK', onPress: () => router.back() }
          ]);
        },
        onError: (error) => {
          Alert.alert('Error', error.message || 'Failed to update item');
        },
      }
    );
  };

  const handleCancel = () => {
    if (isDirty) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const selectCategory = (category: string) => {
    setValue('category', category, { shouldValidate: true });
    setShowCategoryDropdown(false);
  };

  const selectUnit = (unit: string) => {
    setValue('unit', unit, { shouldValidate: true });
    setShowUnitDropdown(false);
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
          <Text style={styles.title}>Edit Item</Text>
          <Text style={styles.subtitle}>Update the item details below</Text>
        </View>

        <View style={styles.form}>
          {/* Name Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Item Name *</Text>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter item name"
                  placeholderTextColor="#999"
                />
              )}
            />
            {errors.name && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{errors.name.message}</Text>
              </View>
            )}
          </View>

          {/* Category Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Category *</Text>
            <Controller
              control={control}
              name="category"
              render={({ field: { value } }) => (
                <View>
                  <TouchableOpacity
                    style={[styles.input, styles.dropdownTrigger, errors.category && styles.inputError]}
                    onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  >
                    <Text style={value ? styles.dropdownText : styles.placeholderText}>
                      {value || 'Select category'}
                    </Text>
                    <Ionicons 
                      name={showCategoryDropdown ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                  
                  {showCategoryDropdown && (
                    <View style={styles.dropdown}>
                      <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                        {CATEGORIES.map((category) => (
                          <TouchableOpacity
                            key={category}
                            style={styles.dropdownItem}
                            onPress={() => selectCategory(category)}
                          >
                            <Text style={styles.dropdownItemText}>{category}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}
            />
            {errors.category && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{errors.category.message}</Text>
              </View>
            )}
          </View>

          {/* Quantity and Min Stock Row */}
          <View style={styles.row}>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>Current Quantity *</Text>
              <Controller
                control={control}
                name="quantity"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={[styles.input, errors.quantity && styles.inputError]}
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(text ? Number(text) : 0)}
                    onBlur={onBlur}
                    placeholder="0"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.quantity && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                  <Text style={styles.errorText}>{errors.quantity.message}</Text>
                </View>
              )}
            </View>

            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>Min Stock *</Text>
              <Controller
                control={control}
                name="minStock"
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={[styles.input, errors.minStock && styles.inputError]}
                    value={value?.toString() || ''}
                    onChangeText={(text) => onChange(text ? Number(text) : 0)}
                    onBlur={onBlur}
                    placeholder="0"
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                  />
                )}
              />
              {errors.minStock && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                  <Text style={styles.errorText}>{errors.minStock.message}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Unit Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Unit *</Text>
            <Controller
              control={control}
              name="unit"
              render={({ field: { value } }) => (
                <View>
                  <TouchableOpacity
                    style={[styles.input, styles.dropdownTrigger, errors.unit && styles.inputError]}
                    onPress={() => setShowUnitDropdown(!showUnitDropdown)}
                  >
                    <Text style={value ? styles.dropdownText : styles.placeholderText}>
                      {value || 'Select unit'}
                    </Text>
                    <Ionicons 
                      name={showUnitDropdown ? "chevron-up" : "chevron-down"} 
                      size={20} 
                      color="#666" 
                    />
                  </TouchableOpacity>
                  
                  {showUnitDropdown && (
                    <View style={styles.dropdown}>
                      <ScrollView style={styles.dropdownScroll} nestedScrollEnabled>
                        {UNITS.map((unit) => (
                          <TouchableOpacity
                            key={unit}
                            style={styles.dropdownItem}
                            onPress={() => selectUnit(unit)}
                          >
                            <Text style={styles.dropdownItemText}>{unit}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              )}
            />
            {errors.unit && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{errors.unit.message}</Text>
              </View>
            )}
          </View>

          {/* Price Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Price ($) *</Text>
            <Controller
              control={control}
              name="price"
              render={({ field: { onChange, value, onBlur } }) => (
                <View>
                  <TextInput
                    style={[styles.input, errors.price && styles.inputError]}
                    value={value?.toString() || ''}
                    onChangeText={(text) => {
                      const num = text ? parseFloat(text) : 0;
                      onChange(isNaN(num) ? 0 : num);
                    }}
                    onBlur={onBlur}
                    placeholder="0.00"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                  />
                  <Text style={styles.currencySymbol}>$</Text>
                </View>
              )}
            />
            {errors.price && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{errors.price.message}</Text>
              </View>
            )}
          </View>

          {/* Supplier Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Supplier *</Text>
            <Controller
              control={control}
              name="supplier"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={[styles.input, errors.supplier && styles.inputError]}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  placeholder="Enter supplier name"
                  placeholderTextColor="#999"
                />
              )}
            />
            {errors.supplier && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
                <Text style={styles.errorText}>{errors.supplier.message}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.button, styles.cancelButton]}
            onPress={handleCancel}
            disabled={updateMutation.isPending}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.submitButton,
              (!isDirty || updateMutation.isPending) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={updateMutation.isPending || !isDirty}
          >
            {updateMutation.isPending ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="save-outline" size={20} color="white" />
            )}
            <Text style={styles.submitButtonText}>
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Overlay for dropdowns */}
      {(showCategoryDropdown || showUnitDropdown) && (
        <TouchableOpacity
          style={styles.dropdownOverlay}
          onPress={() => {
            setShowCategoryDropdown(false);
            setShowUnitDropdown(false);
          }}
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
  form: {
    padding: 20,
    backgroundColor: 'white',
    marginTop: 8,
  },
  field: {
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
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
  currencySymbol: {
    position: 'absolute',
    right: 16,
    top: 16,
    fontSize: 16,
    color: '#666',
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