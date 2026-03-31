// import { useState, useEffect } from "react";
// import {
//   Eye,
//   X,
//   Search,
//   ChevronLeft,
//   ChevronRight,
//   MessageSquare,
//   Download,
// } from "lucide-react";
// import * as XLSX from "xlsx";

// const BASE_URL = "https://codingcloudapi.codingcloud.co.in";

// const fetchMessages = async () => {
//   const response = await fetch(`${BASE_URL}/register_msg/`);
//   if (!response.ok) throw new Error(`HTTP error ${response.status}`);
//   const data = await response.json();
//   if (data.status === "success" && Array.isArray(data.data)) {
//     return data.data;
//   }
//   throw new Error("Invalid data format");
// };

// export default function RegisterMessages() {
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(10);
//   const [selectedMessage, setSelectedMessage] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);

//   useEffect(() => {
//     fetchMessages()
//       .then((data) => {
//         setMessages(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   // Filter messages based on search (for table display)
//   const filteredMessages = messages.filter((msg) => {
//     const fullName = `${msg.first_name} ${msg.last_name}`.toLowerCase();
//     const searchLower = search.toLowerCase();
//     return (
//       fullName.includes(searchLower) ||
//       msg.mobile.includes(searchLower) ||
//       msg.message.toLowerCase().includes(searchLower)
//     );
//   });

//   // Pagination
//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentMessages = filteredMessages.slice(indexOfFirst, indexOfLast);
//   const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

//   const getPageNumbers = () => {
//     if (totalPages <= 5)
//       return Array.from({ length: totalPages }, (_, i) => i + 1);
//     if (currentPage <= 3) return [1, 2, 3, 4, 5];
//     if (currentPage >= totalPages - 2)
//       return [
//         totalPages - 4,
//         totalPages - 3,
//         totalPages - 2,
//         totalPages - 1,
//         totalPages,
//       ];
//     return [
//       currentPage - 2,
//       currentPage - 1,
//       currentPage,
//       currentPage + 1,
//       currentPage + 2,
//     ];
//   };

//   // Reset page when search changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [search]);

//   // Export to Excel
//   const exportToExcel = () => {
//     if (messages.length === 0) return;

//     // ✅ Step 1: Sort messages in ASC order by ID
//     const sortedMessages = [...filteredMessages].sort(
//       (a, b) => (parseInt(a.id) || 0) - (parseInt(b.id) || 0),
//     );

//     // ✅ Step 2: Add Serial Number (1,2,3...)
//     const excelData = sortedMessages.map((msg, index) => ({
//       "No.": index + 1, // 👈 serial number
//       ID: msg.id,
//       "First Name": msg.first_name,
//       "Last Name": msg.last_name,
//       Mobile: msg.mobile,
//       Message: msg.message,
//     }));

//     const worksheet = XLSX.utils.json_to_sheet(excelData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Registration Messages");

//     XLSX.writeFile(
//       workbook,
//       `registration_messages_${new Date().toISOString().slice(0, 19)}.xlsx`,
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-11 h-11 border-3 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto" />
//           <p className="mt-3 text-gray-400 font-medium">Loading messages…</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm text-center">
//           <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
//             <X size={22} className="text-red-500" />
//           </div>
//           <h3 className="text-lg font-bold text-gray-900 mb-2">
//             Something went wrong
//           </h3>
//           <p className="text-gray-500 mb-5">{error}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans p-6 max-w-6xl mx-auto">
//       {/* Header with Export Button */}
//       <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
//         <div>
//           <div className="flex items-center gap-2 mb-1">
//             <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl flex items-center justify-center shadow-md">
//               <MessageSquare size={18} className="text-white" />
//             </div>
//             <h1 className="text-2xl font-bold text-gray-900">
//               Registration Messages
//             </h1>
//             <span className="px-3 py-0.5 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
//               {messages.length}
//             </span>
//           </div>
//           <p className="text-gray-500 text-sm ml-12">
//             View all messages submitted through the registration form
//           </p>
//         </div>
//         <button
//           onClick={exportToExcel}
//           disabled={messages.length === 0}
//           className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
//             messages.length === 0
//               ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//               : "bg-green-600 text-white hover:bg-green-700 shadow-sm"
//           }`}
//         >
//           <Download size={18} />
//           Export to Excel
//         </button>
//       </div>

