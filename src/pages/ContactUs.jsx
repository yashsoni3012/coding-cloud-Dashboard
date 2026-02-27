import React, { useState, useEffect } from "react";
import {
  Search, RefreshCw, Mail, Phone, Tag, X, ChevronDown,
  Copy, MessageSquare, User, Filter, SortAsc, SortDesc, Eye,
} from "lucide-react";

export default function Contact() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "desc" });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ hasPhone: "all", hasSubject: "all" });

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [copied, setCopied] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://codingcloud.pythonanywhere.com/contacts/");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      if (data.status === "success" && data.data) {
        setContacts(data.data);
        setFilteredContacts(data.data);
        setError(null);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchContacts(); }, []);

  useEffect(() => {
    let result = [...contacts];

    if (searchTerm) {
      result = result.filter((c) =>
        c.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.mobile_no?.includes(searchTerm) ||
        c.id.toString().includes(searchTerm)
      );
    }

    if (filters.hasPhone !== "all") {
      result = result.filter((c) => filters.hasPhone === "yes" ? c.mobile_no : !c.mobile_no);
    }
    if (filters.hasSubject !== "all") {
      result = result.filter((c) => filters.hasSubject === "yes" ? c.subject : !c.subject);
    }

    result.sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];
      if (sortConfig.key === "id") { aVal = parseInt(aVal) || 0; bVal = parseInt(bVal) || 0; }
      else if (sortConfig.key === "full_name") { aVal = a.full_name?.toLowerCase() || ""; bVal = b.full_name?.toLowerCase() || ""; }
      else if (sortConfig.key === "email") { aVal = a.email?.toLowerCase() || ""; bVal = b.email?.toLowerCase() || ""; }
      if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredContacts(result);
    setCurrentPage(1);
  }, [searchTerm, filters, sortConfig, contacts]);

  const handleSort = (key) => {
    setSortConfig((cur) => ({ key, direction: cur.key === key && cur.direction === "asc" ? "desc" : "asc" }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <SortAsc size={13} className="text-slate-400" />;
    return sortConfig.direction === "asc"
      ? <SortAsc size={13} className="text-violet-500" />
      : <SortDesc size={13} className="text-violet-500" />;
  };

 

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedContacts = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  const getInitials = (name) => name ? name.slice(0, 2).toUpperCase() : "??";

  const avatarColors = ["#7c3aed", "#2563eb", "#0891b2", "#059669", "#d97706", "#dc2626"];
  const getColor = (id) => avatarColors[id % avatarColors.length];

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const activeFiltersCount = [
    filters.hasPhone !== "all",
    filters.hasSubject !== "all",
    sortConfig.key !== "id" || sortConfig.direction !== "desc",
  ].filter(Boolean).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 text-base font-medium">Loading contacts…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full text-center">
          <div className="bg-red-50 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <X size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Something went wrong</h3>
          <p className="text-slate-500 text-base mb-5">{error}</p>
          <button onClick={fetchContacts} className="px-5 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors text-base font-medium">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* ── Header ── */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare size={20} className="text-violet-600" />
            <h1 className="text-2xl font-bold text-slate-900">Contact Messages</h1>
            <span className="ml-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full">
              {contacts.length}
            </span>
          </div>
          <p className="text-slate-500 text-base">Manage and respond to contact form submissions</p>
        </div>

        {/* ── Toolbar (single line) ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 px-4 py-3 mb-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name, email, subject, message or ID…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 border border-slate-200 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent bg-slate-50 placeholder:text-slate-400"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-base font-medium transition-all whitespace-nowrap ${
                showFilters || activeFiltersCount > 0
                  ? "border-violet-400 bg-violet-50 text-violet-700"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Filter size={15} />
              Filters
              {activeFiltersCount > 0 && (
                <span className="px-1.5 py-0.5 bg-violet-600 text-white text-xs rounded-full leading-none">{activeFiltersCount}</span>
              )}
              <ChevronDown size={14} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
            </button>

            
          </div>

          {/* Expandable filter panel */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Phone Number</label>
                <select
                  value={filters.hasPhone}
                  onChange={(e) => setFilters({ ...filters, hasPhone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                >
                  <option value="all">All Contacts</option>
                  <option value="yes">With Phone</option>
                  <option value="no">Without Phone</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Subject</label>
                <select
                  value={filters.hasSubject}
                  onChange={(e) => setFilters({ ...filters, hasSubject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                >
                  <option value="all">All Contacts</option>
                  <option value="yes">With Subject</option>
                  <option value="no">Without Subject</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Items Per Page</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-violet-500 bg-slate-50"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* ── Table / Empty state ── */}
        {filteredContacts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-16 text-center">
            <div className="bg-slate-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <User size={28} className="text-slate-400" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">No contacts found</h3>
            <p className="text-slate-400 text-base mb-5">
              {searchTerm || filters.hasPhone !== "all" || filters.hasSubject !== "all"
                ? "Try adjusting your filters or search term."
                : "No contact messages yet."}
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors text-base font-medium"
            >
              <RefreshCw size={15} /> Clear Filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800 w-14"
                      onClick={() => handleSort("id")}
                    >
                      <span className="flex items-center gap-1"># {getSortIcon("id")}</span>
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800"
                      onClick={() => handleSort("full_name")}
                    >
                      <span className="flex items-center gap-1">Contact {getSortIcon("full_name")}</span>
                    </th>
                    <th
                      className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer select-none hover:text-slate-800"
                      onClick={() => handleSort("email")}
                    >
                      <span className="flex items-center gap-1">Email {getSortIcon("email")}</span>
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">
                      Phone
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden lg:table-cell">
                      Subject
                    </th>
                    <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide hidden xl:table-cell">
                      Message Preview
                    </th>
                    <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedContacts.map((contact, index) => {
                    const color = getColor(contact.id);
                    return (
                      <tr
                        key={contact.id}
                        className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                        onClick={() => { setSelectedContact(contact); setShowViewModal(true); }}
                      >
                        {/* # */}
                        <td className="px-5 py-4 text-base font-semibold text-slate-400">
                          {indexOfFirstItem + index + 1}
                        </td>

                        {/* Contact name + avatar */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                              style={{ backgroundColor: color }}
                            >
                              {getInitials(contact.full_name)}
                            </div>
                            <div>
                              <span className="text-base font-semibold text-slate-800 block">
                                {contact.full_name || "No Name"}
                              </span>
                              {/* show email under name on small screens */}
                              <span className="text-xs text-slate-400 md:hidden line-clamp-1">{contact.email || "—"}</span>
                            </div>
                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-5 py-4">
                          <a
                            href={`mailto:${contact.email}`}
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-base text-violet-600 hover:text-violet-800 hover:underline"
                          >
                            <Mail size={13} />
                            <span className="line-clamp-1 max-w-[160px]">{contact.email || "—"}</span>
                          </a>
                        </td>

                        {/* Phone */}
                        <td className="px-5 py-4 hidden md:table-cell">
                          {contact.mobile_no ? (
                            <a
                              href={`tel:${contact.mobile_no}`}
                              onClick={(e) => e.stopPropagation()}
                              className="inline-flex items-center gap-1.5 text-base text-slate-600 hover:text-slate-900"
                            >
                              <Phone size={13} className="text-slate-400" />
                              {contact.mobile_no}
                            </a>
                          ) : (
                            <span className="text-slate-300 text-base">—</span>
                          )}
                        </td>

                        {/* Subject badge */}
                        <td className="px-5 py-4 hidden lg:table-cell">
                          {contact.subject ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-violet-50 text-violet-700 border border-violet-100 text-xs font-semibold rounded-full max-w-[140px] truncate">
                              <Tag size={10} className="flex-shrink-0" />
                              <span className="truncate">{contact.subject}</span>
                            </span>
                          ) : (
                            <span className="text-slate-300 text-base">—</span>
                          )}
                        </td>

                        {/* Message preview */}
                        <td className="px-5 py-4 hidden xl:table-cell">
                          <span className="text-base text-slate-400 line-clamp-1 max-w-[200px] block">
                            {contact.message || <span className="italic">No message</span>}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedContact(contact); setShowViewModal(true); }}
                              className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-all"
                              title="View Details"
                            >
                              <Eye size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-400 font-medium">
                Showing <span className="text-slate-700 font-semibold">{indexOfFirstItem + 1}–{Math.min(indexOfLastItem, filteredContacts.length)}</span> of <span className="text-slate-700 font-semibold">{filteredContacts.length}</span> contacts
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  ← Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let page = i + 1;
                    if (totalPages > 5) {
                      if (currentPage <= 3) page = i + 1;
                      else if (currentPage >= totalPages - 2) page = totalPages - 4 + i;
                      else page = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                          currentPage === page
                            ? "bg-violet-600 text-white shadow-sm"
                            : "text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white transition-colors"
                >
                  Next →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── View Contact Modal ── */}
      {showViewModal && selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setShowViewModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full z-10 overflow-hidden max-h-[90vh] flex flex-col">

            {/* Close */}
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors z-10"
            >
              <X size={16} />
            </button>

            <div className="p-6 overflow-y-auto flex-1">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4 mb-6">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
                  style={{ backgroundColor: getColor(selectedContact.id) }}
                >
                  {getInitials(selectedContact.full_name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{selectedContact.full_name || "No Name"}</h2>
                  <p className="text-base text-slate-400 mt-0.5">Contact #{selectedContact.id}</p>
                </div>
              </div>

              {/* Contact info grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Mail size={11} className="text-violet-500" /> Email
                  </p>
                  <a href={`mailto:${selectedContact.email}`} className="text-base font-medium text-violet-600 hover:underline break-all">
                    {selectedContact.email || "—"}
                  </a>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Phone size={11} className="text-emerald-500" /> Phone
                  </p>
                  {selectedContact.mobile_no ? (
                    <a href={`tel:${selectedContact.mobile_no}`} className="text-base font-medium text-slate-800 hover:text-slate-900">
                      {selectedContact.mobile_no}
                    </a>
                  ) : (
                    <span className="text-base text-slate-400 italic">No phone provided</span>
                  )}
                </div>
              </div>

              {/* Subject */}
              {selectedContact.subject && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Tag size={11} className="text-violet-500" /> Subject
                  </p>
                  <p className="text-base font-semibold text-slate-800">{selectedContact.subject}</p>
                </div>
              )}

              {/* Message */}
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                  <MessageSquare size={11} className="text-violet-500" /> Message
                </p>
                <p className="text-base text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {selectedContact.message || "No message provided."}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => handleCopy(selectedContact.email, `modal-${selectedContact.id}`)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-base font-medium rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-2"
              >
                <Copy size={14} />
                {copied === `modal-${selectedContact.id}` ? "Copied!" : "Copy Email"}
              </button>
              <button
                onClick={() => setShowViewModal(false)}
                className="px-4 py-2 border border-slate-200 text-slate-600 text-base font-medium rounded-xl hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
              <a
                href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || "Your inquiry"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-violet-600 text-white text-base font-medium rounded-xl hover:bg-violet-700 transition-colors flex items-center gap-2 shadow-sm shadow-violet-200"
              >
                <Mail size={14} />
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}