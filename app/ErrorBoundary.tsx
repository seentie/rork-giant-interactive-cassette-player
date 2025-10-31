import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AlertCircle, RefreshCcw } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    console.error('[Error Boundary] Error caught:', error);
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Error Boundary] Component error:', {
      error: error.toString(),
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = async () => {
    if (Platform.OS !== 'web') {
      try {
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (e) {
        console.log('[Error Boundary] Haptics failed:', e);
      }
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <LinearGradient
          colors={['#2C1810', '#4A2C1A', '#2C1810']}
          style={styles.container}
        >
          <View style={styles.content}>
            <AlertCircle size={64} color="#FF6B6B" style={styles.icon} />
            
            <Text style={styles.title}>Oops! Something Went Wrong</Text>
            
            <Text style={styles.message}>
              The app encountered an unexpected error. Don&apos;t worry, your data is safe!
            </Text>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={this.handleReset}
              activeOpacity={0.8}
            >
              <RefreshCcw size={20} color="#fff" />
              <Text style={styles.resetButtonText}>Try Again</Text>
            </TouchableOpacity>

            {__DEV__ && this.state.error && (
              <ScrollView style={styles.debugContainer} showsVerticalScrollIndicator={true}>
                <Text style={styles.debugTitle}>Debug Information:</Text>
                <Text style={styles.debugText}>{this.state.error.toString()}</Text>
                {this.state.error.stack && (
                  <>
                    <Text style={styles.debugTitle}>Stack Trace:</Text>
                    <Text style={styles.debugText}>{this.state.error.stack}</Text>
                  </>
                )}
              </ScrollView>
            )}
          </View>
        </LinearGradient>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  icon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: '#F5E6D3',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#E8E8E8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
    color: '#fff',
  },
  debugContainer: {
    marginTop: 32,
    maxHeight: 200,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
    padding: 16,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold' as const,
    color: '#FF6B6B',
    marginTop: 8,
    marginBottom: 4,
  },
  debugText: {
    fontSize: 12,
    color: '#E8E8E8',
    fontFamily: Platform.select({
      ios: 'Courier',
      android: 'monospace',
      default: 'monospace',
    }),
  },
});
