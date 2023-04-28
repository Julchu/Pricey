import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Flex, Box, Input, Button, HStack, Select, Spacer, IconButton } from '@chakra-ui/react';
import { FC, useCallback } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { GroceryListFormData } from '.';
import { useAuth } from '../../hooks/useAuth';
import useGroceryList from '../../hooks/useGroceries';
import { Unit } from '../../lib/firebase/interfaces';
import { validateIsNumber } from '../../lib/textFormatters';

const NewList: FC<{ groceryListCreator: string; groceryListId: string }> = ({
  groceryListCreator,
  groceryListId,
}) => {
  // TODO: query for user-chosen grocery list name as groceryListId
  const { authUser } = useAuth();
  const [{ submitGroceryList }, loading] = useGroceryList();

  const {
    register,
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<GroceryListFormData>({
    defaultValues: {
      name: '',
      ingredients: [
        { name: '', price: undefined, quantity: undefined, amount: undefined, unit: undefined },
      ],
      viewable: false,
    },
  });

  const selectedUnit = watch(`ingredients`);

  const {
    fields: fieldsIngredient,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    name: 'ingredients',
    control,
  });

  const onSubmitHandler = useCallback(
    async (groceryListData: GroceryListFormData) => {
      if (!errors) await submitGroceryList(groceryListData);
      else console.log(errors);
    },
    [errors, submitGroceryList],
  );

  return (
    <form>
      <Flex flexDir={{ base: 'column', sm: 'row' }}>
        <Box m={{ base: '0px 30px', sm: '20px 0px' }} w="100%">
          <Input {...register('name', { required: true })} placeholder={'Grocery list name'} />
        </Box>
      </Flex>

      <Box p={{ base: '30px 0px', sm: '0px 30px' }} mt={'header'}>
        {fieldsIngredient.map((field, index) => (
          <HStack key={field.id} my={'header'}>
            <Input
              placeholder={'Ingredient name'}
              isInvalid={errors.ingredients?.[index]?.name?.type === 'required'}
              {...register(`ingredients.${index}.name`, { required: true })}
            />

            <Input
              type={'number'}
              isInvalid={errors.ingredients?.[index]?.price?.type === 'validate'}
              placeholder={'Ingredient price'}
              {...register(`ingredients.${index}.price`, {
                valueAsNumber: true,
                min: 0,
                validate: price => {
                  if (price) return validateIsNumber(price);
                },
              })}
            />

            <Input
              type={'number'}
              isInvalid={errors.ingredients?.[index]?.amount?.type === 'validate'}
              placeholder={'Amount'}
              {...register(`ingredients.${index}.amount`, {
                valueAsNumber: true,
                min: 1,
                validate: price => {
                  if (price) return validateIsNumber(price);
                },
              })}
            />

            <Select
              {...register(`ingredients.${index}.unit`, {})}
              color={selectedUnit[index].unit ? 'black' : 'grey'}
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

            <Input
              type={'number'}
              isInvalid={errors.ingredients?.[index]?.quantity?.type === 'validate'}
              placeholder={'Quantity'}
              {...register(`ingredients.${index}.quantity`, {
                valueAsNumber: true,
                min: 1,
                validate: price => {
                  if (price) return validateIsNumber(price);
                },
              })}
            />

            <IconButton
              aria-label="Remove ingredient"
              icon={<DeleteIcon />}
              onClick={() => removeIngredient(index)}
            />
          </HStack>
        ))}
        <HStack>
          <IconButton
            aria-label="Add ingredient"
            icon={<AddIcon />}
            onClick={() => appendIngredient({})}
          />

          <Spacer />
          <Button onClick={handleSubmit(onSubmitHandler)}>Save list</Button>
        </HStack>
      </Box>
    </form>
  );
};

export default NewList;
