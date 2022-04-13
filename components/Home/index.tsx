import { FC } from 'react';
import { testSetFirebase } from '../../lib/firebase';
import { Hyperlink } from '../UI/Buttons';

// Page shown at `localhost:3000/`
const Index: FC = () => {
  return (
    <>
      <form>
        <Hyperlink
          onClick={async () => {
            await testSetFirebase();
          }}
        >
          Test Firebase
        </Hyperlink>
      </form>
    </>
  );
};

export default Index;
