import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 'low' | 'medium' | 'high';
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

interface CardContentProps {
  children: React.ReactNode;
  padded?: boolean;
}

interface CardFooterProps {
  children: React.ReactNode;
}

interface CardActionProps extends TouchableOpacityProps {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: 'default' | 'destructive';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  style, 
  elevation = 'medium' 
}) => {
  const getElevationStyle = () => {
    switch (elevation) {
      case 'low':
        return styles.elevationLow;
      case 'high':
        return styles.elevationHigh;
      default:
        return styles.elevationMedium;
    }
  };

  return (
    <View style={[styles.card, getElevationStyle(), style]}>
      {children}
    </View>
  );
};

export const CardHeader: React.FC<CardHeaderProps> = ({ 
  title, 
  subtitle, 
  action 
}) => {
  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      {action && <View>{action}</View>}
    </View>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ 
  children, 
  padded = true 
}) => {
  return (
    <View style={[styles.content, padded && styles.contentPadded]}>
      {children}
    </View>
  );
};

export const CardFooter: React.FC<CardFooterProps> = ({ children }) => {
  return (
    <View style={styles.footer}>
      {children}
    </View>
  );
};

export const CardAction: React.FC<CardActionProps> = ({
  title,
  icon,
  variant = 'default',
  ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.action,
        variant === 'destructive' && styles.actionDestructive,
      ]}
      {...props}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={18}
          color={variant === 'destructive' ? '#FF3B30' : '#007AFF'}
          style={styles.actionIcon}
        />
      )}
      <Text
        style={[
          styles.actionText,
          variant === 'destructive' && styles.actionTextDestructive,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginVertical: 4,
  },
  elevationLow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  elevationMedium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  elevationHigh: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    paddingBottom: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  content: {
    width: '100%',
  },
  contentPadded: {
    padding: 16,
    paddingVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 16,
    paddingTop: 12,
    gap: 12,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  actionDestructive: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  actionIcon: {
    marginRight: 6,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  actionTextDestructive: {
    color: '#FF3B30',
  },
});