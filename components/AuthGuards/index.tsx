import { AbsoluteCenter, Heading } from '@chakra-ui/react';
import { FC } from 'react';

export const AuthLoading: FC = () => {
  return (
    <AbsoluteCenter>
      <Heading as={'h1'}>Loading</Heading>
    </AbsoluteCenter>
  );
};

export const Unauthorized: FC = () => {
  return (
    <AbsoluteCenter>
      <Heading as={'h1'}>Unauthorized</Heading>
    </AbsoluteCenter>
  );
};
