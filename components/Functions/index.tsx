import { Button, Flex, Input, Link, Spinner, Text } from '@chakra-ui/react';
import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import { deleteCollection, getDocuments } from '../../lib/firebase/functions';
import useCSV from '../../hooks/useCSV';

type FileFormData = {
  file: File[];
};

const Functions: FC = () => {
  const { authUser, loading: userLoading, login, logout } = useAuth();

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
