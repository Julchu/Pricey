import { Flex, Container, Heading, Button } from '@chakra-ui/react';
import { FC } from 'react';

const Preferences: FC = () => {
  return (
    <Flex>
      <Container my={'20px'}>
        <Heading>Preferences</Heading>
        There are many benefits to a joint design and development system. Not only does it bring
        benefits to the design team, but it also brings benefits to engineering teams. It makes sure
        that our experiences have a consistent look and feel, not just in our design specs, but in
        production
      </Container>

      <Button variant={'cheese'}>Cheese</Button>
    </Flex>
  );
};

export default Preferences;
