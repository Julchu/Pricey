import { Grid, Input, Select } from '@chakra-ui/react';
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
        type={'search'}
        gridColumn={{ base: '1/3', sm: '1/3' }}
        {...register('name', { required: true })}
        isInvalid={errors.name?.type === 'required'}
        placeholder={
          errors.name?.type === 'required' ? 'Ingredient name missing' : 'Search for an ingredient*'
        }
      />

      {/* Price input */}
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

      {/* Measurement input */}
      <Input
        type={'number'}
        {...register('measurement', {
          valueAsNumber: true,
          required: true,
          min: 0,
          validate: measurement => validateIsNumber(measurement),
        })}
        isInvalid={
          errors.measurement?.type === 'required' || errors.measurement?.type === 'validate'
        }
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
    border={'none'}
    
    boxShadow={'normal' }
    borderRadius={'5px'}
    transition={'box-shadow 0.2s ease-in-out'}
    _hover={{ boxShadow:  'hover'  }}
    _focus={{ boxShadow:  'focus'  }}
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
