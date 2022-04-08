import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { GithubLogo } from '../components/Icons/Github';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Pricey</title>
        <meta name="description" content="Tracking overpriced shopping" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Welcome to <a href="https://github.com/julchu/Pricey">Pricey!</a>
          </h1>

          <p className={styles.description} style={{ marginBottom: '0px' }}>
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
          </p>
        </main>

        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Created by&nbsp;
            <GithubLogo onClick={() => router.push('https://github.com/julchu/')} />
            <GithubLogo onClick={() => router.push('https://github.com/jktoo/')} />
            <GithubLogo onClick={() => router.push('https://github.com/AliShahidGit/')} />
            <GithubLogo onClick={() => router.push('https://github.com/ChristineAu-Yeung/')} />
          </a>
        </footer>
      </div>
    </>
  );
};

export default Home;
