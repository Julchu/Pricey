import {
  Box,
  Flex,
  Heading,
  Image,
  Grid,
  LinkBox,
  LinkOverlay,
  Icon,
  Text,
  Center,
  Container,
  Divider,
} from '@chakra-ui/react';
import { FC } from 'react';
import NextLink from 'next/link';
import { openInNewTab } from '../../lib/openLink';

type GithubUser = {
  name: string;
  link?: string;
  imageSrc?: string;
  alt?: string | '';
  width?: string | '200px';
  height?: string | '200px';
};

const contributors = [
  {
    name: 'Julian',
    link: 'https://github.com/julchu/',
    imageSrc: 'https://avatars.githubusercontent.com/u/17052350?v=4',
  },
  {
    name: 'Lili',
  },
  // {
  //   name: 'Justin',
  //   link: 'https://github.com/jktoo/',
  //   imageSrc: 'https://avatars.githubusercontent.com/u/49129827?v=4',
  // },
  {
    name: 'Ali',
    link: 'https://github.com/AliShahidGit/',
    imageSrc: 'https://avatars.githubusercontent.com/u/43257696?v=4',
  },
  {
    name: 'Christine',
    link: 'https://github.com/ChristineAu-Yeung/',
    imageSrc: 'https://avatars.githubusercontent.com/u/44853547?v=4',
  },
];

const Profile: FC<GithubUser> = ({ name, link, imageSrc, alt }) => {
  return (
    <Flex
      flexDir={'column'}
      cursor={link ? 'pointer' : 'not-allowed'}
      onClick={() => link && openInNewTab(link)}
    >
      <Center>
        <Flex flexDir={'column'}>
          <Box width={{ base: '100px', sm: '200px' }} height={{ base: '100px', sm: '200px' }}>
            {imageSrc ? (
              <Image src={imageSrc} alt={alt} borderRadius={'5px'} />
            ) : (
              // GitHub logo
              <Icon viewBox="0 0 16 16" boxSize={'auto'}>
                <path
                  fillRule="evenodd"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                />
              </Icon>
            )}
          </Box>
          <Flex flexDir={'row'}>
            <Heading as={'h3'} m={'10px auto 20px'} fontWeight={'normal'}>
              {name}
            </Heading>
          </Flex>
        </Flex>
      </Center>
    </Flex>
  );
};

const About: FC = () => {
  return (
    <>
      <Flex flexDir={'column'}>
        <Box m={{ sm: 'header' }} h={'40px'}>
          <Center>
            <Heading>About Pricey</Heading>
          </Center>
        </Box>
      </Flex>

      {/* <Divider boxShadow={'focus'} /> */}

      <Flex flexDir={'column'}>
        <Heading as={'h1'} textAlign={'center'} mt={'header'}>
          Contributors
        </Heading>

        <Grid
          mt={'header'}
          gap={{ sm: '30px' }}
          templateColumns={{
            base: '1fr 1fr',
            sm: 'repeat(auto-fit, 200px)',
          }}
          justifyContent={'center'}
        >
          {contributors.map(({ name, link, imageSrc }, index) => (
            <Profile key={`contributor_${index}`} name={name} link={link} imageSrc={imageSrc} />
          ))}
        </Grid>

        <Center>
          <Flex flexDir={'row'}>
            <LinkBox as={Box}>
              <Heading as={'h1'} textAlign={'center'}>
                GitHub&nbsp;
                <LinkOverlay as={NextLink} href={'https://github.com/julchu/Pricey'}>
                  <Icon viewBox="0 0 16 16">
                    <path
                      fillRule="evenodd"
                      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                    />
                  </Icon>
                </LinkOverlay>
              </Heading>
            </LinkBox>
          </Flex>
        </Center>
      </Flex>
    </>
  );
};

export default About;
