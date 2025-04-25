import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Utility functions for managing the status bar in Capacitor apps
 */
export const statusBarUtils = {
  /**
   * Initialize the status bar with proper settings
   */
  initialize: async () => {
    try {
      if (Capacitor.isPluginAvailable('StatusBar') && Capacitor.isNativePlatform()) {
        // Set status bar to show with dark text (for light backgrounds)
        await StatusBar.setStyle({ style: Style.Dark });

        // Make status bar transparent and content overlays it
        await StatusBar.setOverlaysWebView({ overlay: true });

        const info = await StatusBar.getInfo();
        console.log('StatusBar initialized:', info);
      }
    } catch (error) {
      console.error('Error initializing StatusBar:', error);
    }
  },

  /**
   * Hide the status bar
   */
  hide: async () => {
    try {
      if (Capacitor.isPluginAvailable('StatusBar') && Capacitor.isNativePlatform()) {
        await StatusBar.hide();
      }
    } catch (error) {
      console.error('Error hiding StatusBar:', error);
    }
  },

  /**
   * Show the status bar
   */
  show: async () => {
    try {
      if (Capacitor.isPluginAvailable('StatusBar') && Capacitor.isNativePlatform()) {
        await StatusBar.show();
      }
    } catch (error) {
      console.error('Error showing StatusBar:', error);
    }
  },
};
