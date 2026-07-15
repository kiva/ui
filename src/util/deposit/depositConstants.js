// Route path for the deposit-beta (Add credit) page. Imported by the router and the
// page so the navigation target resolves to a single source of truth.
export const DEPOSIT_ROUTE = {
	BASE: '/portfolio/credit/deposit-beta',
};

// Where "Make a monthly deposit" links (the recurring auto-deposit flow), matching
// the legacy add-credit template's monthly-deposit link.
export const AUTO_DEPOSIT_ROUTE = '/auto-deposit';

// Where non-eligible (non-lender) users are pointed to make their first loan.
export const LEND_ROUTE = '/lend/filter';

// Client-side floor mirrors the legacy add-credit form's data-min-amount.
export const DEPOSIT_MIN_AMOUNT = 0.01;

// Fallback ceiling if the read model is unavailable; the server is authoritative
// (config www.basket.maxCreditDeposit, default 10000).
export const DEPOSIT_MAX_AMOUNT = 10000;
