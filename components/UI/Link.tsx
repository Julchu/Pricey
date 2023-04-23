import { defineStyleConfig } from '@chakra-ui/react';

const Link = defineStyleConfig({
  // The styles all button have in common
  baseStyle: {
    // letterSpacing: '2px',
    // border: 'none',
    // outline: 'none',
    // borderRadius: '5px',
    // boxShadow: 'normal',
    // transition: 'box-shadow 0.2s ease-in-out',
    // _hover: { boxShadow: 'hover' },
    // _focus: { boxShadow: 'focus' },
    border: 'none',
    _hover: 'none',
  },
  // Two sizes: sm and md
  sizes: {},
  // Two variants: outline and solid
  variants: {
    defaultVariant: {},
  },
  // The default size and variant values
  defaultProps: {
    // size: 'md',
    variant: 'defaultVariant',
  },
});

export default Link;
