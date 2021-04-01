import React from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';

import Number from '../';

jest.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key) => key }) }));

test('loads and displays Number', () => {

  const onChange = jest.fn();

  render(
    <Number
      label="test"
      name="test"
      onChange={onChange}
    />
  );

  expect(screen.getByText(/test/i)).toBeInTheDocument();

  fireEvent.change(screen.getByRole(/spinbutton/i), {
    target: {
      value: 1250,
      name: 'test'
    },
  });
  fireEvent.blur(screen.getByRole(/spinbutton/i));

  fireEvent.change(screen.getByRole(/spinbutton/i), {
    target: {
      value: -10,
      name: 'test'
    },
  });
  fireEvent.blur(screen.getByRole(/spinbutton/i));

  fireEvent.change(screen.getByRole(/spinbutton/i), {
    target: {
      value: 'Nan',
      name: 'test'
    },
  });
  fireEvent.blur(screen.getByRole(/spinbutton/i));
});

test('out of sync', () => {
  const onChange = jest.fn();

  render(
    <Number
      inSync={false}
      label="test"
      name="test"
      onChange={onChange}
    />
  );

  expect(screen.getByText(/test/i)).toBeInTheDocument();

  fireEvent.change(screen.getByRole(/spinbutton/i), {
    target: {
      value: 1250,
      name: 'test'
    },
  });
  fireEvent.blur(screen.getByRole(/spinbutton/i));

  fireEvent.change(screen.getByRole(/spinbutton/i), {
    target: {
      value: -10,
      name: 'test'
    },
  });
  fireEvent.blur(screen.getByRole(/spinbutton/i));

  fireEvent.change(screen.getByRole(/spinbutton/i), {
    target: {
      value: 'Nan',
      name: 'test'
    },
  });
  fireEvent.blur(screen.getByRole(/spinbutton/i));
});
