import { useRouter } from 'next/router';
import { FC } from 'react';
import { StripeButton } from '../UI/Buttons';
import { FooterInnerWrapper } from './styles';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useUnit } from '../../contexts/UnitContext';
import { Unit } from '../../lib/firebase/interfaces';

const Footer: FC = () => {
  const router = useRouter();
  const { darkMode, setDarkMode } = useDarkMode();
  const { currentUnit, setCurrentUnit, oppositeUnit, setOppositeUnit } = useUnit();

  return (
    <FooterInnerWrapper>
      <StripeButton onClick={() => router.push('/')}>Pricey</StripeButton>
      <StripeButton onClick={() => router.push('/about')}>About Us</StripeButton>
      <StripeButton onClick={() => router.push('/functions')}>Functions</StripeButton>
      <StripeButton onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? 'Light' : 'Dark'} Theme
      </StripeButton>
      <StripeButton
        onClick={() => {
          setCurrentUnit(oppositeUnit);
          setOppositeUnit(currentUnit);
        }}
      >
        {oppositeUnit.mass === Unit.lb ? 'Imperial' : 'Metric'} Units
      </StripeButton>
    </FooterInnerWrapper>
  );
};

export default Footer;
