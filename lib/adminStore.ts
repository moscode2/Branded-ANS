// lib/adminStore.ts
// Client-side persistence layer using localStorage.
// In production, swap these functions for real API calls.

import { Article, Report, articles as seedArticles, reports as seedReports } from "./data";

const ARTICLES_KEY = "ans_articles";
const REPORTS_KEY  = "ans_reports";

function isBrowser() {
  return typeof window !== "undefined";
}

// ── Articles ──────────────────────────────────────────────

export function getStoredArticles(): Article[] {
  if (!isBrowser()) return seedArticles;
  try {
    const raw = localStorage.getItem(ARTICLES_KEY);
    if (!raw) {
      localStorage.setItem(ARTICLES_KEY, JSON.stringify(seedArticles));
      return seedArticles;
    }
    return JSON.parse(raw) as Article[];
  } catch {
    return seedArticles;
  }
}

export function saveArticles(articles: Article[]) {
  if (!isBrowser()) return;
  localStorage.setItem(ARTICLES_KEY, JSON.stringify(articles));
}

export function addArticle(article: Article) {
  const all = getStoredArticles();
  const updated = [article, ...all];
  saveArticles(updated);
  return updated;
}

export function updateArticle(slug: string, data: Article) {
  const all = getStoredArticles();
  const updated = all.map((a) => (a.slug === slug ? data : a));
  saveArticles(updated);
  return updated;
}

export function deleteArticle(slug: string) {
  const all = getStoredArticles();
  const updated = all.filter((a) => a.slug !== slug);
  saveArticles(updated);
  return updated;
}

// ── Reports ───────────────────────────────────────────────

export function getStoredReports(): Report[] {
  if (!isBrowser()) return seedReports;
  try {
    const raw = localStorage.getItem(REPORTS_KEY);
    if (!raw) {
      localStorage.setItem(REPORTS_KEY, JSON.stringify(seedReports));
      return seedReports;
    }
    return JSON.parse(raw) as Report[];
  } catch {
    return seedReports;
  }
}

export function saveReports(reports: Report[]) {
  if (!isBrowser()) return;
  localStorage.setItem(REPORTS_KEY, JSON.stringify(reports));
}

export function addReport(report: Report) {
  const all = getStoredReports();
  const updated = [report, ...all];
  saveReports(updated);
  return updated;
}

export function deleteReport(id: string) {
  const all = getStoredReports();
  const updated = all.filter((r) => r.id !== id);
  saveReports(updated);
  return updated;
}

// ── Auth (simple pin-based) ───────────────────────────────

const AUTH_KEY = "ans_admin_auth";
const ADMIN_PASSWORD = "ans2025"; // Change this!

export function login(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    sessionStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logout() {
  sessionStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  if (!isBrowser()) return false;
  return sessionStorage.getItem(AUTH_KEY) === "true";
}