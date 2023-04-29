import { Flex, Link, Spinner, Text } from '@chakra-ui/react';
import { FC } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import useIngredientHook from '../../hooks/useIngredientHook';
import useUserHook from '../../hooks/useUserHook';
import { deleteCollection, getDocuments } from '../../lib/firebase/functions';
import { WithDocId, User, Unit } from '../../lib/firebase/interfaces';

const Functions: FC = () => {
  const { authUser, authLoading, login, logout } = useAuthContext();
  const [{ updateIngredient }] = useIngredientHook();
  const [{ updateUser }] = useUserHook();

  return (
    <Flex flexDir={'column'}>
      <Link
        color={'#0070f3'}
        cursor={'pointer'}
        _hover={{ textDecoration: 'underline' }}
        onClick={async () => {
          await getDocuments('ingredients');
          await getDocuments('submissions');
        }}
      >
        Get Ingredients
      </Link>

      <Link
        color={'#0070f3'}
        cursor={'pointer'}
        _hover={{ textDecoration: 'underline' }}
        onClick={async () => {
          await deleteCollection('ingredients');
          await deleteCollection('submissions');
        }}
      >
        Delete Ingredients
      </Link>

      <Link
        color={'#0070f3'}
        cursor={'pointer'}
        _hover={{ textDecoration: 'underline' }}
        onClick={async () => {
          await updateIngredient({
            ingredientId: 'LhtXKGpV2SWjsKE32jsM',
            name: 'test',
            price: 1,
            quantity: 0,
            unit: '' as Unit,
            measurement: 0,
          });
        }}
      >
        Update Ingredient
      </Link>

      <Link
        color={'#0070f3'}
        cursor={'pointer'}
        _hover={{ textDecoration: 'underline' }}
        onClick={async () => {
          await updateUser({ preferences: { mass: Unit.kilogram, volume: Unit.litre } } as Partial<
            WithDocId<User>
          >);
        }}
      >
        Update User
      </Link>

      {authUser ? (
        <Link
          color={'#0070f3'}
          cursor={'pointer'}
          _hover={{ textDecoration: 'underline' }}
          onClick={logout}
        >
          Logout
        </Link>
      ) : (
        <Link
          color={'#0070f3'}
          cursor={'pointer'}
          _hover={{ textDecoration: 'underline' }}
          onClick={login}
        >
          Login
        </Link>
      )}

      {authLoading ? (
        <>
          <Spinner />
          <Text>User loading</Text>
        </>
      ) : (
        <Text>User not loading</Text>
      )}
    </Flex>
  );
};

export default Functions;

/* Uploading CSV to parse, proof of concept */
// const [{ csvToIngredient }, ingredientLoading, error] = useIngredient();
// const { handleSubmit, register } = useForm<FileFormData>();
// const onSubmit = (data: FileFormData): void => {
//   if (data.file[0]) csvToIngredient();
// };

/* 
  {authUser ? (
    <>
      <form>
        <Input
          {...register('file', { required: false })}
          placeholder="Choose ingredients CSV"
          type="file"
          accept="csv"
        />
        <Button onClick={handleSubmit(onSubmit)}>Upload ingredients</Button>
      </form>

      {ingredientLoading ? (
        <>
          <Spinner />
          <Text>File reading</Text>
        </>
      ) : (
        <Text>File not reading</Text>
      )}
    </>
  ) : null}
*/
