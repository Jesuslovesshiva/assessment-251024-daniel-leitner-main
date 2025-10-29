import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserForm } from '../../src/components/user-form';
import type { UserResponse } from '@assessment/schemas';

const mockUser: UserResponse = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  profile: {
    id: 'profile-1',
    userId: '1',
    bio: 'Seasoned engineer',
    position: 'Senior Developer',
    department: 'Engineering',
    linkedinUrl: 'https://www.linkedin.com/in/johndoe',
    gravatarUrl: 'https://www.gravatar.com/avatar/test?d=identicon',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

describe('UserForm', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    return ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it('renders user form with initial values', () => {
    render(<UserForm user={mockUser} />, { wrapper: createWrapper() });

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const bioInput = screen.getByLabelText(/bio/i);
    const positionInput = screen.getByLabelText(/position/i);
    const departmentInput = screen.getByLabelText(/department/i);
    const linkedinInput = screen.getByLabelText(/linkedin url/i);

    expect(nameInput).toHaveValue(mockUser.name);
    expect(emailInput).toHaveValue(mockUser.email);
    expect(bioInput).toHaveValue(mockUser.profile?.bio);
    expect(positionInput).toHaveValue(mockUser.profile?.position);
    expect(departmentInput).toHaveValue(mockUser.profile?.department);
    expect(linkedinInput).toHaveValue(mockUser.profile?.linkedinUrl);
  });

  it('allows editing form fields', async () => {
    const user = userEvent.setup();
    render(<UserForm user={mockUser} />, { wrapper: createWrapper() });

    const nameInput = screen.getByLabelText(/name/i);

    await user.clear(nameInput);
    await user.type(nameInput, 'Jane Doe');

    expect(nameInput).toHaveValue('Jane Doe');
  });

  it('displays validation error for invalid email', async () => {
    const user = userEvent.setup();
    render(<UserForm user={mockUser} />, { wrapper: createWrapper() });

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /update user/i });

    await user.clear(emailInput);
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);

    expect(await screen.findByText(/email must be a valid email address/i)).toBeInTheDocument();
  });

  it('shows update button', () => {
    render(<UserForm user={mockUser} />, { wrapper: createWrapper() });

    const submitButton = screen.getByRole('button', { name: /update user/i });
    expect(submitButton).toBeInTheDocument();
  });
});
