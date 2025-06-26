import { useEffect, useRef } from 'react';

export default function useDetectDevTools(onOpen, onClose) {
  const isOpen = useRef(false);

  useEffect(() => {
    const detect = () => {
      const zoomRatio = window.devicePixelRatio || 1;

      // Điều chỉnh threshold theo zoom
      const adjustedThreshold = 160;

      const openedBySize =
        (window.outerHeight/window.devicePixelRatio - window.innerHeight) > adjustedThreshold/window.devicePixelRatio ||
        (window.outerWidth/window.devicePixelRatio - window.innerWidth) > adjustedThreshold/window.devicePixelRatio;

      // let openedByConsole = false;
      // const el = new Image();
      // Object.defineProperty(el, 'id', {
      //   get() {
      //     openedByConsole = true;
      //   },
      // });
      // console.log('%c', el);

      // const opened = openedBySize || openedByConsole;
      const opened = openedBySize;


      if (opened && !isOpen.current) {
        isOpen.current = true;
        onOpen?.();
      } else if (!opened && isOpen.current) {
        isOpen.current = false;
        onClose?.();
      }
    };

    const interval = setInterval(detect, 1000);
    return () => clearInterval(interval);
  }, [onOpen, onClose]);
}
