import '../styles/Home.module.scss';
import type { AppProps } from 'next/app';
import { I18nextProvider } from 'react-i18next';
import ProgressLine from '@/components/progress-line/ProgressLine';
import i18n from '../../i18n';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <ProgressLine />
      <Component {...pageProps} />
    </I18nextProvider>
  );
}
