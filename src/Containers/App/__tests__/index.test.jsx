import React from 'react';
import {
  render, screen,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));
jest.mock('i18next', () => ({ changeLanguage: () => null }));

test('loads and displays home', () => {
  render(<App />);
  expect(screen.getByRole('button', { name: /settings/i })).toBeInTheDocument();
  expect(screen.getByAltText(/Discord/i)).toBeInTheDocument();

  // Ensure that a warning is displayed when no web Serial is detected
  expect(screen.getByText(/is not supported on your browser/i)).toBeInTheDocument();

  // Ensure that the footer is there
  expect(screen.getByText(/statusbarPortUtilization/i)).toBeInTheDocument();
  expect(screen.getByText(/statusbarPacketError/i)).toBeInTheDocument();

  // Click the Settings
  userEvent.click(screen.getByRole('button', { name: /settings/i }));
  expect(screen.getByText(/settingsHeader/i)).toBeInTheDocument();
});
