import '../styles/Home.module.scss';
import type { AppProps } from 'next/app';
import ProgressLine from '@/components/progress-line/ProgressLine';
import { Provider } from 'react-redux';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from '../../next-i18next.config';
import store from '@/store/store';

function App({ Component, pageProps }: AppProps) {
  return (
      <Provider store={store}>
        <ProgressLine />
        <Component {...pageProps} />
      </Provider>
  );
}

export default appWithTranslation(App, nextI18NextConfig);