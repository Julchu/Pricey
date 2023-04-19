import {
  Flex,
  Container,
  Heading,
  Button,
  Divider,
  Text,
  Box,
  Center,
  useColorMode,
} from '@chakra-ui/react';
import { FC } from 'react';

const Preferences: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <Flex flexDir={'column'}>
        <Box m={'header'} h={'40px'}>
          <Center>
            <Heading>Preferences</Heading>
          </Center>
        </Box>
      </Flex>

      <Divider boxShadow={'focus'} />

      <Container>
        There are many benefits to a joint design and development system. Not only does it bring
        benefits to the design team, but it also brings benefits to engineering teams. It makes sure
        that our experiences have a consistent look and feel, not just in our design specs, but in
        production
        <Button onClick={toggleColorMode}>
          Toggle {colorMode === 'light' ? 'Dark' : 'Light'} mode
        </Button>
      </Container>
    </>
  );
};

export default Preferences;