//       {/* Search Bar */}
//       <div className="bg-white rounded-xl border border-gray-200 p-3 mb-5 shadow-sm">
//         <div className="relative">
//           <Search
//             className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
//             size={16}
//           />
//           <input
//             type="text"
//             placeholder="Search by name, mobile, or message…"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition"
//           />
//           {search && (
//             <button
//               onClick={() => setSearch("")}
//               className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//             >
//               <X size={14} />
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Table */}
//       {filteredMessages.length === 0 ? (
//         <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
//           <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <MessageSquare size={28} className="text-gray-400" />
//           </div>
//           <h3 className="text-lg font-semibold text-gray-800 mb-1">
//             No messages found
//           </h3>
//           <p className="text-gray-500">
//             {search
//               ? "Try adjusting your search term."
//               : "No registration messages yet."}
//           </p>
//         </div>
//       ) : (
//         <>
//           <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
//                       ID
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                       Name
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                       Mobile
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                       Message
//                     </th>
//                     <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-gray-100">
//                   {currentMessages.map((msg) => (
//                     <tr
//                       key={msg.id}
//                       className="hover:bg-gray-50 transition cursor-pointer"
//                       onClick={() => {
//                         setSelectedMessage(msg);
//                         setModalOpen(true);
//                       }}
//                     >
//                       <td className="px-4 py-3 text-sm text-gray-400 font-medium">
//                         {msg.id}
//                       </td>
//                       <td className="px-4 py-3 text-sm font-medium text-gray-900">
//                         {msg.first_name} {msg.last_name}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-600">
//                         {msg.mobile}
//                       </td>
//                       <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
//                         {msg.message.length > 60
//                           ? `${msg.message.slice(0, 60)}…`
//                           : msg.message}
//                       </td>
//                       <td
//                         className="px-4 py-3 text-center"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <button
//                           onClick={() => {
//                             setSelectedMessage(msg);
//                             setModalOpen(true);
//                           }}
//                           className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
//                           title="View details"
//                         >
//                           <Eye size={16} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
//                 <span className="text-sm text-gray-500">
//                   Showing {indexOfFirst + 1}–
//                   {Math.min(indexOfLast, filteredMessages.length)} of{" "}
//                   {filteredMessages.length}
//                 </span>
//                 <div className="flex gap-1">
//                   <button
//                     onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
//                     disabled={currentPage === 1}
//                     className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
//                   >
//                     <ChevronLeft size={15} />
//                   </button>
//                   {getPageNumbers().map((page) => (
//                     <button
//                       key={page}
//                       onClick={() => setCurrentPage(page)}
//                       className={`w-8 h-8 flex items-center justify-center rounded border transition ${
//                         currentPage === page
//                           ? "bg-purple-600 border-purple-600 text-white"
//                           : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
//                       }`}
//                     >
//                       {page}
//                     </button>
//                   ))}
//                   <button
//                     onClick={() =>
//                       setCurrentPage((p) => Math.min(p + 1, totalPages))
//                     }
//                     disabled={currentPage === totalPages}
//                     className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
//                   >
//                     <ChevronRight size={15} />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {/* Modal */}
//       {modalOpen && selectedMessage && (
//         <div
//           className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
//           onClick={() => setModalOpen(false)}
//         >
//           <div
//             className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="flex justify-between items-center p-4 border-b border-gray-100">
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Message Details
//               </h3>
//               <button
//                 onClick={() => setModalOpen(false)}
//                 className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
//               >
//                 <X size={18} />
//               </button>
//             </div>

//             <div className="p-5 space-y-4 overflow-y-auto">
//               <div className="flex items-center gap-3">
//                 <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg font-bold">
//                   {selectedMessage.first_name.charAt(0).toUpperCase()}
//                   {selectedMessage.last_name.charAt(0).toUpperCase()}
//                 </div>
//                 <div>
//                   <h4 className="text-lg font-semibold text-gray-900">
//                     {selectedMessage.first_name} {selectedMessage.last_name}
//                   </h4>
//                   <p className="text-sm text-gray-500">
//                     {selectedMessage.mobile}
//                   </p>
//                 </div>
//               </div>

//               <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
//                 <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
//                   Message
//                 </p>
//                 <p className="text-gray-700 whitespace-pre-wrap break-words">
//                   {selectedMessage.message}
//                 </p>
//               </div>
//             </div>

//             <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
//               <button
//                 onClick={() => setModalOpen(false)}
//                 className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes fade-in {
//           from { opacity: 0; transform: scale(0.95); }
//           to { opacity: 1; transform: scale(1); }
//         }
//         .animate-in {
//           animation: fade-in 0.2s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import {
  Eye,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Download,
  Calendar,
} from "lucide-react";
import * as XLSX from "xlsx";

const BASE_URL = "https://codingcloudapi.codingcloud.co.in";

const fetchMessages = async () => {
  const response = await fetch(`${BASE_URL}/register_msg/`);
  if (!response.ok) throw new Error(`HTTP error ${response.status}`);
  const data = await response.json();
  if (data.status === "success" && Array.isArray(data.data)) {
    return data.data;
  }
  throw new Error("Invalid data format");
};

