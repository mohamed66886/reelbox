import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // التمرير لأعلى الصفحة فوراً عند تغيير المسار
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
