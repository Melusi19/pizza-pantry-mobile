import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PendingAction {
  id: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'ADJUST';
  payload: any;
  timestamp: number;
}

const PENDING_ACTIONS_KEY = 'pending_actions';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActions, setPendingActions] = useState<PendingAction[]>([]);

  // Check network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(!!state.isConnected);
    });

    return unsubscribe;
  }, []);

  // Load pending actions on mount
  useEffect(() => {
    loadPendingActions();
  }, []);

  const loadPendingActions = async () => {
    try {
      const stored = await AsyncStorage.getItem(PENDING_ACTIONS_KEY);
      if (stored) {
        setPendingActions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load pending actions:', error);
    }
  };

  const savePendingActions = async (actions: PendingAction[]) => {
    try {
      await AsyncStorage.setItem(PENDING_ACTIONS_KEY, JSON.stringify(actions));
      setPendingActions(actions);
    } catch (error) {
      console.error('Failed to save pending actions:', error);
    }
  };

  const addPendingAction = async (action: Omit<PendingAction, 'id' | 'timestamp'>) => {
    const newAction: PendingAction = {
      ...action,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };

    const updatedActions = [...pendingActions, newAction];
    await savePendingActions(updatedActions);
  };

  const removePendingAction = async (actionId: string) => {
    const updatedActions = pendingActions.filter(action => action.id !== actionId);
    await savePendingActions(updatedActions);
  };

  const clearPendingActions = async () => {
    await savePendingActions([]);
  };

  const syncPendingActions = async () => {
    if (!isOnline || pendingActions.length === 0) return;

    const actionsToProcess = [...pendingActions];
    
    for (const action of actionsToProcess) {
      try {
        // Here you would implement the actual API calls
        // For now, we'll just simulate successful sync
        console.log('Syncing action:', action);
        
        // Remove the action from pending list
        await removePendingAction(action.id);
      } catch (error) {
        console.error('Failed to sync action:', action.id, error);
        // Keep the action in pending list for retry
      }
    }

    if (actionsToProcess.length > 0) {
      Alert.alert('Sync Complete', `${actionsToProcess.length} actions synchronized`);
    }
  };

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && pendingActions.length > 0) {
      syncPendingActions();
    }
  }, [isOnline]);

  return {
    isOnline,
    pendingActions,
    addPendingAction,
    removePendingAction,
    clearPendingActions,
    syncPendingActions,
    hasPendingActions: pendingActions.length > 0,
  };
};