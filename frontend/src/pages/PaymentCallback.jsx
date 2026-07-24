import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference') || searchParams.get('trxref');

      if (!reference) {
        setStatus('error');
        return;
      }

      try {
        // reference looks like: order_<orderId>_<timestamp>
        const orderId = reference.split('_')[1];
        const response = await api.get(`/orders/${orderId}/verify-payment`);

        if (response.data.data.order.paymentStatus === 'paid') {
          setStatus('success');
        } else {
          setStatus('pending');
        }
      } catch (err) {
        setStatus('error');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="bg-brand-light min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow p-8 max-w-md text-center">
        {status === 'verifying' && (
          <p className="text-brand-dark-200">Verifying your payment...</p>
        )}

        {status === 'success' && (
          <>
            <p className="text-2xl mb-2">✅</p>
            <h1 className="text-xl font-bold text-brand-dark mb-2">Payment Successful</h1>
            <p className="text-brand-dark-200 mb-6">
              Your order has been paid for and is being processed.
            </p>
            <Link
              to="/my-orders"
              className="bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary-100"
            >
              View My Orders
            </Link>
          </>
        )}

        {status === 'pending' && (
          <>
            <p className="text-2xl mb-2">⏳</p>
            <h1 className="text-xl font-bold text-brand-dark mb-2">Payment Pending</h1>
            <p className="text-brand-dark-200 mb-6">
              We couldn't confirm your payment yet. If you completed payment,
              it may take a moment to reflect.
            </p>
            <Link
              to="/my-orders"
              className="bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary-100"
            >
              View My Orders
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <p className="text-2xl mb-2">⚠️</p>
            <h1 className="text-xl font-bold text-brand-dark mb-2">
              Something went wrong
            </h1>
            <p className="text-brand-dark-200 mb-6">
              We couldn't verify your payment. Please check your order status
              or contact support.
            </p>
            <Link
              to="/my-orders"
              className="bg-brand-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-primary-100"
            >
              View My Orders
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentCallback;
