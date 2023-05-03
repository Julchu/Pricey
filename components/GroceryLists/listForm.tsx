import { Card, Flex, Grid, Input, List, ListItem } from '@chakra-ui/react';
import { useCombobox } from 'downshift';
import Fuse from 'fuse.js';
import { FC, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { GroceryListFormData } from '.';
import { useIngredientContext } from '../../hooks/useIngredientContext';

const ListForm: FC = () => {
  const {
    register,

    formState: { errors },
  } = useFormContext<GroceryListFormData>();

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
      <IngredientComboBox index={0} />
      <IngredientComboBox index={1} />
      <IngredientComboBox index={2} />
      <IngredientComboBox index={3} />
    </Grid>
  );
};

const IngredientComboBox: FC<{
  index: number;
}> = ({ index }) => {
  const { setValue } = useFormContext<GroceryListFormData>();

  // PersonalIngredient from context hook, and filtered array of PersonalIngredients
  const { ingredientIndexes, currentIngredients } = useIngredientContext();
  const [filteredIngredients, setFilteredIngredients] = useState<string[]>([]);

  const { isOpen, getMenuProps, getInputProps, highlightedIndex, getItemProps } = useCombobox({
    items: filteredIngredients,
    onInputValueChange: ({ inputValue }) => {
      const updatedIngredient = {
        name: inputValue ? inputValue : '',
      };

      if (inputValue && inputValue in ingredientIndexes) {
        Object.assign(updatedIngredient, {
          price: currentIngredients[ingredientIndexes[inputValue]].price,
          amount: currentIngredients[ingredientIndexes[inputValue]].amount,
          unit: currentIngredients[ingredientIndexes[inputValue]].unit,
          quantity: currentIngredients[ingredientIndexes[inputValue]].quantity,
        });
      }

      setValue(`ingredients.${index}`, updatedIngredient);

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
    <Flex flexDir={'column'} pos={'relative'}>
      <Flex>
        <Input type={'text'} {...getInputProps()} placeholder={'Grocery'} />
      </Flex>

      <List
        as={Card}
        display={isOpen && filteredIngredients.length ? 'unset' : 'none'}
        pos={'absolute'}
        py={2}
        mt={'50px'}
        mx={0} // for mobile
        overflowY="auto"
        maxWidth={'100%'}
        zIndex={98} // Remain under expanded accordions
        {...getMenuProps()}
      >
        {filteredIngredients.map((item, index) => (
          <ListItem
            transition={'background-color 220ms, color 220ms'}
            bg={index === highlightedIndex ? 'coral' : null}
            px={'12px'}
            py={'6px'}
            cursor="pointer"
            key={`${item}_${index}`}
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