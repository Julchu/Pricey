import {
  Flex,
  Container,
  Heading,
  Button,
  Box,
  Center,
  useColorMode,
  useRadioGroup,
  useRadio,
  UseRadioProps,
  HStack,
  Divider,
  Text,
  Spacer,
  Avatar,
  Input,
  VStack,
  useToast,
  CloseButton,
  UseToastOptions,
  Skeleton,
} from '@chakra-ui/react';
import { getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuthContext } from '../../hooks/useAuthContext';
import useUserHook from '../../hooks/useUserHook';
import {
  Color,
  db,
  MassType,
  Unit,
  UnitCategory,
  User,
  VolumeType,
} from '../../lib/firebase/interfaces';

type PreferencesFormData = {
  units: UnitCategory;
  colorMode: 'light' | 'dark';
  displayName: string;
};

const Preferences: FC = () => {
  const { authUser, authLoading } = useAuthContext();
  const [{ updateUser }, userLoading] = useUserHook();
  const { setColorMode } = useColorMode();
  const router = useRouter();
  const toast = useToast();

  // Preferences ReactHookForm
  const {
    setValue,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<PreferencesFormData>({
    defaultValues: {
      units: {
        mass: authUser?.preferences?.units?.mass || Unit.kilogram,
        volume: authUser?.preferences?.units?.volume || Unit.litre,
      },
      colorMode: authUser?.preferences?.colorMode || 'dark',
      displayName: authUser?.preferences?.displayName || '',
    },
  });

  const validateIsUnique = async (displayName: string): Promise<boolean> => {
    const q = query(db.userCollection, where('preferences.displayName', '==', displayName));
    return (await getDocs(q)).size === 0;
  };

  const onSubmitHandler = useCallback(
    async (preferenceData: PreferencesFormData) => {
      await updateUser({ preferences: preferenceData } as Partial<User>);

      if (!toast.isActive('preferencesSaved'))
        toast({
          title: 'Preferences saved',
          description: "We've saved your user preferences",
          status: 'success',
          duration: 5000,
          isClosable: true,
          id: 'preferencesSaved',
          variant: 'info',
          // render: props => CustomToast(props),
          containerStyle: { letterSpacing: '2px' },
        });

      router.push('/');
    },
    [router, toast, updateUser],
  );

  // Custom Radio Group buttons
  const { getRootProps: massRootProps, getRadioProps: massRadioProps } = useRadioGroup({
    name: 'massPreferences',
    defaultValue: authUser?.preferences?.units?.mass || Unit.kilogram,
    onChange: selectedOption => setValue('units.mass', selectedOption as MassType),
  });

  const { getRootProps: volumeRootProps, getRadioProps: volumeRadioProps } = useRadioGroup({
    name: 'volumePreferences',
    defaultValue: authUser?.preferences?.units?.volume || Unit.litre,
    onChange: selectedOption => setValue('units.volume', selectedOption as VolumeType),
  });

  const { getRootProps: colorRootProps, getRadioProps: colorRadioProps } = useRadioGroup({
    name: 'colorPreferences',
    defaultValue: authUser?.preferences?.colorMode || Color.light,
    onChange: selectedOption => {
      setValue('colorMode', selectedOption as Color);
      setColorMode(selectedOption);
    },
  });

  const massOptions = [Unit.kilogram, Unit.pound];
  const volumeOptions = [Unit.litre, Unit.quart];
  const colorOptions = [Color.dark, Color.light];

  const massGroup = massRootProps();
  const volumeGroup = volumeRootProps();
  const colorGroup = colorRootProps();

  // Setting displayName input if page is refreshed
  useEffect(() => {
    setValue('displayName', authUser?.preferences?.displayName || '');
  }, [authUser?.preferences?.displayName, setValue]);

  return (
    <>
      <Flex flexDir={'column'}>
        <Box m={'header'} h={'40px'}>
          <Center>
            <Heading>Preferences</Heading>
          </Center>
        </Box>
      </Flex>

      <form>
        <Container p={{ base: '30px', sm: 'unset' }}>
          <Center>
            <VStack my={'header'} spacing={4}>
              <Avatar name={authUser?.name} size={'lg'} />

              <Skeleton isLoaded={authUser?.preferences && !authLoading}>
                <Input
                  isInvalid={errors.displayName?.type === 'validate'}
                  placeholder={
                    authUser?.preferences?.displayName || authUser?.name || 'Display name'
                  }
                  {...register('displayName', {
                    validate: async (displayName: string) => {
                      if (displayName !== authUser?.preferences?.displayName)
                        return await validateIsUnique(displayName);
                    },
                  })}
                />
              </Skeleton>
            </VStack>
          </Center>

          <Skeleton isLoaded={authUser && !authLoading}>
            <HStack {...massGroup} my={'header'}>
              <Text>Mass</Text>
              <Spacer />
              {massOptions.map(value => (
                <RadioButton key={value} {...massRadioProps({ value })} />
              ))}
            </HStack>
          </Skeleton>

          <Divider boxShadow={'focus'} />

          <Skeleton isLoaded={authUser && !authLoading}>
            <HStack {...volumeGroup} my={'header'}>
              <Text>Volume</Text>
              <Spacer />
              {volumeOptions.map(value => (
                <RadioButton key={value} {...volumeRadioProps({ value })} />
              ))}
            </HStack>
          </Skeleton>

          <Divider boxShadow={'focus'} />

          <Skeleton isLoaded={authUser && !authLoading}>
            <HStack {...colorGroup} my={'header'}>
              <Text>Color mode </Text>
              <Spacer />
              {colorOptions.map(value => (
                <RadioButton key={value} {...colorRadioProps({ value })} />
              ))}
            </HStack>
          </Skeleton>

          <Divider boxShadow={'focus'} />

          <Center>
            <HStack my={'header'}>
              <Button
                isLoading={userLoading || authLoading}
                onClick={handleSubmit(onSubmitHandler)}
              >
                Save Preferences
              </Button>
            </HStack>
          </Center>
        </Container>
      </form>
    </>
  );
};

const RadioButton: FC<UseRadioProps> = props => {
  const { getInputProps, getCheckboxProps } = useRadio(props);

  const input = getInputProps();
  const checkbox = getCheckboxProps();

  return (
    <Box as="label">
      <input {...input} />
      <Box
        {...checkbox}
        cursor="pointer"
        borderWidth="1px"
        borderRadius="5px"
        border={'none'}
        boxShadow="normal"
        letterSpacing={'2px'}
        _checked={{
          bg: 'lightcoral',
        }}
        _hover={{ boxShadow: 'hover' }}
        _focus={{ boxShadow: 'focus' }}
        transition={'0.2s ease-in-out'}
        px={5}
        py={3}
      >
        {props.value}
      </Box>
    </Box>
  );
};

const CustomToast: FC<UseToastOptions & { onClose: () => void }> = ({
  title,
  description,
  onClose,
}) => {
  return (
    <Box
      letterSpacing={'2px'}
      border={'none'}
      outline={'none'}
      borderRadius={'5px'}
      boxShadow={'normal'}
      transition={'box-shadow 0.2s ease-in-out'}
      _hover={{ boxShadow: 'hover' }}
      _focus={{ boxShadow: 'focus' }}
      fontWeight={'medium'}
      // height={'40px'}
      padding={'auto'}
    >
      <Center>
        <Text>{title}</Text>
        <Text>{description}</Text>
        <CloseButton onClick={() => onClose()} />
      </Center>
    </Box>
  );
};

export default Preferences;
