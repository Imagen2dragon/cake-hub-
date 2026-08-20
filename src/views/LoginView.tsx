import React, { useState, useEffect } from 'react';

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('headbaker@artisanbakes.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onLoginSuccess(email);
  };

  return (
    <div className="w-full min-h-screen h-screen bg-[#ffffff] flex select-none overflow-hidden relative">
      {/* Fullscreen Toggle Button */}
      <button
        type="button"
        onClick={toggleFullscreen}
        className="absolute top-5 right-6 z-50 px-3.5 py-2 bg-[#ffffff]/90 backdrop-blur-md hover:bg-[#f8ebe6] text-[#8b4b58] border border-[#d7c1c4] rounded-xl shadow-md transition-all flex items-center gap-2 text-[12px] font-semibold cursor-pointer"
        title="Toggle Fullscreen Mode"
      >
        <span className="material-symbols-outlined text-[18px]">
          {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
        </span>
        <span className="hidden sm:inline">{isFullscreen ? 'Exit Full Screen' : 'Full Screen'}</span>
      </button>

      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12">
        {/* Left Decorative Image Column - Full Screen Edge-to-Edge */}
        <div className="lg:col-span-5 relative hidden lg:flex flex-col justify-between p-12 lg:p-16 bg-[#8b4b58] text-white overflow-hidden h-full">
          <div className="absolute inset-0 z-0">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGDWRyQRS0S5Mgd8pPWulEt1NljrPX1PVO-81IQEQDAeSA-Zn69FfQDpX_27Eh7LXiBrZ16Mhr_sDs2m0uc1l2UWHsCE1Ft4DirAQ3C5xRszMW4lGE5ncnLs7fbd6xL8l1zJ-aSzhVFrheG2yb_wFQqPlVBJVWLg6Cw3ikVTwUdXFi5LU5vBUOxuPxXI4efqDzbnQB4ZLW7fIkK7_dMhguV6XgS31uxZtJpKRCwGY2YwjueOUa95cbDw"
              alt="Handcrafted artisan cakes and pastries"
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[36px] text-[#ffd9de]">cake</span>
              <span className="font-bold text-[28px] tracking-tight">CakeHub</span>
            </div>
            <p className="text-[13px] font-semibold text-[#ffd9de] uppercase tracking-widest mt-1">
              Artisan Bakery Management
            </p>
          </div>

          <div className="relative z-10 space-y-4 max-w-lg">
            <blockquote className="text-[24px] lg:text-[28px] font-semibold leading-relaxed italic">
              "Crafting sweet memories, one handcrafted layer at a time."
            </blockquote>
            <p className="text-[14px] opacity-85 font-medium leading-relaxed">
              Join 500+ master bakers managing orders, sales analytics, and custom recipes in full-screen productivity mode.
            </p>
          </div>
        </div>

        {/* Right Form Column - Full Screen Edge-to-Edge */}
        <div className="lg:col-span-7 p-8 lg:p-20 flex flex-col justify-center space-y-8 bg-[#ffffff] h-full overflow-y-auto">
          <div className="max-w-md w-full mx-auto">
            <div className="flex items-center gap-2 text-[#8b4b58] lg:hidden mb-4">
              <span className="material-symbols-outlined text-[28px]">cake</span>
              <span className="font-bold text-[20px]">CakeHub Admin</span>
            </div>
            <h2 className="font-bold text-[32px] lg:text-[36px] leading-tight text-[#201a18]">Welcome Back</h2>
            <p className="text-[14px] text-[#605e5a] mt-1.5">
              Please enter your details to sign in to your bakery account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5 mt-8">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#524345]">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3.5 pl-11 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[14px] text-[#201a18] focus:ring-2 focus:ring-[#d88c9a] outline-none"
                    placeholder="name@artisanbakes.com"
                  />
                  <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-[#847375] text-[20px]">
                    mail
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-[#524345]">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3.5 pl-11 pr-11 bg-[#f8ebe6] border border-[#d7c1c4] rounded-xl text-[14px] text-[#201a18] focus:ring-2 focus:ring-[#d88c9a] outline-none"
                    placeholder="••••••••••••"
                  />
                  <span className="material-symbols-outlined absolute left-3.5 top-3.5 text-[#847375] text-[20px]">
                    lock
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="material-symbols-outlined absolute right-3.5 top-3.5 text-[#847375] text-[20px] hover:text-[#8b4b58] cursor-pointer"
                  >
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[12px]">
                <label className="flex items-center gap-2 text-[#524345] cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-[#8b4b58] w-4 h-4 rounded"
                  />
                  Remember for 30 days
                </label>
                <button
                  type="button"
                  onClick={() => alert('Password reset email sent to ' + email)}
                  className="text-[#8b4b58] font-bold hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#8b4b58] text-white rounded-xl font-bold text-[14px] tracking-wider shadow-lg hover:bg-[#8b4b58]/90 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Sign In to Bakery Admin</span>
                <span className="material-symbols-outlined text-[20px]">login</span>
              </button>
            </form>

            <div className="relative flex py-6 items-center">
              <div className="flex-grow border-t border-[#d7c1c4]/40" />
              <span className="shrink-0 mx-4 text-[12px] font-semibold text-[#847375]">
                Or continue with
              </span>
              <div className="flex-grow border-t border-[#d7c1c4]/40" />
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => onLoginSuccess('google.baker@artisanbakes.com')}
                className="w-full py-3.5 bg-[#ffffff] border border-[#d7c1c4] rounded-xl font-semibold text-[13px] text-[#201a18] hover:bg-[#f8ebe6] transition-colors cursor-pointer flex items-center justify-center gap-3 shadow-2xs"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                Sign in with Google
              </button>

              <button
                type="button"
                onClick={() => onLoginSuccess('headbaker@artisanbakes.com')}
                className="w-full text-center text-[12px] font-bold text-[#8b4b58] hover:underline cursor-pointer pt-2"
              >
                ⚡ Quick Demo Login as Head Baker
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
