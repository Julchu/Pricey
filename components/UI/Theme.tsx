export const theme = (mode: boolean): {} => {
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
      tablet: '@media (min-width: 600px)',
      laptop: '@media (min-width: 905px)',
      largeLaptop: '@media (min-width: 1240px)',
      desktop: '@media (min-width: 1440px)',
      largeDesktop: '@media (min-width: 1728px)',
      ultraWideDesktop: '@media (min-width: 2560px)',
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

export type ThemeType = typeof theme;
