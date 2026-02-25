import React, { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  Mail,
  Phone,
  Tag,
  X,
  ChevronDown,
  ChevronUp,
  Copy,
  MessageSquare,
  User,
  Filter,
  SortAsc,
  SortDesc,
  Eye,
} from "lucide-react";

export default function Contact() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sort State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "id",
    direction: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    hasPhone: "all",
    hasSubject: "all",
  });

  // View Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [copied, setCopied] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://codingcloud.pythonanywhere.com/contacts/",
      );
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
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

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter and sort contacts
  useEffect(() => {
    let result = [...contacts];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (contact) =>
          contact.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.mobile_no?.includes(searchTerm) ||
          contact.id.toString().includes(searchTerm),
      );
    }

    // Apply phone filter
    if (filters.hasPhone !== "all") {
      result = result.filter((contact) =>
        filters.hasPhone === "yes" ? contact.mobile_no : !contact.mobile_no,
      );
    }

    // Apply subject filter
    if (filters.hasSubject !== "all") {
      result = result.filter((contact) =>
        filters.hasSubject === "yes" ? contact.subject : !contact.subject,
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "id") {
        aValue = parseInt(aValue) || 0;
        bValue = parseInt(bValue) || 0;
      } else if (sortConfig.key === "full_name") {
        aValue = a.full_name?.toLowerCase() || "";
        bValue = b.full_name?.toLowerCase() || "";
      } else if (sortConfig.key === "email") {
        aValue = a.email?.toLowerCase() || "";
        bValue = b.email?.toLowerCase() || "";
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredContacts(result);
    setCurrentPage(1);
  }, [searchTerm, filters, sortConfig, contacts]);

  // Handle sort
  const handleSort = (key) => {
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <SortAsc size={14} className="text-gray-400" />;
    return sortConfig.direction === "asc" ? (
      <SortAsc size={14} className="text-indigo-600" />
    ) : (
      <SortDesc size={14} className="text-indigo-600" />
    );
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setFilters({
      hasPhone: "all",
      hasSubject: "all",
    });
    setSortConfig({ key: "id", direction: "desc" });
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedContacts = filteredContacts.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return "??";
    return name.slice(0, 2).toUpperCase();
  };

  // Avatar colors
  const avatarColors = [
    "#2563eb",
    "#7c3aed",
    "#0891b2",
    "#059669",
    "#d97706",
    "#dc2626",
  ];
  const getColor = (id) => avatarColors[id % avatarColors.length];

  // Copy to clipboard
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // View contact details
  const handleView = (contact) => {
    setSelectedContact(contact);
    setShowViewModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading contacts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="bg-red-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
            <X size={32} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={fetchContacts}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Contact Messages
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage and respond to contact form submissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchContacts}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={16} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by name, email, subject, message, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 border rounded-lg flex items-center gap-2 transition-colors ${
                showFilters
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Filter size={18} />
              <span>Filters</span>
              {showFilters ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>

            {/* Reset Button */}
            <button
              onClick={resetFilters}
              className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={18} />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <select
                  value={filters.hasPhone}
                  onChange={(e) =>
                    setFilters({ ...filters, hasPhone: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Contacts</option>
                  <option value="yes">With Phone</option>
                  <option value="no">Without Phone</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <select
                  value={filters.hasSubject}
                  onChange={(e) =>
                    setFilters({ ...filters, hasSubject: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="all">All Contacts</option>
                  <option value="yes">With Subject</option>
                  <option value="no">Without Subject</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items Per Page
                </label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

        {/* Contacts Table */}
        {filteredContacts.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="bg-gray-100 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
              <User size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No contacts found
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ||
              filters.hasPhone !== "all" ||
              filters.hasSubject !== "all"
                ? "Try adjusting your filters"
                : "No contact messages yet"}
            </p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw size={16} />
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("id")}
                      >
                        <div className="flex items-center gap-1">
                          ID {getSortIcon("id")}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("full_name")}
                      >
                        <div className="flex items-center gap-1">
                          Contact {getSortIcon("full_name")}
                        </div>
                      </th>
                      <th
                        className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                        onClick={() => handleSort("email")}
                      >
                        <div className="flex items-center gap-1">
                          Email {getSortIcon("email")}
                        </div>
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message Preview
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedContacts.map((contact, index) => {
                      const color = getColor(contact.id);
                      return (
                        <tr
                          key={contact.id}
                          className="hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => handleView(contact)}
                        >
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                style={{ backgroundColor: color }}
                              >
                                {getInitials(contact.full_name)}
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {contact.full_name || "No Name"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <a
                              href={`mailto:${contact.email}`}
                              onClick={(e) => e.stopPropagation()}
                              className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                            >
                              <Mail size={14} />
                              {contact.email || "-"}
                            </a>
                          </td>
                          <td className="px-4 py-3">
                            {contact.mobile_no ? (
                              <a
                                href={`tel:${contact.mobile_no}`}
                                onClick={(e) => e.stopPropagation()}
                                className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                              >
                                <Phone size={14} className="text-gray-400" />
                                {contact.mobile_no}
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {contact.subject ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                <Tag size={10} />
                                {contact.subject}
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">-</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-500 max-w-[200px] truncate">
                              {contact.message || "No message"}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleView(contact);
                                }}
                                className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="View Details"
                              >
                                <Eye size={16} />
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
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {indexOfFirstItem + 1} to{" "}
                  {Math.min(indexOfLastItem, filteredContacts.length)} of{" "}
                  {filteredContacts.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Contact Modal */}
      {showViewModal && selectedContact && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowViewModal(false)}
              aria-hidden="true"
            />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Contact Details
                  </h3>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Header with Avatar */}
                  <div className="flex items-center gap-4">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold"
                      style={{ backgroundColor: getColor(selectedContact.id) }}
                    >
                      {getInitials(selectedContact.full_name)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {selectedContact.full_name || "No Name"}
                      </h2>
                      <p className="text-sm text-gray-500">
                        ID: #{selectedContact.id}
                      </p>
                    </div>
                  </div>

                  {/* Contact Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-indigo-600 mb-1">
                        <Mail size={16} />
                        <span className="text-xs font-medium text-gray-500">
                          Email
                        </span>
                      </div>
                      <a
                        href={`mailto:${selectedContact.email}`}
                        className="text-sm text-gray-900 hover:text-indigo-600 break-all"
                      >
                        {selectedContact.email || "-"}
                      </a>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-green-600 mb-1">
                        <Phone size={16} />
                        <span className="text-xs font-medium text-gray-500">
                          Phone
                        </span>
                      </div>
                      {selectedContact.mobile_no ? (
                        <a
                          href={`tel:${selectedContact.mobile_no}`}
                          className="text-sm text-gray-900 hover:text-indigo-600"
                        >
                          {selectedContact.mobile_no}
                        </a>
                      ) : (
                        <span className="text-sm text-gray-400">
                          No phone provided
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Subject */}
                  {selectedContact.subject && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                        <Tag size={14} />
                        Subject
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-900">
                          {selectedContact.subject}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <MessageSquare size={14} />
                      Message
                    </h4>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedContact.message || "No message provided."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse gap-3">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || "Your inquiry"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <Mail size={16} className="mr-2" />
                  Reply via Email
                </a>
                <button
                  onClick={() => {
                    handleCopy(
                      selectedContact.email,
                      `modal-${selectedContact.id}`,
                    );
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <Copy size={16} className="mr-2" />
                  {copied === `modal-${selectedContact.id}`
                    ? "Copied!"
                    : "Copy Email"}
                </button>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
