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
} from '@chakra-ui/react';
import { getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import useUser from '../../hooks/useUser';
import {
  Color,
  db,
  MassType,
  Unit,
  UnitCategory,
  User,
  VolumeType,
  WithDocId,
} from '../../lib/firebase/interfaces';

type PreferencesFormData = {
  units: UnitCategory;
  colorMode: 'light' | 'dark';
  displayName: string;
};

const Preferences: FC = () => {
  const { authUser, authLoading } = useAuth();
  const [{ updateUser }, userLoading] = useUser();
  const router = useRouter();

  const { setColorMode } = useColorMode();

  // IngredientForm submission
  const { setValue, handleSubmit, register } = useForm<PreferencesFormData>({
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
      await updateUser({ preferences: preferenceData, documentId: authUser?.documentId } as Partial<
        WithDocId<User>
      >);
      router.push('/');
    },
    [authUser?.documentId, router, updateUser],
  );

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

  useEffect(() => {
    if (!authUser) {
      router.replace(`/`);
    } else {
    }
  }, [authUser, router]);

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
              <Input
                placeholder={authUser?.name || 'Display name'}
                {...register('displayName', {
                  validate: async (displayName: string) => {
                    if (displayName) return await validateIsUnique(displayName);
                  },
                })}
              />
            </VStack>
          </Center>
          <HStack {...massGroup} my={'header'}>
            <Text>Mass</Text>
            <Spacer />
            {massOptions.map(value => (
              <RadioButton key={value} {...massRadioProps({ value })} />
            ))}
          </HStack>

          <Divider boxShadow={'focus'} />

          <HStack {...volumeGroup} my={'header'}>
            <Text>Volume</Text>
            <Spacer />
            {volumeOptions.map(value => (
              <RadioButton key={value} {...volumeRadioProps({ value })} />
            ))}
          </HStack>

          <Divider boxShadow={'focus'} />

          <HStack {...colorGroup} my={'header'}>
            <Text>Color mode </Text>
            <Spacer />
            {colorOptions.map(value => (
              <RadioButton key={value} {...colorRadioProps({ value })} />
            ))}
          </HStack>

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

export default Preferences;
