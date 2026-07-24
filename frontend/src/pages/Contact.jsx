import { useState } from 'react';
import { useForm } from 'react-hook-form';

function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    // No backend endpoint exists for this yet — simulate submission for now
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
    reset();
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="bg-brand-light min-h-screen px-4 py-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h1 className="text-3xl font-bold text-brand-dark mb-6">Contact Us</h1>
          <p className="text-brand-dark-200 text-lg mb-6">
            Have a question or feedback? We'd love to hear from you.
          </p>

          <div className="bg-white rounded-lg shadow p-6 space-y-3">
            <div>
              <p className="text-sm text-brand-dark-300">Phone Number</p>
              <p className="text-brand-dark font-semibold">+234 813 027 5477</p>
            </div>
            <div>
              <p className="text-sm text-brand-dark-300">Email Address</p>
              <p className="text-brand-dark font-semibold">support@savora.com</p>
            </div>
            <div>
              <p className="text-sm text-brand-dark-300">Business Address</p>
              <p className="text-brand-dark font-semibold">
                No 1 Savora Avenue, Owerri, Imo State.
              </p>
            </div>
            <div>
              <p className="text-sm text-brand-dark-300">Business Hours</p>
              <p className="text-brand-dark font-semibold">
                Monday – Saturday: 8:00 AM – 9:00 PM
              </p>
              <p className="text-brand-dark font-semibold">
                Sunday: 1:00 PM – 9:00 PM
              </p>
            </div>
            <div>
              <p className="text-sm text-brand-dark-300">Customer Support</p>
              <p className="text-brand-dark font-semibold">
                Available during business hours.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-brand-dark-300 mb-2">Follow Savora</p>
            <div className="flex gap-4 text-brand-primary font-semibold">
              <a href="#" className="hover:text-brand-primary-100">Facebook</a>
              <a href="#" className="hover:text-brand-primary-100">Instagram</a>
              <a href="#" className="hover:text-brand-primary-100">X</a>
              <a href="#" className="hover:text-brand-primary-100">TikTok</a>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-brand-dark mb-4">Send us a message</h2>

          {submitted && (
            <div className="bg-brand-secondary-400 text-brand-secondary p-3 rounded-lg mb-4 text-sm">
              Message sent! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Full Name
              </label>
              <input
                type="text"
                {...register('fullName', { required: 'Full name is required' })}
                className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              {errors.fullName && (
                <p className="text-red-600 text-xs mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Email Address
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
                Phone Number <span className="text-brand-dark-300">(optional)</span>
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Subject
              </label>
              <input
                type="text"
                {...register('subject', { required: 'Subject is required' })}
                className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              {errors.subject && (
                <p className="text-red-600 text-xs mt-1">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-dark mb-1">
                Message
              </label>
              <textarea
                rows="4"
                {...register('message', { required: 'Message is required' })}
                className="w-full border border-brand-dark-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
              {errors.message && (
                <p className="text-red-600 text-xs mt-1">{errors.message.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-primary text-white py-3 rounded-lg font-semibold hover:bg-brand-primary-100 disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Contact;
