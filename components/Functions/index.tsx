import { FC } from 'react';
import { deleteCollection, getDocuments } from '../../lib/firebase/functions';
import { Hyperlink } from '../UI/Buttons';
import { Row } from '../UI/Structure';

const Functions: FC = () => {
  return (
    <>
      <Row>
        <Hyperlink
          onClick={async () => {
            await getDocuments('ingredients');
            await getDocuments('ingredientInfo');
          }}
        >
          Get Ingredients
        </Hyperlink>
      </Row>

      <Row>
        <Hyperlink
          onClick={async () => {
            await deleteCollection('ingredients');
            await deleteCollection('ingredientInfo');
          }}
        >
          Delete Ingredients
        </Hyperlink>
      </Row>
    </>
  );
};

export default Functions;
