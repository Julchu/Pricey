import { useRouter } from 'next/router';
import { FC } from 'react';
import { StripeButton } from '../UI/Buttons';
import { FooterInnerWrapper } from './styles';
import { useDarkMode } from '../../contexts/DarkModeContext';

const Footer: FC = () => {
  const router = useRouter();
  const { darkMode, setDarkMode } = useDarkMode();

  return (
    <FooterInnerWrapper>
      <StripeButton onClick={() => router.push('/')}>Pricey</StripeButton>
      <StripeButton onClick={() => router.push('/about')}>About Us</StripeButton>
      <StripeButton onClick={() => router.push('/functions')}>Functions</StripeButton>
      <StripeButton onClick={() => setDarkMode(!darkMode)}>Dark Mode</StripeButton>
    </FooterInnerWrapper>
  );
};

export default Footer;
