import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  IconButton,
  LinkBox,
  LinkOverlay,
  ButtonGroup,
  Stack,
  Text,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { FC, useCallback } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { SidebarEnums, SidebarTypes, useSidebarContext } from '../../hooks/useSidebarContext';
import { useUnitContext } from '../../hooks/useUnitContext';

/* { label: 'Pricey', path: '/' },
    { label: 'About Us', path: '/about/' },
    { label: 'Functions', path: '/functions/' }, */

const Sidebar: FC = () => {
  const { isSidebarOpen, /* openSidebar , */ closeSidebar, /* toggleSidebar , */ panelId } =
    useSidebarContext();

  const sidebarTypes: SidebarTypes = {
    userActions: <UserActionSidebar />,
    newGroceryList: <></>,
  };

  return (
    <Drawer isOpen={isSidebarOpen} placement="left" onClose={closeSidebar}>
      <DrawerOverlay />
      {sidebarTypes[panelId as SidebarEnums]}
    </Drawer>
  );
};

const UserActionSidebar: FC = () => {
  const { authUser, login, logout } = useAuthContext();
  const { closeSidebar } = useSidebarContext();
  const { toggleUnit, currentUnits } = useUnitContext();

  const logoutHandler = useCallback(() => {
    logout();
    closeSidebar();
  }, [logout, closeSidebar]);

  const loginHandler = useCallback(() => {
    login();
    closeSidebar();
  }, [login, closeSidebar]);

  return (
    <DrawerContent>
      <DrawerCloseButton />

      <DrawerHeader>Hello {authUser?.name}</DrawerHeader>

      <DrawerBody>
        <Stack>
          <LinkBox as={Box}>
            <Button>
              <LinkOverlay as={NextLink} href={'/about'}>
                About Pricey
              </LinkOverlay>
            </Button>
          </LinkBox>

          <Text>Current Units: {JSON.stringify(currentUnits)}</Text>

          <Box marginBottom={'auto'} marginLeft={'auto'}>
            <Button
              colorScheme={'gray'}
              aria-label={'Toggle units'}
              onClick={toggleUnit}
              leftIcon={<RepeatIcon />}
            >
              Toggle units
            </Button>
          </Box>

          {authUser ? (
            <ButtonGroup isAttached>
              <Button>Grocery Lists</Button>
              <IconButton
                aria-label="Create Grocery List"
                icon={<AddIcon />}
                borderLeft={'0.5px solid teal'}
              />
            </ButtonGroup>
          ) : null}
        </Stack>
      </DrawerBody>

      <DrawerFooter justifyContent={'center'}>
        {authUser ? (
          <Button variant="outline" onClick={logoutHandler}>
            Logout
          </Button>
        ) : (
          <Button variant="outline" onClick={loginHandler}>
            Login
          </Button>
        )}
      </DrawerFooter>
    </DrawerContent>
  );
};

export default Sidebar;
