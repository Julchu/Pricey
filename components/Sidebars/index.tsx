import {
  Text,
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
  Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { FC, useCallback, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { SidebarEnums, SidebarTypes, useSidebar } from '../../hooks/useSidebar';
import { useUnit } from '../../hooks/useUnit';
import { CloseIcon } from '../Icons/Objects';

/* { label: 'Pricey', path: '/' },
    { label: 'About Us', path: '/about/' },
    { label: 'Functions', path: '/functions/' }, */

const Sidebar: FC = () => {
  const { isSidebarOpen, openSidebar, closeSidebar, toggleSidebar, panelId } = useSidebar();

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

  const { currentUnits, toggleUnit } = useUnit();

  useEffect(() => {
    console.log(currentUnits);
  }, [currentUnits]);

  const logoutHandler = useCallback(async () => {
    await logout();
    closeSidebar();
  }, [logout, closeSidebar]);

  return (
    <DrawerContent>
      <DrawerCloseButton />
      <DrawerHeader>Hello {authUser?.name}</DrawerHeader>

      <DrawerBody>
        <Link as={NextLink} href={'/about'}>
          About
        </Link>
        <Text>Current Units: {JSON.stringify(currentUnits)}</Text>
        <Box marginBottom={'auto'} marginLeft={'auto'}>
          <IconButton onClick={toggleUnit} icon={<CloseIcon />} aria-label={'Close sidepanel'} />
        </Box>
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
