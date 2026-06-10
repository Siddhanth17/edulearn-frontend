import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      toast.success('If the email exists, an OTP has been sent');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.resetPassword({ email, otp, password });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">
          {step === 1 ? 'Forgot Password' : 'Reset Password'}
        </h1>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="bg-white dark:bg-slate-800 rounded-2xl border p-8 space-y-5 shadow-xl">
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Button type="submit" className="w-full" loading={loading}>Send OTP</Button>
            <Link to="/login" className="block text-center text-sm text-primary-600 hover:underline">Back to Login</Link>
          </form>
        ) : (
          <form onSubmit={handleReset} className="bg-white dark:bg-slate-800 rounded-2xl border p-8 space-y-5 shadow-xl">
            <Input label="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} maxLength={6} required />
            <Input label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <Button type="submit" className="w-full" loading={loading}>Reset Password</Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
