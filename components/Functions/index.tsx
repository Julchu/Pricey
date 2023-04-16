import { Flex, Link, Spinner, Text } from '@chakra-ui/react';
import { FC, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import useIngredient from '../../hooks/useIngredient';
import useUser from '../../hooks/useUser';
import { deleteCollection, getDocuments } from '../../lib/firebase/functions';
import { WithId, User, Unit } from '../../lib/firebase/interfaces';

const Functions: FC = () => {
  const { authUser, loading: userLoading, login, logout } = useAuth();
  const [{ updateIngredient }] = useIngredient();
  const [{ updateUser }] = useUser();

  useEffect(() => {
    if (authUser) console.log('dashboard useAuth:', authUser);
  }, [authUser]);

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
            amount: 0,
            submitter: '',
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
          await updateUser({ mass: Unit.kilogram, volume: Unit.litre } as Partial<WithId<User>>);
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

      {userLoading ? (
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
