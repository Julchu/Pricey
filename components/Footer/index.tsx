import { useRouter } from 'next/router';
import { FC } from 'react';
import { StripeButton } from '../UI/Buttons';
import { FooterInnerWrapper } from './styles';
import { useDarkMode } from '../../contexts/DarkModeContext';
import { useUnit } from '../../contexts/UnitContext';
import { Unit } from '../../lib/firebase/interfaces';

const Footer: FC = () => {
  const { asPath, ...router } = useRouter();

  const { darkMode, setDarkMode } = useDarkMode();
  const { currentUnit, setCurrentUnit, oppositeUnit, setOppositeUnit } = useUnit();

  // List of paths to display and filter out current path
  const paths = [
    { label: 'Pricey', path: '/' },
    { label: 'About Us', path: '/about/' },
    { label: 'Functions', path: '/functions/' },
  ];

  return (
    <FooterInnerWrapper>
      {paths.map(({ label, path }) =>
        path !== asPath ? (
          <StripeButton key={label} onClick={() => router.push(path)}>
            {label}
          </StripeButton>
        ) : null,
      )}
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
