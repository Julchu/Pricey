import { FC } from 'react';
import { GithubLogo } from '../Icons/Github';
import { Row } from '../UI/Structure';
import { Hyperlink } from './styles';

const Footer: FC = () => {
  return (
    <Row style={{ height: '40px' }}>
      <p style={{ marginTop: 'auto', marginBottom: 'auto' }}> Created by&nbsp; </p>
      <Hyperlink target="_blank" rel="noopener noreferrer" href="https://github.com/julchu/">
        <GithubLogo />
      </Hyperlink>
      <Hyperlink target="_blank" rel="noopener noreferrer" href="https://github.com/jktoo/">
        <GithubLogo />
      </Hyperlink>
      <Hyperlink target="_blank" rel="noopener noreferrer" href="https://github.com/AliShahidGit/">
        <GithubLogo />
      </Hyperlink>
      <Hyperlink
        target="_blank"
        rel="noopener noreferrer"
        href="https://github.com/ChristineAu-Yeung/"
      >
        <GithubLogo />
      </Hyperlink>
    </Row>
  );
};

export default Footer;
