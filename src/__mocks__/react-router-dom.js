// Mock for react-router-dom to fix module resolution issues
const React = require('react');

module.exports = {
  Link: ({ children, to, ...props }) => {
    return React.createElement('a', { href: to, ...props }, children);
  },
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => {
    // Only render the first child (simulates route matching)
    const childArray = React.Children.toArray(children);
    return childArray.length > 0 ? childArray[0] : null;
  },
  Route: ({ element, path }) => {
    // Only render if this is the home route or no path specified
    if (!path || path === '/' || path === '*') {
      return element || null;
    }
    return null;
  },
};
