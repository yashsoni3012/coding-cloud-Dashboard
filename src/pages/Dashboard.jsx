import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import {
  Globe,
  LayoutGrid,
  BookOpen,
  Layers,
  Hash,
  Mail,
  Users,
  HelpCircle,
  FileText,
  MessageSquare,
  ArrowUpRight,
  X,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Plus,
  ChevronRight,
} from "lucide-react";

/* ─── API ─────────────────────────────────────────────────── */
const BASE_URL = "https://codingcloudapi.codingcloud.co.in";

const fetchCategoriesCount  = async () => { const r = await fetch(`${BASE_URL}/category/`);     if (!r.ok) throw new Error("Failed to fetch categories");   const d = await r.json(); return Array.isArray(d) ? d.length : d.data?.length || 0; };
const fetchCoursesCount     = async () => { const r = await fetch(`${BASE_URL}/course/`);        if (!r.ok) throw new Error("Failed to fetch courses");      const d = await r.json(); return Array.isArray(d) ? d.length : d.data?.length || 0; };
const fetchModulesCount     = async () => { const r = await fetch(`${BASE_URL}/modules/`);       if (!r.ok) throw new Error("Failed to fetch modules");      const d = await r.json(); return Array.isArray(d) ? d.length : d.data?.length || 0; };
const fetchTopicsCount      = async () => { const r = await fetch(`${BASE_URL}/topics/`);        if (!r.ok) throw new Error("Failed to fetch topics");       const d = await r.json(); if (typeof d.count === "number") return d.count; if (Array.isArray(d.data)) return d.data.reduce((t, m) => t + (m.topics?.length || 0), 0); return 0; };
const fetchContactsCount    = async () => { const r = await fetch(`${BASE_URL}/contacts/`);      if (!r.ok) throw new Error("Failed to fetch contacts");     const d = await r.json(); return Array.isArray(d) ? d.length : d.data?.length || 0; };
const fetchEnrollsCount     = async () => { const r = await fetch(`${BASE_URL}/enroll/`);        if (!r.ok) throw new Error("Failed to fetch enrolls");      const d = await r.json(); return Array.isArray(d) ? d.length : d.data?.length || 0; };
const fetchFaqsCount        = async () => { const r = await fetch(`${BASE_URL}/faqs/`);          if (!r.ok) throw new Error("Failed to fetch FAQs");         const d = await r.json(); return Array.isArray(d) ? d.length : d.data?.length || 0; };
const fetchBlogsCount       = async () => { const r = await fetch(`${BASE_URL}/blogs/`);         if (!r.ok) throw new Error("Failed to fetch blogs");        const d = await r.json(); const b = d.data || d; return Array.isArray(b) ? b.length : 0; };
const fetchTestimonialsCount= async () => { const r = await fetch(`${BASE_URL}/testimonials/`);  if (!r.ok) throw new Error("Failed to fetch testimonials"); const d = await r.json(); if (Array.isArray(d.testimonials)) return d.testimonials.length; if (Array.isArray(d.data)) return d.data.length; if (Array.isArray(d)) return d.length; return 0; };
const fetchSeoCount         = async () => { const r = await fetch("https://codingcloud.pythonanywhere.com/page-seo/"); if (!r.ok) throw new Error("Failed to fetch SEO"); const d = await r.json(); return Array.isArray(d) ? d.length : d.data?.length || 0; };

