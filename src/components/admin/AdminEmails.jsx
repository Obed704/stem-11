import React, { useState, useEffect } from "react";
import NavigationButtons from "./Button";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const AdminInbox = () => {
  const [emails, setEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null); // The "Active" email in the reading pane
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/emails`);
      const data = await res.json();
      setEmails(data);
    } catch (err) {
      console.error("Failed to fetch emails:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  const handleDeleteEmail = async (emailId) => {
    if (!window.confirm("Delete this conversation?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/emails/${emailId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      if (selectedEmail?._id === emailId) setSelectedEmail(null);
      fetchEmails();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const handleReply = (email) => {
    const subject = encodeURIComponent(`Re: ${email.customSubject || email.subject || ""}`);
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email.email}&su=${subject}`;
    window.open(mailtoLink, "_blank");
  };

  // Logic for filtering
  const filteredEmails = emails
    .filter((e) => {
      const content = `${e.name} ${e.email} ${e.subject} ${e.customSubject}`.toLowerCase();
      const matchesSearch = content.includes(search.toLowerCase());
      const matchesStatus = statusFilter === "All" || e.status === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0f111a] text-white">
        <div className="animate-pulse text-pink-500 font-medium">Loading Inbox...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0f111a] text-gray-200 font-sans overflow-hidden">
      <NavigationButtons />

      {/* Top Action Bar */}
      <div className="mt-20 px-6 py-4 flex items-center justify-between border-b border-gray-800 bg-[#161925]">
        <div className="flex items-center gap-4 flex-1 max-w-2xl">
          <h1 className="text-xl font-bold mr-4 bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            Inbox
          </h1>
          <input
            type="text"
            placeholder="Search messages..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-sm"
          />
        </div>

        <div className="flex items-center gap-3 ml-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-xs focus:outline-none"
          >
            <option value="All">All Mail</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          <button onClick={fetchEmails} className="p-2 hover:bg-gray-700 rounded-full transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Sidebar: Email List */}
        <div className="w-full md:w-[400px] border-r border-gray-800 overflow-y-auto bg-[#0f111a]">
          {filteredEmails.length === 0 ? (
            <div className="p-10 text-center text-gray-500 text-sm">No messages found.</div>
          ) : (
            filteredEmails.map((email) => (
              <div
                key={email._id}
                onClick={() => setSelectedEmail(email)}
                className={`p-4 border-b border-gray-800 cursor-pointer transition-all relative ${selectedEmail?._id === email._id ? "bg-gray-800/50 border-l-4 border-l-pink-500" : "hover:bg-gray-800/30"
                  }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-semibold ${email.status === 'unread' ? 'text-white' : 'text-gray-400'}`}>
                    {email.name}
                  </span>
                  <span className="text-[10px] text-gray-500">
                    {new Date(email.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={`text-xs truncate ${email.status === 'unread' ? 'text-pink-400 font-medium' : 'text-gray-400'}`}>
                  {email.customSubject || email.subject || "No Subject"}
                </div>
                <div className="text-xs text-gray-500 truncate mt-1">
                  {email.message}
                </div>
                {email.status === 'unread' && (
                  <div className="absolute right-4 bottom-4 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_8px_rgba(236,72,153,0.6)]"></div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Right Pane: Reading Area */}
        <div className="hidden md:flex flex-1 bg-[#161925] flex-col overflow-y-auto">
          {selectedEmail ? (
            <div className="p-8 max-w-4xl">
              {/* Email Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {selectedEmail.customSubject || selectedEmail.subject || "No Subject"}
                  </h2>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 flex items-center justify-center text-black font-bold">
                      {selectedEmail.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-200">{selectedEmail.name}</div>
                      <div className="text-xs text-gray-500">{`<${selectedEmail.email}>`}</div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleReply(selectedEmail)}
                    className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs rounded-md transition-colors flex items-center gap-2"
                  >
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" /></svg>
                    Reply
                  </button>
                  <button
                    onClick={() => handleDeleteEmail(selectedEmail._id)}
                    className="px-4 py-2 bg-gray-800 hover:bg-red-900/40 text-gray-400 hover:text-red-400 border border-gray-700 rounded-md text-xs transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Email Body */}
              <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 min-h-[300px] text-gray-300 leading-relaxed whitespace-pre-wrap">
                {selectedEmail.message}
              </div>

              <div className="mt-6 text-[11px] text-gray-600 italic">
                Received on: {new Date(selectedEmail.createdAt).toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
              <svg className="w-16 h-16 mb-4 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminInbox;