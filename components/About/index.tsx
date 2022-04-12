import { FC } from 'react';
import { openInNewTab } from '../../functions/openLink';
import { GithubLogo } from '../Icons/Github';
import { Hyperlink } from '../UI/Buttons';
import { Row } from '../UI/Structure';
import { ProfileGrid, ProfilePicture, ProfileWrapper } from './styles';

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
    name: 'Justin',
    link: 'https://github.com/jktoo/',
    imageSrc: 'https://avatars.githubusercontent.com/u/49129827?v=4',
  },
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

const Profile: FC<GithubUser> = ({ name, link, imageSrc, alt, width, height }) => {
  return (
    <ProfileWrapper
      style={{ width, cursor: link ? 'pointer' : 'not-allowed' }}
      onClick={() => link && openInNewTab(link)}
    >
      <Row>
        {imageSrc ? (
          <ProfilePicture src={imageSrc} alt={alt} width={width} height={height} />
        ) : (
          <GithubLogo style={{ width, height }} />
        )}
      </Row>
      <Row>
        <h3 style={{ margin: '10px auto 20px', fontWeight: 'normal' }}>{name}</h3>
      </Row>
    </ProfileWrapper>
  );
};

// Nav bar
const About: FC = () => {
  return (
    <>
      <Row style={{ justifyContent: 'center' }}>
        <h1 style={{ fontSize: '4rem', lineHeight: '1.15px' }}>
          Welcome to <Hyperlink href="https://github.com/julchu/Pricey">Pricey!</Hyperlink>
        </h1>
      </Row>

      {/* <p className={styles.description} style={{ marginBottom: '0px' }}>
        Template code to learn React available at{' '}
        <code className={styles.code}>pages/template.tsx</code>
      </p>

      <p className={styles.description}>
        View live template code at&nbsp;
        <code
          className={styles.code}
          onClick={() => router.push('/template')}
          style={{ cursor: 'pointer' }}
        >
          /template
        </code>
      </p> */}

      {/* style={{ marginLeft: 'auto', marginRight: 'auto' }} */}
      <Row style={{ justifyContent: 'center' }}>Contributors</Row>

      {/* TODO: clean up redundent CSS for centering grid */}
      <div
        style={{
          paddingLeft: '100px',
          paddingRight: '100px',
        }}
      >
        <ProfileGrid>
          <>
            {contributors.map(({ name, link, imageSrc }, index) => (
              <Profile
                key={`contributor_${index}`}
                name={name}
                link={link}
                imageSrc={imageSrc}
                width="200px"
                height="200px"
              />
            ))}
          </>
        </ProfileGrid>
      </div>
    </>
  );
};

export default About;
