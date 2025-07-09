import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StockReport = () => {
  const [tools, setTools] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchStockReport = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        alert('Please login first');
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/api/stock-report/${user.email}`);
        setTools(res.data || []);
      } catch (err) {
        console.error('❌ Error fetching stock report:', err);
      }
    };

    fetchStockReport();
  }, []);

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handlePrint = () => {
    window.print();
  };

  // ✅ Prepare final data for print:
  const itemsToPrint = selectedIds.length > 0
    ? tools.filter((t) => selectedIds.includes(t._id))
    : tools;

  return (
    <div className="p-6">
      {/* Hindalco header for print */}
      <div className="hidden print:block text-center mb-4">
        <img src="/hindalco_logo.jpg" alt="Hindalco Logo" className="mx-auto h-16" />
        <h1 className="text-2xl font-bold">Hindalco Industries Ltd.</h1>
        <h2 className="text-lg font-semibold">Tools Stock Report</h2>
        <hr className="my-2 border-black" />
      </div>

      <h2 className="text-2xl font-bold mb-4">Your Stock Report</h2>

      <button
        onClick={handlePrint}
        className="mb-4 bg-blue-700 text-white px-3 py-1 rounded no-print"
      >
        🖨️ Print Selected
      </button>

      {tools.length === 0 ? (
        <p>No tools issued.</p>
      ) : (
        <ul className="space-y-4 print:space-y-2">
          {tools.map(t => (
            <li
              key={t._id}
              className={`bg-gray-100 dark:bg-gray-800 p-4 rounded shadow print:shadow-none print:border print:border-black ${selectedIds.length > 0 && !selectedIds.includes(t._id) ? 'hidden print:hidden' : ''}`}
            >
              <div className="no-print mb-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(t._id)}
                    onChange={() => handleSelect(t._id)}
                  />
                  <span>Select for print</span>
                </label>
              </div>

              <p><strong>Tool:</strong> {t.toolName}</p>
              <p><strong>Issued to:</strong> {t.userId}</p>
              <p><strong>Requested Days:</strong> {t.requestedDays || 'N/A'}</p>
              <p><strong>Reason:</strong> {t.reason || 'N/A'}</p>
              <p><strong>Issued On:</strong> {t.appointedAt ? new Date(t.appointedAt).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Return By:</strong> {t.returnDate ? new Date(t.returnDate).toLocaleDateString() : 'N/A'}</p>
              <p><strong>Status:</strong> {t.status || 'Pending'}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Signature section for print */}
      {itemsToPrint.length > 0 && (
        <div className="hidden print:block mt-10">
          <hr className="border-black my-4" />
          <div className="flex justify-between mt-10">
            <div>
              <p>__________________________</p>
              <p>Admin Signature</p>
            </div>
            <div>
              <p>__________________________</p>
              <p>Toolskeeper Signature</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockReport;
