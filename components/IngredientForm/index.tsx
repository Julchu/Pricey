import { Grid, Input, Select } from '@chakra-ui/react';
import { FC, Dispatch, SetStateAction, ChangeEvent } from 'react';
import { useFormContext } from 'react-hook-form';
import { Unit } from '../../lib/firebase/interfaces';
import { unitFormatter } from '../../lib/textFormatters';
import { IngredientFormData } from '../Dashboard';

// TODO: after submitting an ingredient, reset search to empty
const IngredientForm: FC<{
  newIngredient: IngredientFormData;
  setNewIngredient: Dispatch<SetStateAction<IngredientFormData>>;
}> = ({ newIngredient, setNewIngredient }) => {
  const {
    register,
    clearErrors,
    formState: { errors },
  } = useFormContext<IngredientFormData>();

  const validateIsNumber = (value: number): boolean => {
    return !!value;
  };

  return (
    <>
      <Grid
        m={'30px 30px 0px'}
        gridTemplateColumns={{ base: 'auto', sm: 'repeat(5, 1fr)' }}
        gap={'30px'}
      >
        {/* Ingredient name input */}
        <Input
          gridColumn={{ sm: '1/3' }}
          letterSpacing={'2px'}
          fontSize={'16px'}
          padding={'5px 20px'}
          height={'40px'}
          width={'100%'}
          transition={'box-shadow 0.2s ease-in-out'}
          border={{ base: '1px solid grey', sm: 'none' }}
          outline={{ sm: 'none' }}
          borderRadius={'5px'}
          boxShadow={{ sm: 'normal' }}
          _hover={{ boxShadow: { sm: 'hover' } }}
          _focus={{ boxShadow: { sm: 'focus' } }}
          _placeholder={{
            fontWeight: 300,
            color: errors.variety?.type === 'required' ? 'red' : 'grey',
          }}
          {...register('variety', { required: true })}
          placeholder={
            errors.variety?.type === 'required'
              ? 'Ingredient name is required'
              : 'Search for an ingredient'
          }
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setNewIngredient({
              ...newIngredient,
              variety: e.target.value.toLocaleLowerCase('en-US').trim(),
            });

            clearErrors('variety');
          }}
        />

        {/* Price input */}
        {/* TODO: aria-invalid with isInvalid in Chakra: errors.price?.type === 'required' || errors.price?.type === 'validate' */}
        <Input
          minWidth={{ sm: '250px' }}
          letterSpacing={'2px'}
          fontSize={'16px'}
          padding={'5px 20px'}
          height={'40px'}
          transition={'box-shadow 0.2s ease-in-out'}
          border={{ base: '1px solid grey', sm: 'none' }}
          outline={{ sm: 'none' }}
          borderRadius={'5px'}
          boxShadow={{ sm: 'normal' }}
          _hover={{ boxShadow: { sm: 'hover' } }}
          _focus={{ boxShadow: { sm: 'focus' } }}
          _placeholder={{
            fontWeight: 300,
            color:
              errors.price?.type === 'required' || errors.price?.type === 'validate'
                ? 'red'
                : 'grey',
          }}
          {...register('price', {
            valueAsNumber: true,
            required: true,
            validate: price => validateIsNumber(price),
          })}
          onChange={e => {
            setNewIngredient({ ...newIngredient, price: parseFloat(e.target.value) });
            clearErrors('price');
          }}
          placeholder={'Price'}
        />

        {/* Quantity input */}

        <Input
          minWidth={{ sm: '250px' }}
          letterSpacing={'2px'}
          fontSize={'16px'}
          padding={'5px 20px'}
          height={'40px'}
          transition={'box-shadow 0.2s ease-in-out'}
          border={{ base: '1px solid grey', sm: 'none' }}
          outline={{ sm: 'none' }}
          borderRadius={'5px'}
          boxShadow={{ sm: 'normal' }}
          _hover={{ boxShadow: { sm: 'hover' } }}
          _focus={{ boxShadow: { sm: 'focus' } }}
          _placeholder={{
            fontWeight: 300,
            color:
              errors.quantity?.type === 'required' || errors.quantity?.type === 'validate'
                ? 'red'
                : 'grey',
          }}
          {...register('quantity', {
            valueAsNumber: true,
            required: true,
            validate: price => validateIsNumber(price),
          })}
          onChange={e => {
            setNewIngredient({ ...newIngredient, quantity: parseFloat(e.target.value) });
            clearErrors('quantity');
          }}
          placeholder={'Quantity'}
        />

        {/* TODO: create custom dropdown menu styling */}
        {/* Unit selector */}
        <Select
          minWidth={{ sm: '250px' }}
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
          {...register('unit', {
            required: true,
          })}
          onChange={e => {
            setNewIngredient({ ...newIngredient, unit: e.target.value as Unit });
            clearErrors('unit');
          }}
          value={newIngredient.unit}
          placeholder={'Unit'}
        >
          {Object.values(Unit).map((unit, index) => {
            return (
              <option key={`${unit}_${index}`} value={unit}>
                {unitFormatter(unit)}
              </option>
            );
          })}
        </Select>
      </Grid>
    </>
  );
};

export default IngredientForm;
