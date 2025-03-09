// Colors.ts
import { Appearance } from 'react-native';

// Define the core color palette from your guidelines
export const Colors = {
  customerBlue: '#87CEEB', // Light Blue for customers
  maidGreen: '#98FB98', // Soft Green for maids
  darkGray: '#333333', // Headings & key text
  mediumGray: '#666666', // Body text
  white: '#FFFFFF', // Used for elements, not background
  goldAccent: '#FFD700', // Highlights
  black: '#000000', // Background (dark mode)
  tintColorLight: '#87CEEB', // Customer blue for light mode tint
  tintColorDark: '#FFFFFF', // White for dark mode tint
};

// Theme configuration
const Themes = {
  light: {
    text: Colors.darkGray, // #333333 for key text
    secondaryText: Colors.mediumGray, // #666666 for body text
    background: Colors.maidGreen, // #98FB98 (soft green instead of white)
    tint: Colors.tintColorLight, // #87CEEB
    customerButton: Colors.customerBlue, // #87CEEB
    customerButtonText: Colors.white, // #FFFFFF
    maidButton: Colors.white, // #FFFFFF (outline style)
    maidButtonText: Colors.maidGreen, // #98FB98
    maidButtonBorder: Colors.maidGreen, // #98FB98
    accent: Colors.goldAccent, // #FFD700
  },
  dark: {
    text: Colors.white, // #FFFFFF for key text
    secondaryText: '#CCCCCC', // Lighter gray for body text in dark mode
    background: Colors.black, // #000000
    tint: Colors.tintColorDark, // #FFFFFF
    customerButton: Colors.customerBlue, // #87CEEB (consistent across modes)
    customerButtonText: Colors.white, // #FFFFFF
    maidButton: Colors.black, // #000000 (outline style)
    maidButtonText: Colors.maidGreen, // #98FB98
    maidButtonBorder: Colors.maidGreen, // #98FB98
    accent: Colors.goldAccent, // #FFD700
  },
};

// Function to get the current theme based on the appearance
export const getTheme = () => {
  const colorScheme = Appearance.getColorScheme();
  return colorScheme === 'dark' ? Themes.dark : Themes.light;
};

export default Themes;