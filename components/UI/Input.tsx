import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  inputAnatomy.keys,
);

// const xl = defineStyle({
//   px: '4',
//   h: '12',
// });

const sizes = {
  // xl: definePartsStyle({ field: xl, addon: xl }),
};

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
    _invalid: {
      color: 'red',
      fontWeight: 600,
      _placeholder: {
        color: 'red',
      },
    },
    _placeholder: {
      color: 'placeholder',
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

const Input = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants: { defaultVariant },
  defaultProps: {
    variant: 'defaultVariant',
  },
});

export default Input;
