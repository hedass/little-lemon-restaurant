import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Handle hash fragment scrolling
      setTimeout(() => {
        const element = document.getElementById(hash.slice(1));
        if (element) {
          element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100); // Small delay to ensure DOM is ready
    } else {
      // Only scroll to top for path changes without hash
      try {
        window.scrollTo({ top: 0, left: 0 });
      } catch (err) {
        // ignore in non-browser environments
      }
    }
  }, [pathname, hash]);

  return null;
}
