// import { useState, useEffect } from "react";
// import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
// import { Calendar, Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

// const API_BASE = "https://codingcloudapi.codingcloud.co.in";

// // Helper: format ISO date to local readable string
// const formatDate = (isoString) => {
//   if (!isoString) return "—";
//   try {
//     return format(parseISO(isoString), "dd MMM yyyy, hh:mm a");
//   } catch {
//     return isoString;
//   }
// };

// // Helper: get only date part (YYYY-MM-DD) for comparison
// const getDateOnly = (isoString) => {
//   if (!isoString) return null;
//   return parseISO(isoString).toISOString().split("T")[0];
// };

// export default function ContactList() {
//   const [contacts, setContacts] = useState([]);
//   const [filteredContacts, setFilteredContacts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Date filter states
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");

//   // Pagination (optional)
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Fetch data from API
//   const fetchContacts = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const response = await fetch(`${API_BASE}/contacts/`); // adjust endpoint as needed
//       if (!response.ok) throw new Error("Failed to fetch contacts");
//       const data = await response.json();
//       // Assuming API returns { success: true, data: [...] } or directly an array
//       const contactsArray = Array.isArray(data) ? data : data.data || [];
//       // Sort by created_at descending (newest first)
//       const sorted = [...contactsArray].sort(
//         (a, b) => new Date(b.created_at) - new Date(a.created_at)
//       );
//       setContacts(sorted);
//       setFilteredContacts(sorted);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContacts();
//   }, []);

//   // Apply date filter whenever contacts, startDate, or endDate changes
//   useEffect(() => {
//     if (!contacts.length) return;

//     let filtered = [...contacts];

//     if (startDate || endDate) {
//       filtered = filtered.filter((contact) => {
//         if (!contact.created_at) return false;
//         const contactDate = parseISO(contact.created_at);
//         const contactDay = startOfDay(contactDate);

//         if (startDate && endDate) {
//           const start = startOfDay(parseISO(startDate));
//           const end = endOfDay(parseISO(endDate));
//           return isWithinInterval(contactDay, { start, end });
//         } else if (startDate) {
//           const start = startOfDay(parseISO(startDate));
//           return contactDay >= start;
//         } else if (endDate) {
//           const end = endOfDay(parseISO(endDate));
//           return contactDay <= end;
//         }
//         return true;
//       });
//     }

//     setFilteredContacts(filtered);
//     setCurrentPage(1); // reset to first page when filter changes
//   }, [contacts, startDate, endDate]);

//   // Pagination logic
//   const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
//   const paginatedContacts = filteredContacts.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handleClearFilters = () => {
//     setStartDate("");
//     setEndDate("");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
//           <button
//             onClick={fetchContacts}
//             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
//           >
//             <RefreshCw size={16} />
//             Refresh
//           </button>
//         </div>

//         {/* Date Filter Bar */}
//         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
//           <div className="flex flex-wrap items-end gap-4">
//             <div className="flex-1 min-w-[180px]">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 From Date
//               </label>
//               <div className="relative">
//                 <Calendar
//                   size={16}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />
//                 <input
//                   type="date"
//                   value={startDate}
//                   onChange={(e) => setStartDate(e.target.value)}
//                   className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//             </div>
//             <div className="flex-1 min-w-[180px]">
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 To Date
//               </label>
//               <div className="relative">
//                 <Calendar
//                   size={16}
//                   className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//                 />
//                 <input
//                   type="date"
//                   value={endDate}
//                   onChange={(e) => setEndDate(e.target.value)}
//                   className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//                 />
//               </div>
//             </div>
//             <button
//               onClick={handleClearFilters}
//               className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
//             >
//               Clear
//             </button>
//           </div>
//           {(startDate || endDate) && (
//             <div className="mt-3 text-sm text-indigo-600">
//               Showing messages from{" "}
//               {startDate ? format(parseISO(startDate), "dd MMM yyyy") : "any date"}{" "}
//               to {endDate ? format(parseISO(endDate), "dd MMM yyyy") : "any date"}
//             </div>
//           )}
//         </div>