export default function RegisterMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchMessages()
      .then((data) => {
        setMessages(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Helper: get local date string (YYYY-MM-DD) from ISO timestamp
  const getLocalDate = (isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    return date.toLocaleDateString("en-CA");
  };

  // Date range filter
  const isWithinDateRange = (msg) => {
    if (!startDate && !endDate) return true;
    const msgDate = getLocalDate(msg.created_at);
    if (!msgDate) return false;

    if (startDate && !endDate) return msgDate >= startDate;
    if (!startDate && endDate) return msgDate <= endDate;
    return msgDate >= startDate && msgDate <= endDate;
  };

  // Filter messages based on date range and search
  const filteredMessages = messages.filter((msg) => {
    // 1. Date filter
    if (!isWithinDateRange(msg)) return false;

    // 2. Search filter
    const fullName = `${msg.first_name} ${msg.last_name}`.toLowerCase();
    const searchLower = search.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      msg.mobile.includes(searchLower) ||
      msg.message.toLowerCase().includes(searchLower)
    );
  });

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMessages.length / itemsPerPage);

  const getPageNumbers = () => {
    if (totalPages <= 5)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5];
    if (currentPage >= totalPages - 2)
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  // Reset page when search or date changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, startDate, endDate]);

  // Export to Excel – respects current date range & search
  const exportToExcel = () => {
    if (filteredMessages.length === 0) return;

    // Sort by ID ascending for the export
    const sortedForExport = [...filteredMessages].sort(
      (a, b) => (parseInt(a.id) || 0) - (parseInt(b.id) || 0),
    );

    const excelData = sortedForExport.map((msg, index) => ({
      "No.": index + 1,
      ID: msg.id,
      "First Name": msg.first_name,
      "Last Name": msg.last_name,
      Mobile: msg.mobile,
      Message: msg.message,
      "Created At": msg.created_at
        ? new Date(msg.created_at).toLocaleString()
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Registration Messages");

    const fileName = `registration_messages_${startDate || "all"}_${
      endDate || "all"
    }_${new Date().toISOString().slice(0, 19)}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  // Clear all filters (search + dates)
  const clearAllFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-11 h-11 border-3 border-purple-100 border-t-purple-600 rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-gray-400 font-medium">Loading messages…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm text-center">
          <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={22} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Something went wrong
          </h3>
          <p className="text-gray-500 mb-5">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-6 max-w-6xl mx-auto">
      {/* Header with Export Button */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-400 rounded-xl flex items-center justify-center shadow-md">
              <MessageSquare size={18} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Registration Messages
            </h1>
            <span className="px-3 py-0.5 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
              {messages.length}
            </span>
          </div>
          <p className="text-gray-500 text-sm ml-12">
            View all messages submitted through the registration form
          </p>
        </div>
        <button
          onClick={exportToExcel}
          disabled={filteredMessages.length === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
            filteredMessages.length === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 shadow-sm"
          }`}
        >
          <Download size={18} />
          Export to Excel ({filteredMessages.length})
        </button>
      </div>

      {/* Search Bar + Date Range */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name, mobile, or message…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Calendar
                size={14}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                placeholder="Start date"
              />
            </div>
            <span className="text-gray-400">—</span>
            <div className="relative">
              <Calendar
                size={14}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none text-sm"
                placeholder="End date"
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
                className="px-3 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
              >
                Clear dates
              </button>
            )}
          </div>
        </div>

        {/* Clear all filters button */}
        {(search || startDate || endDate) && (
          <div className="mt-3 text-right">
            <button
              onClick={clearAllFilters}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-1">
            No messages found
          </h3>
          <p className="text-gray-500">
            {search || startDate || endDate
              ? "Try adjusting your filters."
              : "No registration messages yet."}
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Mobile
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Message
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {currentMessages.map((msg) => (
                    <tr
                      key={msg.id}
                      className="hover:bg-gray-50 transition cursor-pointer"
                      onClick={() => {
                        setSelectedMessage(msg);
                        setModalOpen(true);
                      }}
                    >
                      <td className="px-4 py-3 text-sm text-gray-400 font-medium">
                        {msg.id}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {msg.first_name} {msg.last_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {msg.mobile}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                        {msg.message.length > 60
                          ? `${msg.message.slice(0, 60)}…`
                          : msg.message}
                      </td>
                      <td
                        className="px-4 py-3 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            setSelectedMessage(msg);
                            setModalOpen(true);
                          }}
                          className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition"
                          title="View details"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm text-gray-500">
                  Showing {indexOfFirst + 1}–
                  {Math.min(indexOfLast, filteredMessages.length)} of{" "}
                  {filteredMessages.length}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    <ChevronLeft size={15} />
                  </button>
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 flex items-center justify-center rounded border transition ${
                        currentPage === page
                          ? "bg-purple-600 border-purple-600 text-white"
                          : "border-gray-300 bg-white text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(p + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="w-8 h-8 flex items-center justify-center rounded border border-gray-300 bg-white text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                  >
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Modal */}
      {modalOpen && selectedMessage && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">
                Message Details
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 overflow-y-auto">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg font-bold">
                  {selectedMessage.first_name.charAt(0).toUpperCase()}
                  {selectedMessage.last_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {selectedMessage.first_name} {selectedMessage.last_name}
                  </h4>
                  <p className="text-sm text-gray-500">
                    {selectedMessage.mobile}
                  </p>
                </div>
              </div>

              {selectedMessage.created_at && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                    Submitted on
                  </p>
                  <p className="text-sm text-gray-700">
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Message
                </p>
                <p className="text-gray-700 whitespace-pre-wrap break-words">
                  {selectedMessage.message}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-in {
          animation: fade-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
