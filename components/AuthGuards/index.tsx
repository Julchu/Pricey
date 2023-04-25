import { AbsoluteCenter, Heading, Highlight } from '@chakra-ui/react';
import { FC } from 'react';

export const AuthLoading: FC = () => {
  return (
    <AbsoluteCenter>
      <Heading as={'h1'}>Loading</Heading>
    </AbsoluteCenter>
  );
};

export const AuthUnauthorized: FC = () => {
  return (
    <AbsoluteCenter>
      <Heading as={'h1'}>Unauthorized</Heading>
    </AbsoluteCenter>
  );
};