/* ─── Config ──────────────────────────────────────────────── */
const CARDS = [
  { id:"categories",   title:"Categories",   icon:LayoutGrid,    iconBg:"bg-violet-100", iconText:"text-violet-600", hoverBg:"group-hover:bg-violet-600", hoverText:"group-hover:text-white", arrow:"text-violet-500",  bar:"bg-violet-500",  path:"/category"   },
  { id:"courses",      title:"Courses",      icon:BookOpen,      iconBg:"bg-sky-100",    iconText:"text-sky-600",    hoverBg:"group-hover:bg-sky-600",    hoverText:"group-hover:text-white", arrow:"text-sky-500",    bar:"bg-sky-500",     path:"/course"     },
  { id:"modules",      title:"Modules",      icon:Layers,        iconBg:"bg-emerald-100",iconText:"text-emerald-600",hoverBg:"group-hover:bg-emerald-600",hoverText:"group-hover:text-white", arrow:"text-emerald-500",bar:"bg-emerald-500", path:"/modules"    },
  { id:"contacts",     title:"Contacts",     icon:Mail,          iconBg:"bg-rose-100",   iconText:"text-rose-600",   hoverBg:"group-hover:bg-rose-600",   hoverText:"group-hover:text-white", arrow:"text-rose-500",   bar:"bg-rose-500",    path:"/contact"    },
  { id:"enrolls",      title:"Enrollments",  icon:Users,         iconBg:"bg-indigo-100", iconText:"text-indigo-600", hoverBg:"group-hover:bg-indigo-600", hoverText:"group-hover:text-white", arrow:"text-indigo-500", bar:"bg-indigo-500",  path:"/enroll"     },
  { id:"faqs",         title:"FAQs",         icon:HelpCircle,    iconBg:"bg-cyan-100",   iconText:"text-cyan-600",   hoverBg:"group-hover:bg-cyan-600",   hoverText:"group-hover:text-white", arrow:"text-cyan-500",   bar:"bg-cyan-500",    path:"/faq"        },
  { id:"blogs",        title:"Blogs",        icon:FileText,      iconBg:"bg-orange-100", iconText:"text-orange-600", hoverBg:"group-hover:bg-orange-600", hoverText:"group-hover:text-white", arrow:"text-orange-500", bar:"bg-orange-500",  path:"/blogs"      },
  { id:"testimonials", title:"Testimonials", icon:MessageSquare, iconBg:"bg-teal-100",   iconText:"text-teal-600",   hoverBg:"group-hover:bg-teal-600",   hoverText:"group-hover:text-white", arrow:"text-teal-500",   bar:"bg-teal-500",    path:"/testimonials"},
  { id:"seo",          title:"SEO Pages",    icon:Globe,         iconBg:"bg-purple-100", iconText:"text-purple-600", hoverBg:"group-hover:bg-purple-600", hoverText:"group-hover:text-white", arrow:"text-purple-500", bar:"bg-purple-500",  path:"/SEO"        },
];

const QUICK_ACTIONS = [
  { label:"New Category",    path:"/add-category",    icon:LayoutGrid,    iconBg:"bg-violet-100", iconText:"text-violet-600", chipHover:"hover:bg-violet-600" },
  { label:"New Course",      path:"/add-course",      icon:BookOpen,      iconBg:"bg-sky-100",    iconText:"text-sky-600",    chipHover:"hover:bg-sky-600"    },
  { label:"New Blog",        path:"/add-blog",        icon:FileText,      iconBg:"bg-orange-100", iconText:"text-orange-600", chipHover:"hover:bg-orange-600" },
  { label:"New Testimonial", path:"/add-testimonial", icon:MessageSquare, iconBg:"bg-teal-100",   iconText:"text-teal-600",   chipHover:"hover:bg-teal-600"   },
  { label:"New FAQ",         path:"/add-faq",         icon:HelpCircle,    iconBg:"bg-cyan-100",   iconText:"text-cyan-600",   chipHover:"hover:bg-cyan-600"   },
  { label:"New SEO Page",    path:"/add-seo",         icon:Globe,         iconBg:"bg-purple-100", iconText:"text-purple-600", chipHover:"hover:bg-purple-600" },
];

