import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function PageHead({ title, text, action }) {
    return (_jsxs("div", { className: "page-head", children: [_jsxs("div", { children: [_jsx("h1", { children: title }), _jsx("p", { children: text })] }), action] }));
}
export function BookSteps({ n }) {
    const labels = ['Member & address', 'Date & time', 'Review', 'Confirmed'];
    return (_jsx("div", { className: "steps", children: labels.map((l, i) => (_jsxs("span", { className: i === n ? 'on' : '', children: [i + 1, ". ", l] }, l))) }));
}
