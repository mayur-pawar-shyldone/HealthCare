import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle2, Clock, Layers } from 'lucide-react';
import api, { unwrap } from '@/services/api';
import { packageIncludedTests } from '@/lib/packages';
import { testMemberPrice } from '@/lib/catalog';
import { formatMoney } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { UserPage } from '@/components/user/UserUi';
import { PaymentDiscountBadge, PaymentDiscountCardNote } from '@/components/brand/PaymentDiscountOffer';
export function TestDetailsPage() {
    const { id } = useParams();
    const q = useQuery({
        queryKey: ['test', id],
        queryFn: async () => unwrap((await api.get(`/tests/${id}`)).data),
        staleTime: 0,
        refetchOnMount: 'always',
    });
    if (q.isLoading || !q.data)
        return _jsx(Loading, {});
    const t = q.data;
    const memberPrice = testMemberPrice(t);
    const displayMrp = t.price;
    const includedNames = t.isPackage ? packageIncludedTests(t) : [];
    const included = t.packageTests?.map((pt) => pt.includedTest) ??
        (t.isPackage ? includedNames.map((name, i) => ({ id: `${t.id}-${i}`, name, slug: '' })) : []);
    return (_jsx(UserPage, { children: _jsxs("div", { className: "grid gap-6 lg:grid-cols-[1.4fr_0.8fr]", children: [_jsxs("div", { className: "space-y-5", children: [_jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx(Badge, { children: t.category.name }), t.isPackage ? _jsx(Badge, { tone: "teal", children: `Health package · ${included.length} tests` }) : null, t.isPopular ? _jsx(Badge, { tone: "sand", children: "Popular" }) : null, t.membershipFree ? _jsx(Badge, { tone: "success", children: "Free for members" }) : null, _jsx(PaymentDiscountBadge, { size: "sm" })] }), _jsx("h1", { className: "font-display text-4xl", children: t.name }), _jsx("p", { className: "text-ink-soft", children: t.description }), t.isPackage && included.length > 0 ? (_jsxs(Card, { className: "p-5", children: [_jsxs("h2", { className: "flex items-center gap-2 font-display text-xl", children: [_jsx(Layers, { className: "h-5 w-5 text-teal" }), "Tests included in this package"] }), _jsx("ul", { className: "mt-4 space-y-2", children: included.map((item) => (_jsxs("li", { className: "flex items-start gap-2 rounded-xl bg-teal-light/40 px-4 py-3 text-sm", children: [_jsx(CheckCircle2, { className: "mt-0.5 h-4 w-4 shrink-0 text-teal" }), _jsx("span", { children: item.name })] }, item.id))) })] })) : null, _jsxs(Card, { className: "p-5", children: [_jsx("h2", { className: "font-display text-xl", children: "Preparation" }), _jsx("p", { className: "mt-2 text-ink-soft", children: t.preparation })] }), !t.isPackage ? (_jsxs(Card, { className: "p-5", children: [_jsx("h2", { className: "font-display text-xl", children: "Parameters included" }), _jsx("ul", { className: "mt-3 grid gap-2 md:grid-cols-2", children: t.parameters.map((p) => (_jsx("li", { className: "rounded-2xl bg-cream px-3 py-2 text-sm", children: p.name }, p.id))) })] })) : null, t.faqs?.length ? (_jsxs(Card, { className: "space-y-3 p-5", children: [_jsx("h2", { className: "font-display text-xl", children: "FAQs" }), t.faqs.map((f) => (_jsxs("div", { children: [_jsx("p", { className: "font-medium", children: f.q }), _jsx("p", { className: "text-sm text-ink-soft", children: f.a })] }, f.q)))] })) : null] }), _jsxs(Card, { className: "h-fit p-6", children: [_jsxs("p", { className: "text-sm text-ink-soft", children: ["Sample \u00B7 ", t.sampleType] }), _jsxs("p", { className: "mt-1 flex items-center gap-1.5 text-sm text-ink-soft", children: [_jsx(Clock, { className: "h-4 w-4" }), " Report in ~", t.reportHours, " hours"] }), _jsxs("div", { className: "mt-4 flex items-end gap-2", children: [_jsx("span", { className: "text-3xl font-semibold text-teal", children: formatMoney(Number(memberPrice)) }), Number(memberPrice) < Number(displayMrp) ? (_jsx("span", { className: "text-ink-soft line-through", children: formatMoney(Number(displayMrp)) })) : null] }), t.membershipFree ? (_jsx("p", { className: "mt-2 text-sm text-ink-soft", children: "Included free with your HealthID Card" })) : (_jsx(PaymentDiscountCardNote, { specialPrice: Number(memberPrice) })), _jsx(Link, { to: `/appointments/book?testId=${t.id}`, children: _jsx(Button, { className: "mt-6 w-full rounded-xl", size: "lg", children: t.isPackage ? 'Book this package' : 'Book this test' }) })] })] }) }));
}
