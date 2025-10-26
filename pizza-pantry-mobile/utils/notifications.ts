import { Alert, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { InventoryItem } from '../types';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Request permissions
  async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  }

  // Schedule a local notification
  async scheduleLocalNotification(
    title: string,
    body: string,
    data: any = {},
    trigger: Notifications.NotificationTriggerInput = null
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger,
      });

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      throw error;
    }
  }

  // Cancel a scheduled notification
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  // Inventory-specific notifications
  async notifyLowStock(items: InventoryItem[]): Promise<void> {
    if (items.length === 0) return;

    const title = items.length === 1 
      ? 'Low Stock Alert'
      : `${items.length} Items Low in Stock`;

    const body = items.length === 1
      ? `${items[0].name} is running low (${items[0].quantity} ${items[0].unit} left)`
      : `${items.length} items are below minimum stock levels`;

    await this.scheduleLocalNotification(title, body, {
      type: 'low_stock',
      itemIds: items.map(item => item.id),
    });
  }

  async notifyOutOfStock(items: InventoryItem[]): Promise<void> {
    if (items.length === 0) return;

    const title = items.length === 1
      ? 'Out of Stock'
      : `${items.length} Items Out of Stock`;

    const body = items.length === 1
      ? `${items[0].name} is out of stock`
      : `${items.length} items are completely out of stock`;

    await this.scheduleLocalNotification(title, body, {
      type: 'out_of_stock',
      itemIds: items.map(item => item.id),
    });
  }

  async notifyQuantityAdjusted(item: InventoryItem, adjustment: number): Promise<void> {
    const action = adjustment > 0 ? 'increased' : 'decreased';
    const title = 'Quantity Updated';
    const body = `${item.name} quantity ${action} by ${Math.abs(adjustment)} ${item.unit}. New total: ${item.quantity} ${item.unit}`;

    await this.scheduleLocalNotification(title, body, {
      type: 'quantity_adjusted',
      itemId: item.id,
      adjustment,
    });
  }

  // Daily summary notification
  async scheduleDailySummary(hour: number = 9): Promise<void> {
    try {
      await this.cancelAllNotifications(); // Clear existing

      const trigger: Notifications.DailyTriggerInput = {
        type: 'daily',
        hour,
        minute: 0,
      };

      await this.scheduleLocalNotification(
        'Daily Inventory Summary',
        'Check your inventory status for today',
        { type: 'daily_summary' },
        trigger
      );
    } catch (error) {
      console.error('Failed to schedule daily summary:', error);
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();

// Simple alert-based notifications (fallback)
export const showAlert = (title: string, message: string) => {
  Alert.alert(title, message);
};

export const showConfirmation = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void
) => {
  Alert.alert(title, message, [
    {
      text: 'Cancel',
      style: 'cancel',
      onPress: onCancel,
    },
    {
      text: 'Confirm',
      style: 'destructive',
      onPress: onConfirm,
    },
  ]);
};

export const showError = (message: string) => {
  showAlert('Error', message);
};

export const showSuccess = (message: string) => {
  showAlert('Success', message);
};

export const showWarning = (message: string) => {
  showAlert('Warning', message);
};