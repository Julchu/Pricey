import { Card, Flex, Grid, Input, List, ListItem, useMediaQuery } from '@chakra-ui/react';
import { useCombobox } from 'downshift';
import Fuse from 'fuse.js';
import { FC, useCallback, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { GroceryListFormData, GroceryListFormIngredient } from '.';
import { useIngredientContext } from '../../hooks/useIngredientContext';
import { useGroceryListContext } from '../../hooks/useGroceryListContext';

const ListForm: FC = () => {
  const {
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext<GroceryListFormData>();

  const ingredientNames = useWatch({
    control,
    name: [
      `ingredients.${0}.name`,
      `ingredients.${1}.name`,
      `ingredients.${2}.name`,
      `ingredients.${3}.name`,
    ],
  });

  const valueSetter = useCallback(
    (ingredientIndex: number, upgradedIngredient: GroceryListFormIngredient) => {
      setValue(`ingredients.${ingredientIndex}`, upgradedIngredient);
    },
    [setValue],
  );

  return (
    <Grid
      m={{ base: '0px 30px', sm: '20px 0px' }}
      templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(6, 1fr)' }}
      rowGap={{ base: '20px' }}
      columnGap={{ base: '20px', sm: '30px' }}
    >
      <Input
        type={'text'}
        gridColumn={'1/3'}
        {...register('name', { required: true })}
        isInvalid={errors.name?.type === 'required'}
        placeholder={
          errors.name?.type === 'required' ? 'Grocery list name missing' : 'Grocery list name*'
        }
      />

      {/* Header grocery inputs */}
      {[0, 1, 2, 3].map(index => {
        return (
          <IngredientComboBox
            key={`headerComboBox_${index}`}
            ingredientName={ingredientNames[index]}
            ingredientIndex={index}
            valueSetter={valueSetter}
            header
          />
        );
      })}
    </Grid>
  );
};

export const IngredientComboBox: FC<{
  ingredientName: string;
  ingredientIndex: number;
  header?: boolean;
  valueSetter?: (ingredientIndex: number, updatedIngredient: GroceryListFormIngredient) => void;
}> = ({ ingredientName, ingredientIndex, header, valueSetter }) => {
  const { setExpandedIndex } = useGroceryListContext();

  // PersonalIngredient from context hook, and filtered array of PersonalIngredients
  const { ingredientIndexes, currentIngredients } = useIngredientContext();
  const [filteredIngredients, setFilteredIngredients] = useState<string[]>([]);
  const [isDesktopView] = useMediaQuery('(min-width: 30em)');

  const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps } = useCombobox({
    items: filteredIngredients,
    onInputValueChange: ({ inputValue }) => {
      const updatedIngredient = {
        name: inputValue ? inputValue : '',
      };

      if (inputValue && inputValue in ingredientIndexes) {
        Object.assign(updatedIngredient, {
          price: currentIngredients[ingredientIndexes[inputValue]].price,
          capacity: currentIngredients[ingredientIndexes[inputValue]].capacity,
          unit: currentIngredients[ingredientIndexes[inputValue]].unit,
          quantity: currentIngredients[ingredientIndexes[inputValue]].quantity,
        });
      }

      if (valueSetter) valueSetter(ingredientIndex, updatedIngredient);

      if (header && isDesktopView) setExpandedIndex([0]);

      const fuse = new Fuse(Object.keys(ingredientIndexes), {
        keys: ['name'],
        ignoreLocation: true,
      });

      const results = fuse.search(inputValue ? inputValue : '', {
        limit: 5,
      });

      setFilteredIngredients(
        inputValue
          ? results.map(result => {
              return result.item;
            })
          : [],
      );
    },
  });

  return (
    <Flex flexDir={'column'} position={{ base: 'relative', sm: 'unset' }}>
      <Input
        type={'text'}
        {...getInputProps()}
        placeholder={'Grocery'}
        value={ingredientName ? ingredientName : ''}
      />

      <List
        as={Card}
        display={isOpen && filteredIngredients.length ? 'unset' : 'none'}
        pos={'absolute'}
        py={2}
        mt={'50px'}
        mx={0} // for mobile
        overflowY="auto"
        maxWidth={'100%'}
        zIndex={99}
        {...getMenuProps()}
      >
        {filteredIngredients.map((item, index) => (
          <ListItem
            transition={'background-color 220ms, color 220ms'}
            bg={index === highlightedIndex ? 'lightcoral' : null}
            px={'12px'}
            py={'6px'}
            cursor="pointer"
            key={`ingredientDropdown_${index}`}
            {...getItemProps({ item, index })}
          >
            {item}
          </ListItem>
        ))}
      </List>
    </Flex>
  );
};

export default ListForm;