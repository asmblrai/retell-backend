// Payment method for Retell
export function normalizePayment(pm = {}) {
  const TYPE = pm.PAYMENTTYPE || pm.paymentType;
  return {
    type: TYPE || null,                                 // CC | ACH | List_Bill
    brand: TYPE === "CC" ? (pm.CCTYPE || pm.ccType || null) : null,
    last4: TYPE === "CC" ? (pm.CCLAST4 || pm.ccLast4 || null)
         : (pm.ACHACCOUNTLAST4 || pm.achAccountLast4 || null),
    bin: pm.CCBIN || pm.ccBin || null,
    exp_month: TYPE === "CC" ? num(pm.CCEXPMONTH || pm.ccExpMonth) : null,
    exp_year:  TYPE === "CC" ? num(pm.CCEXPYEAR  || pm.ccExpYear ) : null,
    ach: TYPE === "ACH" ? {
      routing: pm.ACHROUTING ? `***-${String(pm.ACHROUTING).slice(-4)}` : null,
      account_type: pm.ACHACCOUNTTYPE === "S" ? "Savings" :
                    pm.ACHACCOUNTTYPE === "C" ? "Checking" : null
    } : null,
    billing_address: {
      first_name: pm.FIRSTNAME || pm.firstName || null,
      last_name:  pm.LASTNAME  || pm.lastName  || null,
      address:    pm.ADDRESS   || pm.address   || null,
      city:       pm.CITY      || pm.city      || null,
      state:      pm.STATE     || pm.state     || null,
      zip:        pm.ZIPCODE   || pm.zipcode   || null
    }
  };
}

export function normalizeDependents(deps = []) {
  return deps.map(d => ({
    dependent_id: d.depid || d.depid || null,
    name: [d.firstname, d.lastname].filter(Boolean).join(" ") || null,
    first_name: d.firstname || null,
    last_name: d.lastname || null,
    dob: d.dob || null,
    relationship: d.relationship || null
  }));
}

export function normalizeProducts(products = []) {
  return products.map(p => ({
    pdid: p.pdid || null,
    upid: p.upid || null,
    policy_number: p.policynumber || null,
    label: p.label || null,
    effective_date: p.dteffective || null,
    renewal_date: p.dtrenewal || null,
    recurring_date: p.dtrecurring || null,
    first_billing_date: p.dtbilling || null,
    status_hold: strToBool(p.bhold),
    status_paid: strToBool(p.bpaid),
    shipping: {
      fulfilled_at: p.dtfulfillment || null,
      shipped_at: p.dtshippingdate || null,
      carrier: p.shippingtrackingcarrier || null,
      tracking: p.shippingtrackingcode || null
    },
    last_payment_number: p.lastpayment || null
  }));
}

function num(x){ const n = Number(x); return Number.isFinite(n) ? n : null; }
function strToBool(x){ return String(x||"").trim() === "1"; }