//         {/* Table */}
//         {loading ? (
//           <div className="flex justify-center items-center py-20">
//             <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
//           </div>
//         ) : error ? (
//           <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
//             {error}
//           </div>
//         ) : filteredContacts.length === 0 ? (
//           <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
//             No messages found for the selected date range.
//           </div>
//         ) : (
//           <>
//             <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Name
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Email
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Mobile
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Subject
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Message
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Created At
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {paginatedContacts.map((contact) => (
//                       <tr key={contact.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {contact.full_name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           {contact.email}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           {contact.mobile_no}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           {contact.subject}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
//                           {contact.message}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {formatDate(contact.created_at)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="flex items-center justify-between mt-6">
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
//                   disabled={currentPage === 1}
//                   className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//                 >
//                   <ChevronLeft size={16} /> Previous
//                 </button>
//                 <span className="text-sm text-gray-600">
//                   Page {currentPage} of {totalPages}
//                 </span>
//                 <button
//                   onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
//                   disabled={currentPage === totalPages}
//                   className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//                 >
//                   Next <ChevronRight size={16} />
//                 </button>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { format, parseISO, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import * as XLSX from "xlsx";
import { Calendar, RefreshCw, ChevronLeft, ChevronRight, Download } from "lucide-react";

const API_BASE = "https://codingcloudapi.codingcloud.co.in";

// Helper: format ISO date to local readable string
const formatDate = (isoString) => {
  if (!isoString) return "—";
  try {
    return format(parseISO(isoString), "dd MMM yyyy, hh:mm a");
  } catch {
    return isoString;
  }
};

// Helper: format date for Excel (YYYY-MM-DD HH:MM:SS)
const formatDateForExcel = (isoString) => {
  if (!isoString) return "";
  try {
    return format(parseISO(isoString), "yyyy-MM-dd HH:mm:ss");
  } catch {
    return isoString;
  }
};

export default function ContactList() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Date filter states
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data from API
  const fetchContacts = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/contacts/`); // adjust endpoint
      if (!response.ok) throw new Error("Failed to fetch contacts");
      const data = await response.json();
      const contactsArray = Array.isArray(data) ? data : data.data || [];
      // Sort by created_at descending (newest first)
      const sorted = [...contactsArray].sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setContacts(sorted);
      setFilteredContacts(sorted);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Apply date filter whenever contacts, startDate, or endDate changes
  useEffect(() => {
    if (!contacts.length) return;

    let filtered = [...contacts];

    if (startDate || endDate) {
      filtered = filtered.filter((contact) => {
        if (!contact.created_at) return false;
        const contactDate = parseISO(contact.created_at);
        const contactDay = startOfDay(contactDate);

        if (startDate && endDate) {
          const start = startOfDay(parseISO(startDate));
          const end = endOfDay(parseISO(endDate));
          return isWithinInterval(contactDay, { start, end });
        } else if (startDate) {
          const start = startOfDay(parseISO(startDate));
          return contactDay >= start;
        } else if (endDate) {
          const end = endOfDay(parseISO(endDate));
          return contactDay <= end;
        }
        return true;
      });
    }

    setFilteredContacts(filtered);
    setCurrentPage(1);
  }, [contacts, startDate, endDate]);

  // Export to Excel (exports current filtered data)
  const exportToExcel = () => {
    if (filteredContacts.length === 0) {
      alert("No data to export for the selected date range.");
      return;
    }

    // Prepare data for Excel
    const excelData = filteredContacts.map((contact) => ({
      "Full Name": contact.full_name || "",
      Email: contact.email || "",
      "Mobile No": contact.mobile_no || "",
      Subject: contact.subject || "",
      Message: contact.message || "",
      "Created At": formatDateForExcel(contact.created_at),
      "Updated At": formatDateForExcel(contact.updated_at),
    }));

    // Create worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts");

    // Generate filename with date range
    let fileName = "contacts";
    if (startDate && endDate) {
      fileName = `contacts_${startDate}_to_${endDate}`;
    } else if (startDate) {
      fileName = `contacts_from_${startDate}`;
    } else if (endDate) {
      fileName = `contacts_until_${endDate}`;
    } else {
      fileName = `contacts_all`;
    }
    fileName += ".xlsx";

    // Export
    XLSX.writeFile(workbook, fileName);
  };

  const handleClearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const paginatedContacts = filteredContacts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <div className="flex gap-3">
            <button
              onClick={exportToExcel}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              <Download size={16} />
              Export to Excel
            </button>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex-1 min-w-[180px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Clear
            </button>
          </div>
          {(startDate || endDate) && (
            <div className="mt-3 text-sm text-indigo-600">
              Showing messages from{" "}
              {startDate ? format(parseISO(startDate), "dd MMM yyyy") : "any date"}{" "}
              to {endDate ? format(parseISO(endDate), "dd MMM yyyy") : "any date"}
              {filteredContacts.length > 0 && (
                <span className="ml-2 font-semibold">
                  ({filteredContacts.length} records)
                </span>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
            No messages found for the selected date range.
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mobile
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedContacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {contact.full_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {contact.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {contact.mobile_no}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {contact.subject}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {contact.message}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(contact.created_at)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}