import { Montserrat } from 'next/font/google';

// Import the weights and subsets, add any other config here as well
const montserrat = Montserrat({
  weight: ['500'],
  subsets: ['latin'],
});

export const theme = {
  colors: {
    blue: '#0000FF',
    b: '#0000FF',
    rb: '#002366',
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
};
