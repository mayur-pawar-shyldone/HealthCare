import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, UserRound, X } from 'lucide-react';
import { MAX_FAMILY_MEMBERS, PRIMARY_MEMBER_ID } from '@/account/account-data';
import { useAccount } from '@/account/AccountContext';
import { readForm } from '@/account/form-utils';
import { ageFromDob, memberInitials } from '@/account/dashboard/mp-utils';
import { Input } from '@/components/ui/Input';
const RELATIONS = ['Spouse', 'Child', 'Parent', 'Other'];
export function AccountFamilyManageModal({ open, initialMode = 'list', editMemberId, onClose }) {
    const acc = useAccount();
    const [mode, setMode] = useState('list');
    const [editingId, setEditingId] = useState(null);
    useEffect(() => {
        if (!open)
            return;
        acc.setError('');
        if (initialMode === 'add') {
            setMode('add');
            setEditingId(null);
            acc.setFamilyDraft({ name: '', relation: 'Spouse', dob: '', phone: '' });
            return;
        }
        if (editMemberId) {
            const m = acc.family.find((f) => f.id === editMemberId);
            if (m) {
                setMode('edit');
                setEditingId(m.id);
                acc.setFamilyDraft({ name: m.name, relation: m.relation, dob: m.dob, phone: m.phone });
                return;
            }
        }
        setMode('list');
        setEditingId(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when dialog opens
    }, [open, initialMode, editMemberId]);
    if (!open)
        return null;
    const seatsLeft = MAX_FAMILY_MEMBERS - acc.family.length;
    const editingMember = editingId ? acc.family.find((f) => f.id === editingId) : undefined;
    const isPrimary = editingId === PRIMARY_MEMBER_ID;
    function closeModal() {
        acc.setError('');
        acc.setFamilyDraft({ name: '', relation: 'Spouse', dob: '', phone: '' });
        onClose();
    }
    function startEdit(id) {
        const m = acc.family.find((f) => f.id === id);
        if (!m)
            return;
        setEditingId(id);
        setMode('edit');
        acc.setFamilyDraft({ name: m.name, relation: m.relation, dob: m.dob, phone: m.phone });
        acc.setError('');
    }
    function startAdd() {
        if (seatsLeft <= 0) {
            acc.setError(`All ${MAX_FAMILY_MEMBERS} slots are in use. Remove a member to add another.`);
            return;
        }
        setMode('add');
        setEditingId(null);
        acc.setFamilyDraft({ name: '', relation: 'Spouse', dob: '', phone: '' });
        acc.setError('');
    }
    function submitForm(e) {
        e.preventDefault();
        const data = readForm(e.currentTarget);
        const ok = mode === 'add'
            ? acc.saveFamilyMember(data)
            : editingId
                ? acc.updateFamilyMember(editingId, data)
                : false;
        if (ok) {
            setMode('list');
            setEditingId(null);
        }
    }
    return (_jsxs("div", { className: "fixed inset-0 z-[100] flex items-center justify-center p-4", role: "dialog", "aria-modal": "true", "aria-labelledby": "family-manage-title", children: [_jsx("button", { type: "button", className: "absolute inset-0 bg-navy/55 backdrop-blur-[3px]", "aria-label": "Close", onClick: closeModal }), _jsxs(motion.div, { initial: { opacity: 0, y: 12, scale: 0.98 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] }, className: "relative flex max-h-[min(90vh,640px)] w-full max-w-[440px] flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_24px_80px_-24px_rgba(16,52,74,0.45)]", children: [_jsxs("div", { className: "flex items-start justify-between gap-3 border-b border-line px-5 py-4", children: [_jsxs("div", { children: [_jsx("p", { className: "text-[11px] font-bold uppercase tracking-wide text-mp-teal-700", children: "Card members" }), _jsx("h2", { id: "family-manage-title", className: "mt-0.5 font-display text-xl font-extrabold text-navy", children: "Manage family" }), _jsxs("p", { className: "mt-1 text-[13px] text-muted", children: ["1 primary + up to 4 others \u00B7 ", acc.family.length, "/", MAX_FAMILY_MEMBERS, " used"] })] }), _jsx("button", { type: "button", onClick: closeModal, className: "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-muted transition hover:bg-canvas hover:text-navy", children: _jsx(X, { className: "h-4 w-4", "aria-hidden": true }) })] }), _jsxs("div", { className: "min-h-0 flex-1 overflow-y-auto px-5 py-4", children: [mode === 'list' ? (_jsxs(_Fragment, { children: [_jsx("ul", { className: "space-y-2", children: acc.family.map((m) => {
                                            const age = ageFromDob(m.dob);
                                            return (_jsxs("li", { className: "flex items-center gap-3 rounded-xl border border-line bg-canvas/50 px-3 py-3", children: [_jsx("span", { className: `grid h-10 w-10 shrink-0 place-items-center rounded-full text-[13px] font-bold ${m.id === PRIMARY_MEMBER_ID ? 'bg-navy text-white' : 'bg-mp-teal-50 text-navy'}`, children: memberInitials(m.name) }), _jsxs("div", { className: "min-w-0 flex-1", children: [_jsxs("p", { className: "truncate text-sm font-semibold text-navy", children: [m.name, m.id === PRIMARY_MEMBER_ID ? (_jsx("span", { className: "ml-2 text-[10px] font-bold uppercase text-mp-teal-700", children: "Primary" })) : null] }), _jsxs("p", { className: "truncate text-[13px] text-muted", children: [m.relation, age != null ? ` · ${age} yrs` : ''] })] }), _jsx("button", { type: "button", onClick: () => startEdit(m.id), className: "shrink-0 text-[13px] font-semibold text-mp-teal-700 hover:underline", children: "Edit" })] }, m.id));
                                        }) }), seatsLeft > 0 ? (_jsxs("button", { type: "button", onClick: startAdd, className: "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-dashed border-line py-2.5 text-[13px] font-semibold text-navy transition hover:border-mp-teal hover:bg-mp-teal-50/50", children: [_jsx(Plus, { className: "h-4 w-4", "aria-hidden": true }), "Add family member"] })) : (_jsx("p", { className: "mt-3 text-center text-[13px] text-muted", children: "All family slots are full." }))] })) : (_jsxs("form", { onSubmit: submitForm, className: "space-y-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-[13px] text-muted", children: [_jsx(UserRound, { className: "h-4 w-4 text-mp-teal-700", "aria-hidden": true }), mode === 'add' ? 'New member' : `Editing ${editingMember?.name ?? 'member'}`] }), _jsx(Input, { name: "name", label: "Full name", defaultValue: acc.familyDraft.name, required: true, placeholder: "As per ID" }, `name-${mode}-${editingId}`), !isPrimary ? (_jsxs("label", { className: "block space-y-2 text-sm", children: [_jsx("span", { className: "font-semibold text-ink/80", children: "Relationship" }), _jsx("select", { name: "relation", defaultValue: acc.familyDraft.relation, className: "h-[50px] w-full rounded-2xl border border-line/80 bg-white px-4 outline-none focus:border-teal focus:ring-2 focus:ring-teal/10", children: RELATIONS.map((r) => (_jsx("option", { children: r }, r))) }, `rel-${editingId}`)] })) : (_jsx("input", { type: "hidden", name: "relation", value: "Self" })), _jsx(Input, { name: "dob", label: "Date of birth", defaultValue: acc.familyDraft.dob, required: true, placeholder: "dd-mm-yyyy" }, `dob-${mode}-${editingId}`), _jsx(Input, { name: "phone", label: "Mobile (optional)", defaultValue: acc.familyDraft.phone, inputMode: "numeric", maxLength: 10 }, `phone-${mode}-${editingId}`), acc.error ? _jsx("p", { className: "text-sm font-semibold text-brick", children: acc.error }) : null, _jsxs("div", { className: "flex flex-wrap gap-2 pt-1", children: [_jsx("button", { type: "submit", className: "rounded-full bg-navy px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-navy-600", children: mode === 'add' ? 'Save member' : 'Save changes' }), _jsx("button", { type: "button", onClick: () => {
                                                    setMode('list');
                                                    setEditingId(null);
                                                    acc.setError('');
                                                }, className: "rounded-full border border-line px-5 py-2.5 text-[13px] font-semibold text-navy hover:bg-canvas", children: "Back" }), mode === 'edit' && editingId && editingId !== PRIMARY_MEMBER_ID ? (_jsxs("button", { type: "button", onClick: () => {
                                                    if (window.confirm(`Remove ${editingMember?.name} from this card?`)) {
                                                        if (acc.removeMember(editingId)) {
                                                            setMode('list');
                                                            setEditingId(null);
                                                        }
                                                    }
                                                }, className: "ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-2.5 text-[13px] font-semibold text-brick hover:bg-mp-coral-50", children: [_jsx(Trash2, { className: "h-3.5 w-3.5", "aria-hidden": true }), "Remove"] })) : null] })] })), mode === 'list' && acc.error ? _jsx("p", { className: "mt-3 text-sm font-semibold text-brick", children: acc.error }) : null] }), mode === 'list' ? (_jsx("div", { className: "border-t border-line px-5 py-3", children: _jsx("button", { type: "button", onClick: closeModal, className: "h-11 w-full rounded-full border border-line text-[13px] font-semibold text-navy hover:bg-canvas", children: "Done" }) })) : null] })] }));
}
