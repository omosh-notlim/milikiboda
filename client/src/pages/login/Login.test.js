import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthContext } from '../../context/AuthContext';
import Login from './Login';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios', () => ({
  __esModule:true,

  default: {
    post: jest.fn()
  },
}));

const renderWithContext = (context) => {
  return render(
    <Router>
      <AuthContext.Provider value={context}>
        <Login />
      </AuthContext.Provider>
    </Router>
  );
};

describe('Login Component', () => {
  const initialContext = {
    loading: false,
    error: null,
    dispatch: axios.post,
  };

  test('email input should be rendered', () => {
    renderWithContext(initialContext);
    const emailInput = screen.getByPlaceholderText(/email/i);
    expect(emailInput).toBeInTheDocument();
  });

  test('password input should be rendered', () => {
    renderWithContext(initialContext);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    expect(passwordInput).toBeInTheDocument();
  });

  test('button should be rendered', () => {
    renderWithContext(initialContext);
    const button = screen.getByRole('button', { name: /login/i });
    expect(button).toBeInTheDocument();
  });

  test('inputs should update on change', () => {
    renderWithContext(initialContext);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    expect(emailInput.value).toBe('test@example.com');

    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(passwordInput.value).toBe('password123');
  });

  test('should show error message when login fails', async () => {
    const errorContext = {
      ...initialContext,
      error: { message: 'Invalid credentials' },
    };
    renderWithContext(errorContext);

    const errorMessage = screen.getByText(/invalid credentials/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('should dispatch login actions and navigate on successful login', async () => {
    axios.post.mockResolvedValue({ data: { user: 'test user' } });

    const { getByPlaceholderText, getByRole } = renderWithContext(initialContext);

    const emailInput = getByPlaceholderText(/email/i);
    const passwordInput = getByPlaceholderText(/password/i);
    const button = getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(button);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith({ type: 'LOGIN_START' });
      expect(axios.post).toHaveBeenCalledWith({ type: 'LOGIN_SUCCESS', payload: { user: 'test user' } });
    });
  });
});
