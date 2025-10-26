import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Basic validation
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Start the sign-up process using the email and password provided
      await signUp.create({
        emailAddress,
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Send email verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // Set pending verification state
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Error', err.errors?.[0]?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification of email address
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      // Use the code the user provided to attempt verification
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        // Set the user as active in your application
        await setActive({ session: completeSignUp.createdSessionId });
        // Redirect to the main app
        router.replace('/(tabs)');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('Error', err.errors?.[0]?.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSignIn = () => {
    router.push('/(auth)/sign-in');
  };

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Ionicons name="mail-outline" size={64} color="#007AFF" />
            <Text style={styles.title}>Verify Your Email</Text>
            <Text style={styles.subtitle}>
              We've sent a verification code to{'\n'}
              <Text style={styles.emailText}>{emailAddress}</Text>
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Verification Code</Text>
              <TextInput
                style={styles.input}
                value={code}
                onChangeText={setCode}
                placeholder="Enter 6-digit code"
                placeholderTextColor="#999"
                keyboardType="number-pad"
                autoCapitalize="none"
                autoComplete="one-time-code"
              />
            </View>

            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]}
              onPress={onVerifyPress}
              disabled={isLoading || code.length < 6}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Ionicons name="checkmark-circle-outline" size={20} color="white" />
              )}
              <Text style={styles.buttonText}>
                {isLoading ? 'Verifying...' : 'Verify Email'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.secondaryButton]}
              onPress={() => setPendingVerification(false)}
              disabled={isLoading}
            >
              <Text style={styles.secondaryButtonText}>Back to Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons name="pizza-outline" size={64} color="#007AFF" />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join Pizza Pantry to manage your inventory</Text>
        </View>

        <View style={styles.form}>
          {/* Name Fields */}
          <View style={styles.row}>
            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="John"
                placeholderTextColor="#999"
                autoCapitalize="words"
                autoComplete="name-given"
              />
            </View>

            <View style={[styles.field, styles.halfField]}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Doe"
                placeholderTextColor="#999"
                autoCapitalize="words"
                autoComplete="name-family"
              />
            </View>
          </View>

          {/* Email Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={emailAddress}
              onChangeText={setEmailAddress}
              placeholder="john.doe@example.com"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>

          {/* Password Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="At least 8 characters"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoComplete="new-password"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons 
                  name={showPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password Field */}
          <View style={styles.field}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoComplete="new-password"
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons 
                  name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Password Requirements */}
          <View style={styles.requirements}>
            <Text style={styles.requirementsTitle}>Password must contain:</Text>
            <View style={styles.requirementItem}>
              <Ionicons 
                name={password.length >= 8 ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={password.length >= 8 ? '#34C759' : '#666'} 
              />
              <Text style={[
                styles.requirementText,
                password.length >= 8 && styles.requirementMet
              ]}>
                At least 8 characters
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Ionicons 
                name={password === confirmPassword && password.length > 0 ? "checkmark-circle" : "ellipse-outline"} 
                size={16} 
                color={password === confirmPassword && password.length > 0 ? '#34C759' : '#666'} 
              />
              <Text style={[
                styles.requirementText,
                password === confirmPassword && password.length > 0 && styles.requirementMet
              ]}>
                Passwords match
              </Text>
            </View>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.primaryButton,
              (!emailAddress || !password || !confirmPassword || !firstName) && styles.buttonDisabled
            ]}
            onPress={onSignUpPress}
            disabled={isLoading || !emailAddress || !password || !confirmPassword || !firstName}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="person-add-outline" size={20} color="white" />
            )}
            <Text style={styles.buttonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Sign In Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToSignIn}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },
  emailText: {
    fontWeight: '600',
    color: '#007AFF',
  },
  form: {
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  field: {
    marginBottom: 20,
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
    borderColor: '#e1e5e9',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#fafbfc',
    color: '#1a1a1a',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  requirements: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  requirementMet: {
    color: '#34C759',
    fontWeight: '500',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#e1e5e9',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e1e5e9',
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  footerText: {
    fontSize: 16,
    color: '#666',
  },
  footerLink: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});