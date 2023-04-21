import { cardAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  cardAnatomy.keys,
);

const sizes = {};

const baseStyle = definePartsStyle({
  container: {
    ml: { base: '30px', sm: 'unset' },
    letterSpacing: '2px',
    scrollSnapAlign: 'center',
    borderRadius: '5px',
    w: { base: 'calc(100vw - 60px)', sm: '250px' },
    transition: { sm: 'box-shadow 0.2s ease-in-out' },
    boxShadow: 'normal',
    _hover: { boxShadow: 'hover' },
    _focus: { boxShadow: 'focus' },
  },
  header: { height: '180px', position: 'relative' },
  body: { padding: '15px 30px', cursor: 'pointer', textAlign: 'center' },
  footer: {},
});

const defaultVariant = definePartsStyle({
  container: {},
});

const Card = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants: { defaultVariant },
  defaultProps: {
    variant: 'defaultVariant',
  },
});

export default Card;
