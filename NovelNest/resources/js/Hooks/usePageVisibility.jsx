import { useEffect } from 'react';

export default function useWindowInactive(onInactive, onActive) {
  useEffect(() => {
    // const handleVisibilityChange = () => {
    //   if (document.visibilityState === 'hidden') {
    //     onInactive?.();
    //   } else {
    //     onActive?.();
    //   }
    // };

    const handleBlur = () => {
      onInactive?.();
    };

    const handleFocus = () => {
      onActive?.();
    };

    // document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);
    window.addEventListener('focus', handleFocus);

    return () => {
      // document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      window.removeEventListener('focus', handleFocus);
    };
  }, [onInactive, onActive]);
}
