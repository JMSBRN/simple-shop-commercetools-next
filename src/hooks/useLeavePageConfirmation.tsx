import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const useLeavePageConfirmation = ({
  shouldStopNavigation,
  onNavigate,
  customPath,
}: {
  shouldStopNavigation: boolean;
  onNavigate?: (nextUrl: string) => void;
  customPath?: string;
}) => {
  const router = useRouter();
  const currentPath = router.asPath;
  const nextPath = useRef('');

  const killRouterEvent = useCallback(() => {
    router.events.emit('routeChangeError', '', '', { shallow: false });
  }, [router]);

  useEffect(() => {
    const onRouteChange = (url: string) => {
      if (shouldStopNavigation && url !== currentPath) {
        if (onNavigate) {
          nextPath.current = url;
          onNavigate(url);
          killRouterEvent();
        }
      }
    };

    router.events.on('routeChangeComplete', onRouteChange);

    return () => {
      router.events.off('routeChangeComplete', onRouteChange);
    };
  }, [
    currentPath,
    killRouterEvent,
    onNavigate,
    router.events,
    shouldStopNavigation,
  ]);

  const navigate = () => {
    const pathToNavigate = customPath || nextPath.current;

    router.push(pathToNavigate);
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldStopNavigation) {
        e.returnValue =
          'You have unsaved changes. Are you sure you want to leave this page?';
      }
      router.push('/test');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [router, shouldStopNavigation]);

  return navigate;
};

export default useLeavePageConfirmation;
