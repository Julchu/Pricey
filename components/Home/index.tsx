import { FC } from 'react';
import { deleteUsers, getUsers, setUsers } from '../../lib/firebase';
import { Hyperlink } from '../UI/Buttons';
import { Row } from '../UI/Structure';

// Page shown at `localhost:3000/`
const Index: FC = () => {
  return (
    <>
      {/* <form> */}
      <Row>
        <Hyperlink
          onClick={async () => {
            // TODO: connect to Firestore
            await setUsers();
          }}
        >
          setUsers
        </Hyperlink>
      </Row>

      <Row>
        <Hyperlink
          onClick={async () => {
            await getUsers();
          }}
        >
          getUsers
        </Hyperlink>
      </Row>
      <Row>
        <Hyperlink
          onClick={async () => {
            await deleteUsers('users');
          }}
        >
          deleteUsers
        </Hyperlink>
      </Row>
      {/* </form> */}
    </>
  );
};

export default Index;
