'use strict';
const money = value => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const PROMOS = Object.freeze({ WELCOME10: 10, FEAST20: 20 });
const TRANSITIONS = Object.freeze({ Pending: ['Preparing', 'Cancelled'], Preparing: ['Ready'], Ready: ['Served'], Served: [], Cancelled: [] });
function calculateTotals(lines, promoCode = '') {
  const subtotal = money(lines.reduce((sum, line) => sum + Number(line.unitPrice) * Number(line.quantity), 0));
  const code = String(promoCode || '').trim().toUpperCase();
  if (code && !Object.prototype.hasOwnProperty.call(PROMOS, code)) {
    const error = new Error('Invalid promo code.'); error.status = 400; throw error;
  }
  const discountPercent = PROMOS[code] || 0;
  const discount = money(subtotal * discountPercent / 100);
  const discountedSubtotal = money(Math.max(0, subtotal - discount));
  const serviceCharge = money(discountedSubtotal * 0.05);
  const tax = money(discountedSubtotal * 0.15);
  return { subtotal, discountPercent, discount, serviceCharge, tax, total: money(discountedSubtotal + serviceCharge + tax), promoCode: discountPercent ? code : '' };
}
function canTransitionStatus(current, next) { return Boolean(TRANSITIONS[current]?.includes(next)); }
module.exports = { calculateTotals, canTransitionStatus, PROMOS, TRANSITIONS };
