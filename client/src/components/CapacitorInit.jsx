import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { Keyboard } from '@capacitor/keyboard';
import { initializeCapacitorAuth } from '~/utils/capacitorAuth';
import { statusBarUtils } from '~/utils/statusBarUtils';

/**
 * Component that initializes Capacitor functionality on app start
 * that doesn't require authentication
 */
const CapacitorInit = () => {
  useEffect(() => {
    const init = async () => {
      try {
        // Initialize Capacito
        // r authentication
        await initializeCapacitorAuth();

        // Initialize and configure StatusBar properly
        if (Capacitor.isNativePlatform()) {
          await statusBarUtils.initialize();

          // Apply viewport height fix for mobile devices
          setupViewportHeight();
        }
      } catch (error) {
        console.error('Error initializing Capacitor:', error);
      }
    };

    init();

    // Set up resize listener for viewport height adjustments
    window.addEventListener('resize', setupViewportHeight);

    // Set up keyboard event listeners for native platforms
    if (Capacitor.isNativePlatform()) {
      setupKeyboardListeners();
    }

    return () => {
      window.removeEventListener('resize', setupViewportHeight);
    };
  }, []);

  /**
   * Sets up keyboard event listeners to adjust the layout when keyboard appears
   */
  const setupKeyboardListeners = async () => {
    try {
      // Add keyboard show/hide event listeners
      await Keyboard.addListener('keyboardDidShow', (info) => {
        // Set keyboard height in CSS variable
        const keyboardHeight = info.keyboardHeight || 0;
        document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
        document.body.classList.add('keyboard-visible');

        // Find the currently focused input
        const focusedElement = document.activeElement;
        if (
          focusedElement &&
          (focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'TEXTAREA')
        ) {
          // Scroll to keep the input in view
          setTimeout(() => {
            focusedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 100);
        }
      });

      // Also listen for keyboardWillShow for iOS
      await Keyboard.addListener('keyboardWillShow', (info) => {
        // Pre-emptively set keyboard height for smoother transitions
        const keyboardHeight = info.keyboardHeight || 0;
        document.documentElement.style.setProperty('--keyboard-height', `${keyboardHeight}px`);
      });

      await Keyboard.addListener('keyboardDidHide', () => {
        document.documentElement.style.setProperty('--keyboard-height', '0px');
        document.body.classList.remove('keyboard-visible');
      });

      // Set keyboard to resize the WebView when shown to prevent UI components from being hidden
      await Keyboard.setResizeMode({ mode: 'native' });

      // Set keyboard style (optional - can be set to 'dark' if your app has a dark theme)
      await Keyboard.setStyle({ style: 'light' });

      console.log('Keyboard listeners initialized');
    } catch (error) {
      console.error('Error setting up keyboard listeners:', error);
    }
  };

  /**
   * Sets up the viewport height for mobile devices
   * This fixes issues with the viewport height on mobile browsers,
   * especially iOS where 100vh doesn't account for the address bar
   */
  const setupViewportHeight = () => {
    // First we get the viewport height and multiply it by 1% to get a value for a vh unit
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);
    document.documentElement.style.setProperty('--vh', `${vh}px`);

    // Add capacitor height adjustment class to body when in native app
    if (Capacitor.isNativePlatform()) {
      document.body.classList.add('capacitor-height-adjust');

      // Add content container class to the root element
      const rootElement = document.getElementById('root');
      if (rootElement && !rootElement.classList.contains('content-container')) {
        rootElement.classList.add('content-container');
      }
    }
  };

  // This component doesn't render anything
  return null;
};

export default CapacitorInit;
