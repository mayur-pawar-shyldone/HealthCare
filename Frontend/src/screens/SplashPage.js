import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Logo } from '@/components/brand/Logo';
export function SplashPage() {
    const navigate = useNavigate();
    const { user, accessToken } = useSelector((s) => s.auth);
    useEffect(() => {
        const t = setTimeout(() => {
            if (user?.id && accessToken) {
                const isAdmin = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
                navigate(isAdmin ? '/admin' : '/home', { replace: true });
                return;
            }
            const seen = localStorage.getItem('hc_onboarded');
            navigate(seen ? '/' : '/onboarding', { replace: true });
        }, 1400);
        return () => clearTimeout(t);
    }, [navigate, user, accessToken]);
    return (_jsx("div", { className: "grid h-screen w-screen place-items-center bg-ink text-white", children: _jsxs(motion.div, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, className: "text-center", children: [_jsx(Logo, { variant: "full", onDark: true, className: "mx-auto" }), _jsx("p", { className: "mt-6 text-white/70", children: "Your Health. Your Tests. Your Care." })] }) }));
}
