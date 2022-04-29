import { useRouter } from 'next/router';
import { FC } from 'react';
import { StripeButton } from '../UI/Buttons';
import { FooterInnerWrapper } from './styles';

const Footer: FC = () => {
  const router = useRouter();

  return (
    <FooterInnerWrapper>
      <StripeButton onClick={() => router.push('/')}>Pricey</StripeButton>
      <StripeButton onClick={() => router.push('/about')}>About Us</StripeButton>
      <StripeButton onClick={() => router.push('/functions')}>Functions</StripeButton>
    </FooterInnerWrapper>
  );
};

export default Footer;
