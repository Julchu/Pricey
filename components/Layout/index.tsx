import { FC, ReactNode, useRef } from 'react';
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
  Flex,
  IconButton,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { CloseIcon } from '../Icons/Objects';

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const drawerButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Flex flexDirection={'column'} height={{ base: '100dvh', sm: '100vh' }} width={{ sm: '100vw' }}>
      {children}
      <Box position={'relative'}>
        <IconButton
          ref={drawerButtonRef}
          onClick={onOpen}
          icon={<CloseIcon />}
          aria-label={'Close sidepanel'}
        />
      </Box>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} finalFocusRef={drawerButtonRef}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Input placeholder="Type here..." />
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Layout;
