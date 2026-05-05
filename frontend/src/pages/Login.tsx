import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import { AuthLayout } from '../layouts';
import { Button, Input, Alert } from '../components/ui';
import { ROUTES } from '../constants';
import { getApiErrorMessage } from '../utils';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(ROUTES.STUDENTS);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <Alert type="error" message={error} />

        <div className="space-y-4">
          <Input
            label="Email"
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@school.com"
          />

          <Input
            label="Password"
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
          />
        </div>

        <Button type="submit" isLoading={isLoading} className="w-full">
          Sign in
        </Button>

        <div className="text-center text-sm text-gray-500 space-y-1">
          <p className="font-medium">Test accounts:</p>
          <p>Admin: admin@school.com / password</p>
          <p>Staff: staff@school.com / password</p>
        </div>
      </form>
    </AuthLayout>
  );
}
