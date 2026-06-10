import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';
import { setUser } from '../../store/authSlice';
import Button from '../../components/ui/Button';

export default function VerifyOTP() {
  const location = useLocation();
  const email = location.state?.email || '';
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('Enter 6-digit OTP');

    setLoading(true);
    try {
      const { data } = await authAPI.verifyOTP({ email, otp });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch(setUser(data.user));
      toast.success('Email verified successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authAPI.resendOTP({ email });
      toast.success('OTP resent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center"
      >
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Verify Email</h1>
        <p className="text-slate-500 mb-8">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerify} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 shadow-xl">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            className="w-full text-center text-3xl tracking-[0.5em] font-mono px-4 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 mb-6 focus:outline-none focus:ring-2 focus:ring-primary-500"
            maxLength={6}
          />

          <Button type="submit" className="w-full mb-4" size="lg" loading={loading}>
            Verify & Activate
          </Button>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-sm text-primary-600 hover:underline disabled:opacity-50"
          >
            {resending ? 'Sending...' : 'Resend OTP'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
