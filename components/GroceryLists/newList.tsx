import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Flex, Box, Input, Button, HStack, Select, Spacer, IconButton } from '@chakra-ui/react';
import { FC, useCallback, useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import useGroceryList from '../../hooks/useGroceries';
import { Ingredient, Unit } from '../../lib/firebase/interfaces';

export type GroceryListFormData = {
  groceryListId?: string;
  name: string;
  ingredients: (Ingredient & { quantity: number; unit: Unit })[];
  viewable?: boolean;
};

const NewList: FC<{ groceryListCreator: string; groceryListId: string }> = ({
  groceryListCreator,
  groceryListId,
}) => {
  // TODO: query for user-chosen grocery list name as groceryListId

  const [{ submitGroceryList }, loading] = useGroceryList();

  const { register, control, watch, handleSubmit } = useForm<GroceryListFormData>({
    defaultValues: {
      name: '',
      ingredients: [{ name: '', price: undefined, unit: undefined }],
      viewable: false,
    },
  });

  const selectedUnit = watch(`ingredients`);

  const { fields, append, remove } = useFieldArray({ name: 'ingredients', control });

  const onSubmitHandler = useCallback(() => {}, []);

  return (
    <form>
      <Flex flexDir={{ base: 'column', sm: 'row' }}>
        <Box m={{ base: '0px 30px', sm: '20px 0px' }} w="100%">
          <Input {...register('name', { required: true })} placeholder={'Grocery list name'} />
        </Box>
      </Flex>

      <Box p={{ base: '30px 0px', sm: '0px 30px' }} mt={'header'}>
        {fields.map((field, index) => (
          <HStack key={field.id} my={'header'}>
            <Input
              placeholder={'Ingredient price'}
              {...register(`ingredients.${index}.price`, { required: true })}
            />
            <Input placeholder={'Quantity'} />
            <Select
              {...register(`ingredients.${index}.unit`, {
                required: true,
              })}
              color={selectedUnit[index].unit ? 'black' : 'grey'}
              // isInvalid={errors.unit?.type === 'required'}
              placeholder={'Unit*'}
            >
              {Object.values(Unit).map((unit, index) => {
                return (
                  <option key={`${unit}_${index}`} value={unit}>
                    {unit}
                  </option>
                );
              })}
            </Select>

            <IconButton
              aria-label="Remove ingredient"
              icon={<DeleteIcon />}
              onClick={() => remove(index)}
            />
          </HStack>
        ))}
        <HStack>
          <IconButton aria-label="Add ingredient" icon={<AddIcon />} onClick={() => append({})} />

          <Spacer />
          <Button onClick={() => handleSubmit(onSubmitHandler)}>Save list</Button>
        </HStack>
      </Box>
    </form>
  );
};

export default NewList;
