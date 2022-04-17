import { useRouter } from 'next/router';
import { FC } from 'react';
import { Column } from '../UI/Structure';

const Footer: FC = () => {
  const router = useRouter();

  return (
    <>
      <Column style={{ marginLeft: '0px', marginRight: 'auto' }} onClick={() => router.push('/')}>
        Pricey
      </Column>
      <Column
        style={{ marginLeft: 'auto', marginRight: '0px' }}
        onClick={() => router.push('/about')}
      >
        About Us
      </Column>
    </>
  );
};

export default Footer;
