import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { uploadImage } from '../utils/uploadImage';

function Profile() {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isChangingPassword },
  } = useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        const profile = response.data.data.user;
        reset({
          name: profile.name,
          phone: profile.phone || '',
          address: profile.address || '',
        });
        setImagePreview(profile.profilePicture || '');
        setProfilePictureUrl(profile.profilePicture || '');
      } catch (err) {
        setError('Could not load your profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    setError('');

    try {
      const url = await uploadImage(file);
      setProfilePictureUrl(url);
    } catch (err) {
      setError('Photo upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data) => {
    setError('');
    setSuccess(false);
    try {
      await api.patch('/users/profile', {
        name: data.name,
        phone: data.phone,
        address: data.address,
        profilePicture: profilePictureUrl,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update your profile.');
    }
  };

  const onPasswordSubmit = async (data) => {
    setPasswordError('');
    setPasswordSuccess(false);
    try {
      await api.put('/users/profile/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      setPasswordSuccess(true);
      resetPasswordForm();
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Could not change your password.');
    }
  };

  if (loading) {
    return <p className="p-8 text-brand-dark-200">Loading profile...</p>;
  }

  return (
    <div className="bg-brand-light min-h-screen px-4 py-8">
      <div className="max-w-md mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-2xl font-bold text-brand-dark mb-6">My Profile</h1>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-brand-secondary-400 text-brand-secondary p-3 rounded-lg mb-4 text-sm">
              Profile updated successfully!
            </div>
          )}

          <div className="flex flex-col items-center mb-6">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover mb-3"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-brand-light-200 flex items-center justify-center text-brand-dark-300 mb-3">
                No photo
              </div>
            )}
            <label className="text-sm font-medium text-brand-primary cursor-pointer">
              {uploading ? 'Uploading...' : 'Change Photo'}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="mb-4">
            <p className="text-sm text-brand-dark-300">Email</p>
            <p className="text-brand-dark font-semibold">{user?.email}</p>
          </div>

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
              disabled={isSubmitting || uploading}
              className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-brand-primary-100 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-xl font-bold text-brand-dark mb-6">Change Password</h2>

          {passwordError && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="bg-brand-secondary-400 text-brand-secondary p-3 rounded-lg mb-4 text-sm">
              Password changed successfully!
            </div>
          )}

          <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Current Password
              </label>
              <input
                type="password"
                {...registerPassword('currentPassword', {
                  required: 'Current password is required',
                })}
                className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              {passwordErrors.currentPassword && (
                <p className="text-red-600 text-xs mt-1">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                New Password
              </label>
              <input
                type="password"
                {...registerPassword('newPassword', {
                  required: 'New password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              {passwordErrors.newPassword && (
                <p className="text-red-600 text-xs mt-1">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isChangingPassword}
              className="w-full bg-brand-dark text-white py-3 rounded-lg font-semibold hover:bg-brand-dark-100 disabled:opacity-50"
            >
              {isChangingPassword ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Profile;
