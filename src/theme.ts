// src/theme.ts
import { extendTheme } from '@chakra-ui/react';
import type { ThemeConfig } from '@chakra-ui/theme';

const config: ThemeConfig = {
  initialColorMode: 'system', // important
  useSystemColorMode: true,   // enable auto detection
};

const theme = extendTheme({
  config,
  breakpoints: {
    base: '0em',
    sm: '36em',
    md: '48em',
    lg: '62em',
    xl: '75em',
    '2xl': '87.5em',
  },
  fonts: {
    heading: `'Poppins', sans-serif`,
    body: `'Poppins', sans-serif`,
  },
  fontWeights: {
    thin: 100,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  colors: {
    brand: {
      50: '#e3f2f9',
      100: '#cfe0f4',
      200: '#a7c6eb',
      300: '#7fa9e1',
      400: '#578cd8',
      500: '#3182ce',
      600: '#2766a9',
      700: '#1d4b84',
      800: '#12305f',
      900: '#1a365d',
    },
    card: {
      light: "white",
      dark: "gray.700",
    },
    background: {
      light: "gray.50",
      dark: "gray.900",
    },
    accent: {
      light: "green.600",
      dark: "green.400",
    },
    text: {
      light: "gray.900",
      dark: "gray.100",
    },
  },
  semanticTokens: {
    colors: {
      cardBg: {
        default: "white",
        _dark: "gray.700",
      },
      solutionsBg:{
        default: "#D8F4FF",
        _dark: "gray.900",
      },
      bg:{
        default: "gray.50",
        _dark: "gray.900",
      },
      deviceCardBg:{
        default: "white",
        _dark: "gray.800",
      },
      hoverBg:{
        default: "green.200",
        _dark: "green.600",
      },
      activeBg:{
        default: "green.100",
        _dark: "green.700",
      },
      solutionsTextColor:{
        default: "#00B9FF",
        _dark: "green.500",
      },
      solutionsSubTextColor:{
        default: "#000000", 
        _dark: "whiteAlpha.900",
      },
      textColor: {
        default: "gray.900",
        _dark: "whiteAlpha.900",
      },
      textMain: {
        default: "gray.800",
        _dark: "whiteAlpha.900",
      },
      textPrimary:{
        default: "gray.700",
        _dark: "gray.200",
      },
      alertText:{
        default: "#00B9FF",
        _dark: "#000000",
      },
      cardBorder:{
        default: "gray.200",
        _dark: "gray.600",
      },
  
      headingColor: {
        default: "gray.900",
        _dark: "gray.300",
      },
      accentColor: {
        default: "accent.light",
        _dark: "accent.dark",
      },
      backgroundColor: {
        default: "gray.100",
        _dark: "gray.600",
      },
      bgColor:{
        default: "green.900",
        _dark: "gray.700",
      },
      bgGradient:{
        default: "linear(to-br, green.50, blue.50)",
        _dark: "linear(to-br, gray.800, gray.900)",
      },
      inputTextColor: {
        default: "gray.800",
        _dark: "whiteAlpha.900",
      },
      placeholderColor: {
        default: "gray.700",
        _dark: "gray.400",
      },
      subTextColor: {
        default: "green.600",
        _dark: "green.200",
      },
      textLabel: {
        default: "gray.500",
        _dark: "gray.400",
      },
      inputBorderstep:{
        default: "gray.300",
        _dark: "whiteAlpha.900",
      },
      inputFocusBorderColor:{
        default: "green.500",
        _dark: "white",
      },
      borderColor:{
        default: "gray.200",
        _dark: "gray.800",
      },
      manualBorderColor:{
        default: "gray.200",
        _dark: "gray.600"
      },
      bgInput:{
        default: "white",
        _dark: "gray.700",
      },
      stepBorderColor:{
        default: "gray.300",
        _dark: "gray.600",
      },
      cardShadow: {
        default: "md",
        _dark: "dark-lg",
      },
      iconColor:{
        default: "gray.600",
        _dark: "gray.400",
      },
      mutedText:{
        default: "gray.600",
        _dark: "gray.300",
      },
      filledColor:{
        default: "green.400",
        _dark: "green.300",
      },
      bgTrack:{
        default: "gray.200",
        _dark: "gray.600",
      },
      inputBg:{
        default: "gray.200",
        _dark: "gray.600",
      },
      greenText:{
        default: "green.700",
        _dark: "green.300",
      },
      premiumText:{
        default: "gray.600",
        _dark: "gray.300",
      },
      freeCardBg:{
        default: "green.50",
        _dark: "green.900",
      },
      freeBorder:{
        default: "green.500",
        _dark: "green.300",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
        _hover: { opacity: 0.9 },
      },
      variants: {
        primary: {
          bg: 'brand.500',
          color: 'white',
          _hover: {
            bg: 'brand.600',
          },
        },
        secondary: {
          bg: 'gray.200',
          color: 'black',
          _hover: {
            bg: 'gray.300',
          },
        },
      },
      defaultProps: {
        variant: 'primary',
      },
    },
  },
  styles: {
    global: {
      'html, body': {
        overflowX: 'hidden', // ✅ Disable horizontal scroll globally
      },
      '#root': {
        overflowX: 'hidden', // ✅ Ensure root doesn't scroll horizontally
      },
    },
  },
});

export default theme;
