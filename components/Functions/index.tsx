import { Button, Flex, Input, Link } from '@chakra-ui/react';
import { FC, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { deleteCollection, getDocuments } from '../../lib/firebase/functions';
import { parseCSV, readFile } from '../../lib/parseCSV';
// import { deleteCollection, getDocuments } from '../../lib/firebase/functions';
// import { parseCSV } from '../../lib/parseCSV';

type FileFormData = {
  file: File[];
};

const Functions: FC = () => {
  // const uploadFileAndRed = useCallback((files: FileFormData): void => {
  //   readFile(files.file[0]).then(async fileData => console.log(await parseCSV(fileData)));
  // }, []);

  // const onSubmit = useCallback(
  //   (data: FileFormData) => {
  //     uploadFileAndRed(data);
  //   },
  //   [uploadFileAndRed],
  // );

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FileFormData>();

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

      {/* <form>
        <Input
          {...register('file', { required: false })}
          placeholder="Choose ingredients CSV"
          type="file"
          accept="csv"
        />
        <Button onClick={() => handleSubmit(onSubmit)}>Upload ingredients</Button>
      </form> */}
    </Flex>
  );
};

export default Functions;
