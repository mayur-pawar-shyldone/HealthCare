import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api, { unwrap } from '@/services/api';
import { formatDate } from '@/lib/utils';
import { HomeTopSection } from '@/components/home/HomeTopSection';
import { HomeExplore } from '@/components/home/SmartDashboard';
import { HomePackages } from '@/components/home/HomePackages';
import { HomeBannerSlider } from '@/components/home/HomeBannerSlider';
import { HomeHealthIdCard } from '@/components/home/HomeHealthIdCard';
import { PaymentDiscountBanner } from '@/components/brand/PaymentDiscountOffer';
import { UserPage } from '@/components/user/UserUi';
import { Loading } from '@/components/ui/Loading';
export function HomePage() {
    const user = useSelector((s) => s.auth.user);
    const navigate = useNavigate();
    const location = useLocation();
    const [params, setParams] = useSearchParams();
    const editCard = params.get('edit') === 'card';
    function scrollToCardSection() {
        window.requestAnimationFrame(() => {
            document.getElementById('healthid-card-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }
    const profileQuery = useQuery({
        queryKey: ['profile'],
        queryFn: async () => unwrap((await api.get('/users/profile')).data),
    });
    const categoriesQuery = useQuery({
        queryKey: ['categories'],
        queryFn: async () => unwrap((await api.get('/tests/categories')).data),
    });
    const popularQuery = useQuery({
        queryKey: ['tests', 'popular'],
        queryFn: async () => unwrap((await api.get('/tests', { params: { popular: 'true' } })).data),
    });
    const dashQuery = useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => unwrap((await api.get('/dashboard')).data),
    });
    useEffect(() => {
        if (params.get('edit') === 'card' || location.hash === '#healthid-card-section' || location.hash === '#card-family') {
            scrollToCardSection();
        }
    }, [params, location.hash]);
    const loading = profileQuery.isLoading || popularQuery.isLoading;
    if (loading)
        return _jsx(Loading, { label: "Loading your home" });
    const upcoming = dashQuery.data?.upcomingAppointment;
    const membership = dashQuery.data?.membership;
    const address = profileQuery.data?.addresses[0];
    const hasMembership = !!membership;
    const hasAddress = Boolean(address?.line1 && address?.pincode);
    const firstName = user.fullName.split(' ')[0];
    return (_jsxs(UserPage, { className: "space-y-8", children: [_jsx(HomeTopSection, { firstName: firstName, city: address?.city, hasMembership: hasMembership, hasAddress: hasAddress, onSearch: (q) => {
                    const value = q.trim();
                    if (!value)
                        return;
                    const recent = JSON.parse(localStorage.getItem('hc_recent_searches') || '[]');
                    localStorage.setItem('hc_recent_searches', JSON.stringify([value, ...recent.filter((x) => x !== value)].slice(0, 6)));
                    navigate(`/search?q=${encodeURIComponent(value)}`);
                }, upcoming: upcoming
                    ? {
                        testName: upcoming.test.name,
                        date: formatDate(upcoming.date),
                        time: upcoming.timeSlot,
                        href: `/appointments/${upcoming.id}`,
                    }
                    : null }), _jsx(HomeHealthIdCard, { hasMembership: hasMembership, editOpen: editCard, onEditOpen: (open) => {
                    if (open)
                        setParams({ edit: 'card' });
                    else
                        setParams({});
                }, hasAddress: hasAddress }), _jsx(PaymentDiscountBanner, {}), _jsx(HomeBannerSlider, {}), _jsx(HomePackages, {}), _jsx(HomeExplore, { categories: categoriesQuery.data ?? [], popular: popularQuery.data ?? [] })] }));
}
