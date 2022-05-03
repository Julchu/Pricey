export const darkModeStyles = (mode: boolean): {} => {
  const invert = (r: number, g: number, b: number, a: number): string =>
    mode ? `${255 - r}, ${255 - g}, ${255 - b}, ${1 - a}` : `${r}, ${g}, ${b}, ${a}`;

  // If mode: dark-mode, else: normal
  return {
    backgroundColor: mode ? '#212121' : 'white',
    color: mode ? 'white' : 'black',
    fontWeight: {
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
    },
    breakpoints: {
      mobile: '@media (min-width: 320px)',
      tablet: '@media (min-width: 481px)',
      laptop: '@media (min-width: 769px)',
      desktop: '@media (min-width: 1025px)',
      television: '@media (min-width: 1201px)',
    },
    boxShadows: {
      normal: `rgba(${invert(99, 99, 99, 0.2)} ) 0px 2px 8px 0px`,
      hover: `rgba(${invert(100, 100, 111, 0.2)}) 0px 7px 29px 0px`,
      focus: `rgba(${invert(0, 0, 0, 0.35)}) 0px 5px 15px`,
      under: `rgba(${invert(0, 0, 0, 0.16)}) 0px 3px 6px, rgba(${invert(
        0,
        0,
        0,
        0.23,
      )}) 0px 3px 6px`,
    },
  };
};

const invert = (r: number, g: number, b: number, a: number, mode: boolean): string =>
  mode ? `${255 - r}, ${255 - g}, ${255 - b}, ${1 - a}` : `${r}, ${g}, ${b}, ${a}`;

const darkModeStyles2 = {
  backgroundColor: '#212121',
  color: 'white',
  fontWeight: {
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  breakpoints: {
    mobile: '@media (min-width: 320px)',
    tablet: '@media (min-width: 481px)',
    laptop: '@media (min-width: 769px)',
    desktop: '@media (min-width: 1025px)',
    television: '@media (min-width: 1201px)',
  },
  boxShadows: {
    normal: `rgba(${invert(99, 99, 99, 0.2, false)} ) 0px 2px 8px 0px`,
    hover: `rgba(${invert(100, 100, 111, 0.2, false)}) 0px 7px 29px 0px`,
    focus: `rgba(${invert(0, 0, 0, 0.35, false)}) 0px 5px 15px`,
    under: `rgba(${invert(0, 0, 0, 0.16, false)}) 0px 3px 6px, rgba(${invert(
      0,
      0,
      0,
      0.23,
      false,
    )}) 0px 3px 6px`,
  },
};

// export type ThemeType = ReturnType<typeof darkModeStyles>;
// export type ThemeType = typeof darkModeStyles2;
