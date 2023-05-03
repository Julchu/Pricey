import { accordionAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  accordionAnatomy.keys,
);

const sizes = {};

const baseStyle = definePartsStyle({
  root: {
    gridAutoFlow: { base: 'column', sm: 'row' },
    overflowX: { base: 'scroll', sm: 'visible' },
    overflowY: { base: 'hidden', sm: 'visible' },
    scrollSnapType: { base: 'x mandatory', sm: 'none' },
    gridTemplateColumns: {
      base: 'repeat(auto-fill, minmax(100%, 1fr))',
      sm: 'none',
    },
  },
  container: {},
  button: {
    _hover: { bg: 'coral' },
  },
  panel: {},
  icon: {},
});

const mobileCard = definePartsStyle({
  root: {},
  container: {
    ml: '30px',
    letterSpacing: '2px',
    scrollSnapAlign: 'center',
    borderRadius: '5px',
    w: 'calc(100vw - 60px)',
    boxShadow: 'normal',
    _hover: { boxShadow: 'hover' },
    _focus: { boxShadow: 'focus' },
    border: 'none',
  },
});

const defaultVariant = definePartsStyle({
  container: {
    // flexGrow: { base: 1, sm: 'unset' },
    // padding: { base: '30px 0px', sm: '0px 30px' },
    // gridAutoFlow: { base: 'column', sm: 'row' },
    // overflowX: { base: 'scroll', sm: 'visible' },
    // overflowY: { base: 'hidden', sm: 'visible' },
    // scrollSnapType: { base: 'x mandatory', sm: 'none' },
    // gridTemplateColumns: {
    //   base: 'repeat(auto-fill, minmax(100%, 1fr))',
    //   sm: 'none',
    // },
  },
});

const Accordion = defineMultiStyleConfig({
  baseStyle,
  sizes,
  variants: { defaultVariant, mobileCard },
  defaultProps: {
    variant: 'defaultVariant',
  },
});

export default Accordion;
