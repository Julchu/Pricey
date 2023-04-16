import { HamburgerIcon, AddIcon } from '@chakra-ui/icons';
import {
  LinkBox,
  Heading,
  LinkOverlay,
  Menu,
  MenuButton,
  Circle,
  Square,
  Skeleton,
  Avatar,
  Spinner,
  MenuList,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
  MenuItem,
  ButtonGroup,
  Button,
  IconButton,
  MenuGroup,
  Box,
  Divider,
  Center,
  Text,
  HStack,
  Flex,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { FC, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useDebouncedState } from '../../hooks/useDebouncedState';
import { useUnit } from '../../hooks/useUnit';
import { Unit } from '../../lib/firebase/interfaces';

const Header: FC = () => {
  const { authUser, loading: userLoading, login, logout } = useAuth();

  const {} = useUnit();

  const a = useDebouncedState();

  const loginHandler = useCallback(async () => {
    if (!authUser) await login();
    else await logout();
  }, [authUser, login, logout]);

  return (
    <Box justifyContent={'space-between'} display={{ base: 'flex', sm: 'block' }}>
      <LinkBox as={Heading}>
        <LinkOverlay as={NextLink} href={'/'}>
          <Heading color={'lightcoral'} float={{ base: 'left' }} m={'20px 30px'} h={'40px'}>
            Pricey
          </Heading>
        </LinkOverlay>
      </LinkBox>

      <Menu>
        <MenuButton
          as={Circle}
          float={{ sm: 'right' }}
          m={'20px 30px'}
          size={'40px'}
          transition="all 0.2s"
          aria-label={'Open menu'}
          cursor={'pointer'}
          borderRadius={authUser ? '50%' : '5px'}
          boxShadow={'normal'}
          _hover={{ boxShadow: 'hover' }}
          _expanded={{ boxShadow: 'focus' }}
          _focus={{ boxShadow: 'focus' }}
          pos={'relative'}
        >
          <Square>
            {authUser ? (
              <Skeleton isLoaded={!userLoading} fitContent={true}>
                <Avatar
                  alignSelf={'center'}
                  justifySelf={'center'}
                  m="auto"
                  src={authUser?.photoURL}
                  borderRadius={authUser ? '50%' : '5px'}
                  boxShadow={'normal'}
                />
              </Skeleton>
            ) : userLoading ? (
              <Spinner m="auto" />
            ) : (
              <HamburgerIcon color={'black'} alignSelf={'center'} justifySelf={'center'} m="auto" />
            )}
          </Square>
        </MenuButton>

        {/* TODO: update user */}
        <MenuList>
          {/* Mass switch */}
          <MenuOptionGroup defaultValue={Unit.kilogram} title="Unit toggles" type="radio">
            <MenuItemOption closeOnSelect={false} value={Unit.kilogram}>
              Kilograms
            </MenuItemOption>
            <MenuItemOption closeOnSelect={false} value={Unit.pound}>
              Pounds
            </MenuItemOption>
          </MenuOptionGroup>

          <MenuDivider />

          <MenuOptionGroup defaultValue={Unit.litre} title="" type="radio">
            <MenuItemOption closeOnSelect={false} value={Unit.litre}>
              Litres
            </MenuItemOption>
            <MenuItemOption closeOnSelect={false} value={Unit.quart}>
              Quarts
            </MenuItemOption>
          </MenuOptionGroup>

          <MenuDivider />

          {/* <MenuGroup title="Groceries">
            <Flex flexDir={'row'}>
              <MenuItem as={Text} flex={10}>
                <Text onClick={() => console.log('list')}>My Lists</Text>
              </MenuItem>
              <MenuItem flex={1}>
                <IconButton
                  flex={0}
                  variant={'outline'}
                  aria-label="New List"
                  icon={<AddIcon />}
                  onClick={() => console.log('new list')}
                />
              </MenuItem>
            </Flex>
          </MenuGroup> */}

          <MenuDivider />

          <MenuGroup title="Links">
            <MenuItem as={NextLink} href={'/about'}>
              Tutorial
            </MenuItem>
            <MenuItem as={NextLink} href={'/about'}>
              About
            </MenuItem>
          </MenuGroup>

          <MenuDivider />

          <MenuGroup title="Profile">
            <MenuItem onClick={loginHandler}>{authUser ? 'Logout' : 'Login'}</MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default Header;
