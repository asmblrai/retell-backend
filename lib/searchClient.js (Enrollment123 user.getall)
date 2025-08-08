import fetch from "node-fetch";
import { Parser } from "xml2js";

const parser = new Parser({ explicitArray: false, mergeAttrs: true, explicitRoot: false, trim: true });

export async function userGetAll({ memberId, returnDependents = 1, returnProducts = 1, returnTransactions = 0 }) {
  const form = new URLSearchParams();
  form.set("CORPID", process.env.SEARCH_CORPID);
  form.set("USERNAME", process.env.SEARCH_USERNAME);
  form.set("PASSWORD", process.env.SEARCH_PASSWORD);
  if (memberId) form.set("MEMBERID", memberId);
  if (returnDependents) form.set("RETURN_DEPENDENTS", "1");
  if (returnProducts) form.set("RETURN_PRODUCTS", "1");
  if (returnTransactions) form.set("RETURN_TRANSACTIONS", "1");

  const r = await fetch(process.env.SEARCH_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form
  });
  if (!r.ok) throw new Error(`user.getall ${r.status}: ${await r.text()}`);
  const xml = await r.text();
  const json = await parser.parseStringPromise(xml);

  // normalize sections to arrays
  const users = arr(json?.users?.user);
  const dependents = arr(json?.dependents?.dependent);
  const products = arr(json?.products?.product);
  const transactions = arr(json?.transactions?.transaction);
  return { users, dependents, products, transactions };
}

function arr(x) {
  if (x == null) return [];
  return Array.isArray(x) ? x : [x];
}
