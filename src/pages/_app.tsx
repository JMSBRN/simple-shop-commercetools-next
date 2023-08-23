import '../styles/Home.css';
import type { AppProps } from 'next/app';
import Layout from '@/components/layout/Layout';
import ProgressLine from '@/components/progress-line/ProgressLine';
import { Provider } from 'react-redux';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../../next-i18next.config';
import store from '@/store/store';

function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ProgressLine />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}

export default appWithTranslation(App, nextI18NextConfig);
