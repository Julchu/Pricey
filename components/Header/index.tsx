import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Heading,
  Menu,
  MenuButton,
  Circle,
  Avatar,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
  MenuItem,
  MenuGroup,
  Box,
  Text,
  SkeletonCircle,
  AbsoluteCenter,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { FC, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDebouncedState } from '../../hooks/useDebouncedState';
import { useUnit } from '../../hooks/useUnit';
import { Unit, UnitCategory } from '../../lib/firebase/interfaces';

const Header: FC = () => {
  const { authUser, authLoading } = useAuth();

  return (
    <Box justifyContent={'space-between'} display={{ base: 'flex', sm: 'block' }}>
      <NextLink href={'/'}>
        <Heading color={'lightcoral'} float={{ base: 'left' }} m={'20px 30px'} h={'40px'}>
          Pricey
        </Heading>
      </NextLink>

      <Menu>
        <MenuButton
          as={Circle}
          float={{ sm: 'right' }}
          m={'20px 30px'}
          size={'40px'}
          transition="all 0.2s"
          aria-label={'Open menu'}
          cursor={'pointer'}
          borderRadius={authUser || authLoading ? '50%' : '5px'}
          boxShadow={'normal'}
          _hover={{ boxShadow: 'hover' }}
          _expanded={{ boxShadow: 'focus' }}
          _focus={{ boxShadow: 'focus' }}
          pos={'relative'}
        >
          {/* Double AbsoluteCenters for centering skeleton circle */}
          <AbsoluteCenter>
            {/* 48px is the default? size of Avatar */}
            <SkeletonCircle isLoaded={!authLoading} size="48px">
              <AbsoluteCenter>
                {authUser ? (
                  <Avatar
                    alignSelf={'center'}
                    justifySelf={'center'}
                    m="auto"
                    src={authUser?.photoURL}
                    borderRadius={authUser ? '50%' : '5px'}
                    boxShadow={'normal'}
                  />
                ) : (
                  <HamburgerIcon
                    color={'black'}
                    alignSelf={'center'}
                    justifySelf={'center'}
                    m="auto"
                  />
                )}
              </AbsoluteCenter>
            </SkeletonCircle>
          </AbsoluteCenter>
        </MenuButton>

        <DropdownMenu />
      </Menu>
    </Box>
  );
};

const DropdownMenu: FC = () => {
  const { authUser, login, logout } = useAuth();

  const loginHandler = useCallback(async () => {
    if (!authUser) login();
    else logout();
  }, [authUser, login, logout]);

  const { currentUnits, setCurrentUnits } = useUnit();

  const debouncedUnits = useDebouncedState(currentUnits, 1000);

  // TODO?: update user and/or authUser after unit toggles
  return (
    <MenuList boxShadow={'normal'}>
      {/* Mass switch */}
      <MenuOptionGroup
        defaultValue={currentUnits.mass}
        title="Unit toggles"
        type="radio"
        onChange={e => {
          setCurrentUnits({ ...currentUnits, mass: e as unknown as UnitCategory['mass'] });
        }}
      >
        <MenuItemOption closeOnSelect={false} value={Unit.kilogram}>
          Kilograms
        </MenuItemOption>
        <MenuItemOption closeOnSelect={false} value={Unit.pound}>
          Pounds
        </MenuItemOption>
      </MenuOptionGroup>

      <MenuDivider />

      <MenuOptionGroup
        defaultValue={currentUnits.volume}
        title=""
        type="radio"
        onChange={e => {
          setCurrentUnits({ ...currentUnits, volume: e as unknown as UnitCategory['volume'] });
        }}
      >
        <MenuItemOption closeOnSelect={false} value={Unit.litre}>
          Litres
        </MenuItemOption>
        <MenuItemOption closeOnSelect={false} value={Unit.quart}>
          Quarts
        </MenuItemOption>
      </MenuOptionGroup>

      <MenuDivider />

      {authUser ? (
        <>
          <MenuGroup title="Groceries">
            <MenuItem as={NextLink} href={'/'}>
              Ingredients
            </MenuItem>
            <MenuItem as={NextLink} href={'/groceries'}>
              <Text onClick={() => console.log('list')}>My Lists</Text>
            </MenuItem>
          </MenuGroup>
          <MenuDivider />
        </>
      ) : null}

      <MenuGroup title="Links">
        <MenuItem as={NextLink} href={'/functions'}>
          Functions
        </MenuItem>
        <MenuItem as={NextLink} href={'/about'}>
          About
        </MenuItem>
      </MenuGroup>

      <MenuDivider />

      <MenuGroup title="Profile">
        {authUser ? (
          <MenuItem as={NextLink} href={'/preferences'}>
            Preferences
          </MenuItem>
        ) : null}
        <MenuItem onClick={loginHandler}>{authUser ? 'Logout' : 'Login'}</MenuItem>
      </MenuGroup>
    </MenuList>
  );
};

export default Header;
