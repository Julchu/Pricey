import { Box, Link } from '@chakra-ui/react';
import { FC } from 'react';

/* 
<Box marginBottom={'auto'} marginLeft={'auto'}>
        <IconButton
          onClick={setToggleOpen(true)}
          icon={<CloseIcon />}
          aria-label={'Close sidepanel'}
        />
      </Box>

			{ label: 'Pricey', path: '/' },
    { label: 'About Us', path: '/about/' },
    { label: 'Functions', path: '/functions/' },

		onClick={() => {
          setCurrentUnit(oppositeUnit);
          setOppositeUnit(currentUnit);
        }}
			 */

const Sidebar: FC = () => {
  return (
    <>
      <Box bgColor={'blue'}>
        <Link href={'/about'}>About</Link>
      </Box>
    </>
  );
};

export default Sidebar;
