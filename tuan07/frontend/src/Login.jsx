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

  const USER_API = import.meta.env.VITE_USER_API_URL || 'http://192.168.137.235:8081/users';

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
      // Redirect admin to admin dashboard, regular users to menu
      if (res.data.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      alert('Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    try {
      await axios.post(`${USER_API}/register`, { username, password, role: 'USER' });
      alert('Tạo tài khoản thành công! Vui lòng đăng nhập.');
      setIsLoginMode(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      alert('Lỗi đăng ký. Tài khoản này có thể đã tồn tại.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16 p-8">
      <div className="mb-10 border-b border-slate-100 pb-8">
        <h3 className="text-2xl font-light tracking-tight text-slate-900">
          {isLoginMode ? 'Đăng Nhập.' : 'Tạo Tài Khoản.'}
        </h3>
        <p className="text-slate-400 text-xs mt-3 uppercase tracking-widest font-medium">
          {isLoginMode ? 'Nhập thông tin để tiếp tục' : 'Bắt đầu sử dụng hệ thống'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Tên Đăng Nhập</label>
          <input 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            placeholder="Nhập tên đăng nhập" 
            required 
            className="w-full px-4 py-3 border-b border-slate-200 bg-transparent text-sm focus:border-slate-800 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Mật Khẩu</label>
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
            <label className="block text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">Xác Nhận Mật Khẩu</label>
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
            className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm uppercase tracking-widest font-semibold py-4 rounded-md transition-colors shadow-sm"
          >
            {isLoading ? 'Đang xử lý...' : (isLoginMode ? 'Vào Hệ Thống' : 'Đăng Ký Ngay')}
          </button>
        </div>

        <div className="text-center mt-8">
          <button 
            type="button" 
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-slate-500 hover:text-slate-900 text-xs font-semibold uppercase tracking-widest transition-colors"
          >
            {isLoginMode ? "Chưa có tài khoản? Đăng ký ngay." : "Đã có tài khoản? Quay về đăng nhập."}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;
