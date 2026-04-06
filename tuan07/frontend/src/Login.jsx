import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setUser }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const navigate = useNavigate();

  const USER_API = import.meta.env.VITE_USER_API_URL || 'http://localhost:8081/users';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoginMode) {
      handleLogin();
    } else {
      if (password !== confirmPassword) {
        alert('Passwords do not match. Please verify your entry.');
        return;
      }
      handleRegister();
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(`${USER_API}/login`, { username, password });
      setUser(res.data);
      navigate('/');
    } catch (err) {
      alert('Authentication error. Verify your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${USER_API}/register`, { username, password, role: 'USER' });
      alert('Account allocated successfully. Please proceed to authenticate.');
      setIsLoginMode(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      alert('Allocation error. Identity may already be registered.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 p-8">
      <div className="mb-10 border-b border-slate-100 pb-8">
        <h3 className="text-2xl font-light tracking-tight text-slate-900">
          {isLoginMode ? 'Sign In.' : 'Create Account.'}
        </h3>
        <p className="text-slate-400 text-xs mt-3 uppercase tracking-widest font-medium">
          {isLoginMode ? 'Enter credentials to proceed' : 'Establish your identity'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Identity</label>
          <input 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            placeholder="Username" 
            required 
            className="w-full px-4 py-3 border-b border-slate-200 bg-transparent text-sm focus:border-slate-800 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">VerificationKey</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="••••••••" 
            required 
            className="w-full px-4 py-3 border-b border-slate-200 bg-transparent text-sm focus:border-slate-800 focus:outline-none transition-colors"
          />
        </div>
        
        {!isLoginMode && (
          <div className="animate-in slide-in-from-top-4 duration-300">
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Confirm Key</label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
              className="w-full px-4 py-3 border-b border-slate-200 bg-transparent text-sm focus:border-slate-800 focus:outline-none transition-colors"
            />
          </div>
        )}
        
        <div className="pt-6">
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm uppercase tracking-widest font-semibold py-4 rounded-md transition-colors"
          >
            {isLoading ? 'Processing' : (isLoginMode ? 'Authenticate' : 'Register')}
          </button>
        </div>

        <div className="text-center mt-8">
          <button 
            type="button" 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-slate-500 hover:text-slate-900 text-xs font-semibold uppercase tracking-widest transition-colors"
          >
            {isLoginMode ? "No account? Establish one." : "Have an account? Sign in."}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
