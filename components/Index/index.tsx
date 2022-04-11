import { useRouter } from 'next/router';
import { FC } from 'react';
import styles from '../../styles/Home.module.css';

// Page shown at `localhost:3000/`
const Index: FC = () => {
  const router = useRouter();
  return (
    <>
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
      </div>
    </>
  );
};

export default Index;
