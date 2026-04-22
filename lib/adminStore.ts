import { Article, Report, articles as seedArticles, reports as seedReports } from "./data";

const ARTICLES_KEY = "ans_articles";
const REPORTS_KEY  = "ans_reports";
const AUTH_KEY     = "ans_admin_auth";
const ADMIN_PASSWORD = "ANS2026"; // Change before going live!

function isBrowser() { return typeof window !== "undefined"; }

// ── Auth — uses localStorage so it survives navigation ────────
export function login(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    if (isBrowser()) localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logout() {
  if (isBrowser()) localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  if (!isBrowser()) return false;
  return localStorage.getItem(AUTH_KEY) === "true";
}

// ── Articles (localStorage fallback for seed data) ───────────
export function getStoredArticles(): Article[] {
  if (!isBrowser()) return seedArticles;
  try {
    const raw = localStorage.getItem(ARTICLES_KEY);
    if (!raw) { localStorage.setItem(ARTICLES_KEY, JSON.stringify(seedArticles)); return seedArticles; }
    return JSON.parse(raw) as Article[];
  } catch { return seedArticles; }
}

export function saveArticles(articles: Article[]) {
  if (isBrowser()) localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
}

export function addArticle(article: Article) {
  const updated = [article, ...getStoredArticles()];
  saveArticles(updated); return updated;
}

export function updateArticle(slug: string, data: Article) {
  const updated = getStoredArticles().map((a) => (a.slug === slug ? data : a));
  saveArticles(updated); return updated;
}

export function deleteArticle(slug: string) {
  const updated = getStoredArticles().filter((a) => a.slug !== slug);
  saveArticles(updated); return updated;
}

// ── Reports ──────────────────────────────────────────────────
export function getStoredReports(): Report[] {
  if (!isBrowser()) return seedReports;
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) { localStorage.setItem(REPORTS_KEY, JSON.stringify(seedReports)); return seedReports; }
    return JSON.parse(raw) as Report[];
  } catch { return seedReports; }
}

export function saveReports(reports: Report[]) {
  if (isBrowser()) localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function addReport(report: Report) {
  const updated = [report, ...getStoredReports()];
  saveReports(updated); return updated;
}

export function deleteReport(id: string) {
  const updated = getStoredReports().filter((r) => r.id !== id);
  saveReports(updated); return updated;
}