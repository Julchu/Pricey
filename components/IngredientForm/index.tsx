import { Button, Grid, Input, Select, Show } from '@chakra-ui/react';
import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Unit } from '../../lib/firebase/interfaces';
import { unitFormatter } from '../../lib/textFormatters';
import { IngredientFormData } from '../Dashboard';

// TODO: after submitting an ingredient, reset search to empty
const IngredientForm: FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<IngredientFormData>();

  const validateIsNumber = (value: number): boolean => {
    return !!value;
  };

  return (
    <Grid
      m={'20px 0px 20px 30px'}
      templateColumns={{ base: 'auto', sm: 'repeat(6, 1fr)' }}
      templateRows={{ sm: 'repeat(1, 1fr)' }}
      gap={'30px'}
      w={'100%'}
    >
      {/* Ingredient name input */}
      <Input
        gridColumn={{ sm: '1/3' }}
        letterSpacing={'2px'}
        height={'40px'}
        width={'100%'}
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
          validate: price => validateIsNumber(price),
        })}
        isInvalid={errors.price?.type === 'required' || errors.price?.type === 'validate'}
        placeholder={'Price'}
      />

      {/* Quantity input */}
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
          required: true,
          validate: price => validateIsNumber(price),
        })}
        isInvalid={errors.quantity?.type === 'required' || errors.quantity?.type === 'validate'}
        placeholder={'Quantity'}
      />

      {/* TODO: create custom dropdown menu styling */}
      {/* Unit selector */}
      <Select
        letterSpacing={'2px'}
        color={
          errors.unit?.type === 'required' || errors.unit?.type === 'validate' ? 'red' : 'grey'
        }
        border={{ base: '1px solid grey', sm: 'none' }}
        outline={{ sm: 'none' }}
        boxShadow={{ sm: 'normal' }}
        borderRadius={'5px'}
        transition={'box-shadow 0.2s ease-in-out'}
        _hover={{ boxShadow: { sm: 'hover' } }}
        _focus={{ boxShadow: { sm: 'focus' } }}
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
        isInvalid={errors.unit?.type === 'required'}
      >
        <option selected hidden disabled value="">
          Unit
        </option>
        {Object.values(Unit).map((unit, index) => {
          return (
            <option key={`${unit}_${index}`} value={unit}>
              {unitFormatter(unit)}
            </option>
          );
        })}
      </Select>

      <Show above={'sm'}>
        <Button>Create Grocery List</Button>
      </Show>
    </Grid>
  );
};

export default IngredientForm;
