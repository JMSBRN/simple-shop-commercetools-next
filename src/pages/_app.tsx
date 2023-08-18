import '../styles/Home.module.scss';
import type { AppProps } from 'next/app';
import ProgressLine from '@/components/progress-line/ProgressLine';

export default function App({ Component, pageProps }: AppProps) {
  return (
      <><ProgressLine /><Component {...pageProps} /></>
  );
}
