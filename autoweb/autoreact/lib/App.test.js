import { render, screen } from '@testing-library/react';
import App from './App';
test('renders learn react link', () => {
  render( /*#__PURE__*/React.createElement(App, null));
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});