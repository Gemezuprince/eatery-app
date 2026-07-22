import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../hooks/useAuth';

function Register() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setError('');
    try {
      await registerUser(data.name, data.email, data.password, data.phone, data.address);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="bg-brand-light min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-brand-dark mb-6 text-center">
          Create your Savora account
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-brand-secondary-400 text-brand-secondary p-3 rounded-lg mb-4 text-sm">
            Account created! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">
              Full Name
            </label>
            <input
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            {errors.name && (
              <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">
              Email
            </label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            {errors.email && (
              <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">
              Password
            </label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Password must be at least 6 characters' },
              })}
              className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
            {errors.password && (
              <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">
              Phone
            </label>
            <input
              type="tel"
              {...register('phone')}
              className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-dark mb-1">
              Address
            </label>
            <input
              type="text"
              {...register('address')}
              className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-brand-primary-100 disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="text-center text-sm text-brand-dark-200 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-primary font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
