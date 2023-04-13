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
import { FC, useCallback, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { SidebarEnums, SidebarTypes, useSidebar } from '../../hooks/useSidebar';
import { useUnit } from '../../hooks/useUnit';

/* { label: 'Pricey', path: '/' },
    { label: 'About Us', path: '/about/' },
    { label: 'Functions', path: '/functions/' }, */

const Sidebar: FC = () => {
  const { isSidebarOpen, /* openSidebar , */ closeSidebar, /* toggleSidebar , */ panelId } =
    useSidebar();

  const sidebarTypes: SidebarTypes = {
    userActions: <UserActionSidebar />,
    newGroceryList: <></>,
  };

  return (
    <Drawer isOpen={isSidebarOpen} placement="right" onClose={closeSidebar}>
      <DrawerOverlay />
      {sidebarTypes[panelId as SidebarEnums]}
    </Drawer>
  );
};

const UserActionSidebar: FC = () => {
  const { authUser, logout } = useAuth();
  const { closeSidebar } = useSidebar();

  const { toggleUnit, currentUnits } = useUnit();

  const logoutHandler = useCallback(async () => {
    await logout();
    closeSidebar();
  }, [logout, closeSidebar]);

  return (
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader>Hello {authUser?.name}</DrawerHeader>

      <DrawerBody>
        <Stack>
          <LinkBox as={Box}>
            <Button>
              <LinkOverlay as={NextLink} href={'/about'}>
                About
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

          <ButtonGroup isAttached>
            <Button>Grocery Lists</Button>
            <IconButton
              aria-label="Create Grocery List"
              icon={<AddIcon />}
              borderLeft={'0.5px solid teal'}
            />
          </ButtonGroup>
        </Stack>
      </DrawerBody>

      <DrawerFooter justifyContent={'center'}>
        {authUser ? (
          <Button variant="outline" onClick={logoutHandler}>
            Logout
          </Button>
        ) : null}
      </DrawerFooter>
    </DrawerContent>
  );
};

export default Sidebar;
