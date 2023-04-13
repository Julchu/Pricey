import { Grid, Input, Select } from '@chakra-ui/react';
import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Unit } from '../../lib/firebase/interfaces';
import { IngredientFormData } from '../Dashboard';

// TODO: after submitting an ingredient, reset search to empty
const IngredientForm: FC = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<IngredientFormData>();

  const selectedUnit = useWatch({ control, name: 'unit' });

  const validateIsNumber = (value: number): boolean => {
    return !!value;
  };

  return (
    <Grid
      m={{ base: '20px 30px', sm: '20px 0px' }}
      templateColumns={{ base: 'auto', sm: 'repeat(6, 1fr)' }}
      templateRows={{ sm: 'repeat(1, 1fr)' }}
      gap={'10px 30px'}
      w={{ sm: '100%' }}
    >
      {/* Ingredient name input */}
      <Input
        gridColumn={{ sm: '1/3' }}
        letterSpacing={'2px'}
        height={'40px'}
        transition={'box-shadow 0.2s ease-in-out'}
        border={{ base: '1px solid grey', sm: 'none' }}
        outline={{ sm: 'none' }}
        borderRadius={'5px'}
        boxShadow={{ sm: 'normal' }}
        _hover={{ boxShadow: { sm: 'hover' } }}
        _focus={{ boxShadow: { sm: 'focus' } }}
        _invalid={{
          color: 'red',
          _placeholder: {
            fontWeight: 600,
            color: 'red',
          },
        }}
        {...register('name', { required: true })}
        placeholder={
          errors.name?.type === 'required'
            ? 'Ingredient name is required'
            : 'Search for an ingredient'
        }
        isInvalid={errors.name?.type === 'required'}
      />

      {/* Price input */}
      <Input
        gridColumn={{ base: '0/1', sm: 'unset' }}
        letterSpacing={'2px'}
        height={'40px'}
        transition={'box-shadow 0.2s ease-in-out'}
        border={{ base: '1px solid grey', sm: 'none' }}
        outline={{ sm: 'none' }}
        borderRadius={'5px'}
        boxShadow={{ sm: 'normal' }}
        _hover={{ boxShadow: { sm: 'hover' } }}
        _focus={{ boxShadow: { sm: 'focus' } }}
        _invalid={{
          color: 'red',
          _placeholder: {
            fontWeight: 600,
            color: 'red',
          },
        }}
        {...register('price', {
          valueAsNumber: true,
          required: true,
          min: 0,
          validate: price => validateIsNumber(price),
        })}
        isInvalid={errors.price?.type === 'required' || errors.price?.type === 'validate'}
        placeholder={'Price'}
      />

      {/* Amount input */}
      <Input
        letterSpacing={'2px'}
        height={'40px'}
        transition={'box-shadow 0.2s ease-in-out'}
        border={{ base: '1px solid grey', sm: 'none' }}
        outline={{ sm: 'none' }}
        borderRadius={'5px'}
        boxShadow={{ sm: 'normal' }}
        _hover={{ boxShadow: { sm: 'hover' } }}
        _focus={{ boxShadow: { sm: 'focus' } }}
        _invalid={{
          color: 'red',
          _placeholder: {
            fontWeight: 600,
            color: 'red',
          },
        }}
        {...register('amount', {
          valueAsNumber: true,
          required: true,
          min: 0,
          validate: amount => validateIsNumber(amount),
        })}
        isInvalid={errors.amount?.type === 'required' || errors.amount?.type === 'validate'}
        placeholder={'Amount'}
      />

      <Select
        letterSpacing={'2px'}
        border={{ base: '1px solid grey', sm: 'none' }}
        outline={{ sm: 'none' }}
        boxShadow={{ sm: 'normal' }}
        borderRadius={'5px'}
        transition={'box-shadow 0.2s ease-in-out'}
        _hover={{ boxShadow: { sm: 'hover' } }}
        _focus={{ boxShadow: { sm: 'focus' } }}
        _placeholder={{ color: 'red' }}
        _invalid={{
          color: 'red',
          fontWeight: 600,
          _placeholder: {
            color: 'red',
          },
        }}
        {...register('unit', {
          required: true,
        })}
        color={selectedUnit ? 'black' : 'grey'}
        isInvalid={errors.unit?.type === 'required'}
        placeholder={'Unit'}
      >
        {Object.values(Unit).map((unit, index) => {
          return (
            <option key={`${unit}_${index}`} value={unit}>
              {unit}
            </option>
          );
        })}
      </Select>

      {/* Item quantity */}
      <Input
        letterSpacing={'2px'}
        height={'40px'}
        transition={'box-shadow 0.2s ease-in-out'}
        border={{ base: '1px solid grey', sm: 'none' }}
        outline={{ sm: 'none' }}
        borderRadius={'5px'}
        boxShadow={{ sm: 'normal' }}
        _hover={{ boxShadow: { sm: 'hover' } }}
        _focus={{ boxShadow: { sm: 'focus' } }}
        _invalid={{
          color: 'red',
          _placeholder: {
            fontWeight: 600,
            color: 'red',
          },
        }}
        {...register('quantity', {
          valueAsNumber: true,
          required: false,
          min: 1,
          validate: quantity => {
            if (quantity) return validateIsNumber(quantity);
          },
        })}
        isInvalid={errors.quantity?.type === 'validate'}
        placeholder={'Quantity'}
      />
    </Grid>
  );
};

export default IngredientForm;

/* TODO: create custom dropdown menu for unit */

/* Unit selector */

/* <Menu closeOnSelect={false}>
  <MenuButton
    bg={'white'}
    fontWeight={'normal'}
    letterSpacing={'2px'}
    border={{ base: '1px solid grey', sm: 'none' }}
    outline={{ sm: 'none' }}
    boxShadow={{ sm: 'normal' }}
    borderRadius={'5px'}
    transition={'box-shadow 0.2s ease-in-out'}
    _hover={{ boxShadow: { sm: 'hover' } }}
    _focus={{ boxShadow: { sm: 'focus' } }}
    _placeholder={{ color: 'red' }}
    _invalid={{
      color: 'red',
      fontWeight: 600,
      _placeholder: {
        color: 'red',
      },
    }}
    as={Button}
  >
    {selectedUnit ? selectedUnit : 'Unit'}
  </MenuButton>
  <MenuList minWidth="240px">
    <MenuOptionGroup
      onChange={value => {
        setValue('unit', Unit[value as keyof typeof Unit]);
      }}
      type="radio"
    >
      {Object.entries(Unit).map(([unitKey, unitValue], index) => {
        return (
          <MenuItemOption closeOnSelect key={`${unitValue}_${index}`} value={unitKey}>
            {unitValue}
          </MenuItemOption>
        );
      })}
    </MenuOptionGroup>
  </MenuList>
</Menu> */
