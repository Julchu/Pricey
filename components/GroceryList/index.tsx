import { FC } from 'react';
import { Ingredient, Unit } from '../../lib/firebase/interfaces';

export type GroceryListFormData = {
  ingredients: Ingredient[];
  price: number;
  quantity: number;
  unit: Unit;
  location?: string;
};

const GroceryList: FC = () => {
  // React Hook Form
  // const {
  //   control,
  //   register,
  //   clearErrors,
  //   formState: { errors },
  // } = useForm<GroceryListFormData>({ defaultValues: defaultFormValues() });

  // /* const {
  //   fields: fieldsNestedInstruction,
  //   append: appendNestedInstruction,
  //   remove: removeNestedInstruction,
  //   move: moveNestedInstruction,
  // } = useFieldArray({
  //   control,
  //   name: `instructionHeaders.${instructionIndex}.instructions`,
  // }); */
  // const {
  //   fields: fieldsIngredient,
  //   append: appendIngredient,
  //   remove: removeIngredient,
  //   move: moveIngredient,
  // } = useFieldArray({
  //   control, // control props comes from useForm (optional: if you are using FormContext)
  //   name: 'ingredients', // unique name for your Field Array
  // });

  return <h1>Header</h1>;
};

export default GroceryList;
