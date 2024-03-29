import { Grid, Input, InputGroup, InputLeftElement, Select } from '@chakra-ui/react';
import { FC } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Unit } from '../../lib/firebase/interfaces';
import { validateIsNumber } from '../../lib/textFormatters';
import { IngredientFormData } from '../HomeDashboard';

// TODO: after submitting an ingredient, reset search to empty
const IngredientForm: FC = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<IngredientFormData>();

  const selectedUnit = useWatch({ control, name: 'unit' });

  return (
    <Grid
      m={{ base: '0px 30px', sm: '20px 0px' }}
      templateColumns={{ base: 'repeat(2, 1fr)', sm: 'repeat(6, 1fr)' }}
      rowGap={{ base: '20px' }}
      columnGap={{ base: '20px', sm: '30px' }}
    >
      {/* Ingredient name input */}
      <Input
        type={'text'}
        gridColumn={'1/3'}
        {...register('name', { required: true })}
        isInvalid={errors.name?.type === 'required'}
        placeholder={
          errors.name?.type === 'required' ? 'Ingredient name missing' : 'Search for an ingredient*'
        }
      />

      {/* Measurement input */}
      <Input
        type={'number'}
        {...register('capacity', {
          valueAsNumber: true,
          required: true,
          min: 0,
          validate: capacity => validateIsNumber(capacity),
        })}
        isInvalid={errors.capacity?.type === 'required' || errors.capacity?.type === 'validate'}
        placeholder={'Capacity*'}
      />

      <Select
        {...register('unit', {
          required: true,
        })}
        color={selectedUnit ? 'black' : 'grey'}
        isInvalid={errors.unit?.type === 'required'}
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

      {/* Item quantity */}
      <Input
        type={'number'}
        {...register('quantity', {
          valueAsNumber: true,
          min: 1,
          validate: quantity => {
            if (quantity) return validateIsNumber(quantity);
          },
        })}
        isInvalid={errors.quantity?.type === 'validate'}
        placeholder={'Quantity'}
      />

      {/* Price input */}
      <InputGroup>
        <InputLeftElement pointerEvents={'none'}>$</InputLeftElement>
        <Input
          type={'number'}
          {...register('price', {
            valueAsNumber: true,
            required: true,
            min: 0,
            validate: price => validateIsNumber(price),
          })}
          isInvalid={errors.price?.type === 'required' || errors.price?.type === 'validate'}
          placeholder={'Price*'}
        />
      </InputGroup>
    </Grid>
  );
};

export default IngredientForm;