/* ─── Component ───────────────────────────────────────────── */
export default function Dashboard() {
  const navigate = useNavigate();

  const queries = useQueries({
    queries: [
      { queryKey:["categoriesCount"],   queryFn:fetchCategoriesCount   },
      { queryKey:["coursesCount"],      queryFn:fetchCoursesCount      },
      { queryKey:["modulesCount"],      queryFn:fetchModulesCount      },
      { queryKey:["topicsCount"],       queryFn:fetchTopicsCount       },
      { queryKey:["contactsCount"],     queryFn:fetchContactsCount     },
      { queryKey:["enrollsCount"],      queryFn:fetchEnrollsCount      },
      { queryKey:["faqsCount"],         queryFn:fetchFaqsCount         },
      { queryKey:["blogsCount"],        queryFn:fetchBlogsCount        },
      { queryKey:["testimonialsCount"], queryFn:fetchTestimonialsCount },
      { queryKey:["seoCount"],          queryFn:fetchSeoCount          },
    ],
  });

  const isLoading  = queries.some((q) => q.isLoading);
  const error      = queries.find((q) => q.error)?.error;
  const refreshAll = () => queries.forEach((q) => q.refetch());

  const stats = useMemo(() => ({
    categories:   queries[0]?.data ?? 0,
    courses:      queries[1]?.data ?? 0,
    modules:      queries[2]?.data ?? 0,
    topics:       queries[3]?.data ?? 0,
    contacts:     queries[4]?.data ?? 0,
    enrolls:      queries[5]?.data ?? 0,
    faqs:         queries[6]?.data ?? 0,
    blogs:        queries[7]?.data ?? 0,
    testimonials: queries[8]?.data ?? 0,
    seo:          queries[9]?.data ?? 0,
  }), queries.map((q) => q.data));

  const totalItems = Object.values(stats).reduce((a, b) => a + b, 0);

  /* ── Loading ── */
  if (isLoading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-4">
      <div className="w-11 h-11 rounded-full border-[3px] border-violet-200 border-t-violet-600 animate-spin" />
      <p className="text-sm text-slate-400 font-medium tracking-wide">Loading dashboard…</p>
    </div>
  );

  /* ── Error ── */
  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center border border-slate-100">
        <div className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-4">
          <X size={22} className="text-rose-500" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Something went wrong</h3>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">{error.message}</p>
        <button
          onClick={refreshAll}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 active:bg-violet-800 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    </div>
  );

  /* ── Main ── */
  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto  space-y-6">

        {/* ════ BANNER ════ */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 shadow-xl">
          {/* decorative glow blobs */}
          <div className="absolute -top-14 -right-14 w-64 h-64 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 left-0 w-48 h-48 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />
          {/* dot-grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage:"radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize:"24px 24px" }}
          />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6 sm:p-8">
            {/* left */}
            <div>
             
              <h1 className="text-2xl sm:text-[32px] font-extrabold text-white tracking-tight leading-tight mb-1.5">
                Welcome, Coding Cloud
              </h1>
            </div>
          </div>
        </div>

        {/* ════ SECTION LABEL ════ */}
        <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-slate-400">
          Overview
        </p>

        {/* ════ STATS GRID ════ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {CARDS.map((card) => {
            const Icon  = card.icon;
            const value = stats[card.id] ?? 0;
            return (
              <div
                key={card.id}
                onClick={() => navigate(card.path)}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer overflow-hidden"
              >
                <div className="p-4 sm:p-5">
                  {/* icon + arrow */}
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`
                        w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                        ${card.iconBg} ${card.iconText}
                        ${card.hoverBg} ${card.hoverText}
                        transition-all duration-200
                      `}
                    >
                      <Icon size={18} />
                    </div>
                    <ArrowUpRight
                      size={15}
                      className={`${card.arrow} opacity-25 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200`}
                    />
                  </div>
                  {/* label */}
                  <p className="text-xs font-medium text-slate-400 mb-1 truncate">{card.title}</p>
                  {/* value */}
                  <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-none tracking-tight">
                    {value}
                  </p>
                </div>
                {/* hover bar */}
                <div className="h-[3px] bg-slate-100">
                  <div className={`h-full ${card.bar} w-0 group-hover:w-full transition-all duration-500 ease-out`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ════ BOTTOM ROW ════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">

          {/* ── Quick Actions ── */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Quick Actions</h3>
            </div>
            <div className="space-y-1">
              {QUICK_ACTIONS.map((action) => {
                const AIcon = action.icon;
                return (
                  <button
                    key={action.path}
                    onClick={() => navigate(action.path)}
                    className="group/row w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 active:bg-slate-100 transition-colors text-left"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${action.iconBg} ${action.iconText}`}>
                      <AIcon size={14} />
                    </div>
                    <span className="flex-1 text-sm font-medium text-slate-700 group-hover/row:text-slate-900 transition-colors">
                      {action.label}
                    </span>
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 bg-slate-100 text-slate-400 ${action.chipHover} group-hover/row:text-white transition-all duration-150`}>
                      <Plus size={12} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Content Breakdown ── */}
          {/* <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-sky-500 flex-shrink-0" />
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">Content Breakdown</h3>
            </div>
            <div className="space-y-2.5">
              {CARDS.map((card) => {
                const val = stats[card.id] ?? 0;
                const pct = totalItems > 0 ? Math.max((val / totalItems) * 100, val > 0 ? 3 : 0) : 0;
                return (
                  <div
                    key={card.id}
                    onClick={() => navigate(card.path)}
                    className="group/bar flex items-center gap-3 cursor-pointer"
                  >
                    <span className="w-[88px] flex-shrink-0 text-xs font-medium text-slate-500 group-hover/bar:text-slate-900 transition-colors truncate">
                      {card.title}
                    </span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${card.bar} rounded-full transition-all duration-700 ease-out`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-7 flex-shrink-0 text-right text-xs font-bold text-slate-700">{val}</span>
                    <ChevronRight
                      size={12}
                      className="flex-shrink-0 text-slate-200 group-hover/bar:text-slate-400 transition-colors"
                    />
                  </div>
                );
              })}
            </div>
          </div> */}

        </div>

        {/* bottom spacing */}
        <div className="h-4" />
      </div>
    </div>
  );
}