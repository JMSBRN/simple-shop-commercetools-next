import '../styles/Home.module.scss';
import type { AppProps } from 'next/app';
import ProgressLine from '@/components/progress-line/ProgressLine';
import { Provider } from 'react-redux';
import store from '@/store/store';

export default function App({ Component, pageProps }: AppProps) {
  return (
      <Provider store={store}>
        <ProgressLine />
        <Component {...pageProps} />
      </Provider>
  );
}
