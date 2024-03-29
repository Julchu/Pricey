import { selectAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  selectAnatomy.keys,
);

// const xl = defineStyle({
//   px: '4',
//   h: '12',
// });

const sizes = {
  // xl: definePartsStyle({ field: xl, addon: xl }),
};

// Same as Input
const baseStyle = definePartsStyle({
  field: {
    letterSpacing: '2px',
    border: 'none',
    outline: 'none',
    borderRadius: '5px',
    boxShadow: 'normal',
    transition: 'box-shadow 0.2s ease-in-out',
    _hover: { boxShadow: 'hover' },
    _focus: { boxShadow: 'focus' },
    fontWeight: 500,
    _invalid: {
      color: 'red',
      fontWeight: 600,
    },

    // Dark mode alternatives
    _dark: {},
  },
  element: {},
  addon: {},
});

const defaultVariant = definePartsStyle({
  field: {},
});

const Select = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants: { defaultVariant },
  defaultProps: {
    // Need a default variant otherwise it'll load random base CSS
    variant: 'defaultVariant',
  },
});

export default Select;
