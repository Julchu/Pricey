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
            // await getDocuments('ingredients');
            await getDocuments('ingredientInfos');
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
            await deleteCollection('ingredientInfos');
          }}
        >
          Delete Ingredients
        </Hyperlink>
      </Row>
    </>
  );
};

export default Functions;
