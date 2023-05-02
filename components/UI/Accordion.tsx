import { accordionAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  accordionAnatomy.keys,
);

const sizes = {};

const baseStyle = definePartsStyle({
  root: {},
  container: {},
  button: {
    _hover: { bg: 'coral' },
  },
  panel: {},
  icon: {},
});

const defaultVariant = definePartsStyle({
  container: {},
});

const Accordion = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants: { defaultVariant },
  defaultProps: {
    variant: 'defaultVariant',
  },
});

export default Accordion;
