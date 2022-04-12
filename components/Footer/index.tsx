import { useRouter } from 'next/router';
import { FC } from 'react';
import { Column, Row } from '../UI/Structure';

const Footer: FC = () => {
  const router = useRouter();

  return (
    <Row style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
      <Column style={{ marginLeft: '0px', marginRight: 'auto' }} onClick={() => router.push('/')}>
        Pricey
      </Column>
      <Column
        style={{ marginLeft: 'auto', marginRight: '0px' }}
        onClick={() => router.push('/about')}
      >
        About Us
      </Column>
    </Row>
  );
};

export default Footer;
