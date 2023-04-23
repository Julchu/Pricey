import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  menuAnatomy.keys,
);

// const xl = defineStyle({
//   px: '4',
//   h: '12',
// });

const sizes = {
  // xl: definePartsStyle({ field: xl, addon: xl }),
};

const baseStyle = definePartsStyle({
  button: {},
  list: {},
  item: {
    textDecor: 'none !important',
  },
  groupTitle: {},
  command: {},
  divider: {},
});

const defaultVariant = definePartsStyle({
  button: {},
});

const Menu = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants: { defaultVariant },
  defaultProps: {
    variant: 'defaultVariant',
  },
});

export default Menu;
