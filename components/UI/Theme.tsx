import { extendTheme } from '@chakra-ui/react';
import { Montserrat } from 'next/font/google';
import Button from './Button';
import Card from './Card';
import Input from './Input';
import Menu from './Menu';
import Select from './Select';

// Import the weights and subsets, add any other config here as well
const montserrat = Montserrat({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

const theme = {
  colors: {
    blue: '#0000FF',
    coral: 'lightcoral',
  },
  fonts: {
    heading: montserrat.style.fontFamily,
    body: montserrat.style.fontFamily,
  },
  fontWeights: {
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  shadows: {
    normal: `rgba(99, 99, 99, 0.2) 0px 2px 8px 0px`,
    hover: `rgba(100, 100, 111, 0.2) 0px 7px 29px 0px`,
    focus: `rgba(0, 0, 0, 0.35) 0px 5px 15px`,
    under: `rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px`,
  },
  // Header size: 40px, with margin top/bottom 20px each
  space: {
    header: '20px',
    side: '30px',
  },

  size: {
    header: '40px',
  },

  // Modifying default components
  components: {
    Button,
    Input,
    Select,
    Card,
    Menu,
  },
  // Color mode (light/dark)
  config: {
    cssVarPrefix: 'pricey',
  },
};

export default extendTheme(theme);
