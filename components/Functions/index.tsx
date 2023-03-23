import { Flex, Link } from '@chakra-ui/react';
import { FC } from 'react';
import { deleteCollection, getDocuments } from '../../lib/firebase/functions';
// import { deleteCollection, getDocuments } from '../../lib/firebase/functions';

const Functions: FC = () => {
  return (
    <Flex flexDir={'row'}>
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
    </Flex>
  );
};

export default Functions;
