import { Button, Flex, Input, Link, Spinner, Text } from '@chakra-ui/react';
import { FC, useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';

import { deleteCollection, getDocuments } from '../../lib/firebase/functions';
import { parseCSV, readFile } from '../../lib/parseCSV';

type FileFormData = {
  file: File[];
};

const Functions: FC = () => {
  const { authUser, loading: userLoading, login, logout } = useAuth();
  const [fileReading, setFileReading] = useState(false);
  const { handleSubmit, register } = useForm<FileFormData>();

  useEffect(() => {
    if (authUser) console.log('dashboard useAuth:', authUser);
  }, [authUser]);

  const uploadFileAndRed = useCallback((files: FileFormData): void => {
    readFile(files.file[0]).then(async fileData => {
      console.log(await parseCSV(fileData, setFileReading));
    });
  }, []);

  const onSubmit = useCallback(
    (data: FileFormData) => {
      setFileReading(true);
      uploadFileAndRed(data);
    },
    [uploadFileAndRed],
  );

  return (
    <Flex flexDir={'column'}>
      <Link
        color={'#0070f3'}
        cursor={'pointer'}
        _hover={{ textDecoration: 'underline' }}
        onClick={async () => {
          await getDocuments('ingredients');
          await getDocuments('ingredientInfos');
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
          await deleteCollection('ingredientInfo');
          await deleteCollection('ingredientInfos');
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

      <form>
        <Input
          {...register('file', { required: false })}
          placeholder="Choose ingredients CSV"
          type="file"
          accept="csv"
        />
        <Button onClick={handleSubmit(onSubmit)}>Upload ingredients</Button>
      </form>

      {fileReading ? (
        <>
          <Spinner />
          <Text>File reading</Text>
        </>
      ) : (
        <Text>File not reading</Text>
      )}
    </Flex>
  );
};

export default Functions;
