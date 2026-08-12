import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../../services/api';
import { Lock, Eye, EyeOff, ShieldCheck, KeyRound, AlertCircle, ArrowLeft } from 'lucide-react';
import ClayButton from '../../UI/ClayButton';
import { logAudit } from '../../../utils/AuditLogger';

export const Login = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setError('Please enter the admin security password.');
      return;
    }

    setLoading(true);
    setError(null);
    logAudit('ADMIN_LOGIN_ATTEMPTED', false, 'PENDING', { component: 'Login' });

    try {
      const res = await loginAdmin(password);
      if (res.success) {
        logAudit('ADMIN_LOGIN_SUCCESS', false, true, { component: 'Login' });
        navigate('/admin/dashboard');
      } else {
        logAudit('ADMIN_LOGIN_FAILED', false, false, { component: 'Login', reason: res.error });
        setError(res.error || 'Authentication failed.');
      }
    } catch (err) {
      logAudit('ADMIN_LOGIN_FAILED', false, false, { component: 'Login', reason: err.message });
      setError(err.message || 'Invalid admin password provided.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-[#0D47A1] text-white flex items-center justify-center font-bold mx-auto shadow-md">
          <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0D47A1] font-serif">
          Admin Portal Authentication
        </h1>
        <p className="text-xs text-[#0D47A1]/80">
          Enter owner security password to access the content management system.
        </p>
      </div>

      <div className="mint-card p-6 sm:p-8 space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-[#0D47A1] uppercase tracking-wider">
              Admin Security Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-3.5 text-[#0D47A1]/50" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl border border-[#90CAF9] bg-[#E3F2FD]/50 text-[#0D47A1] placeholder-[#0D47A1]/40 focus:outline-none focus:border-[#2196F3]"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-[#0D47A1]/60 hover:text-[#2196F3] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <ClayButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
            icon={Lock}
          >
            {loading ? 'Authenticating...' : 'Authenticate Access'}
          </ClayButton>
        </form>

      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-xs text-[#0D47A1]/80 hover:text-[#2196F3] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Insights
        </button>
      </div>
    </div>
  );
};

export default Login;
