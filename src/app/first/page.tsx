'use client';

import { useEffect, useState } from 'react';

type Order = {
  _id: string;
  khayg: string;
  utas: string;
  filter: string;
  une: string;
  time: string;
  createdAt: string;
  selected?: boolean;
  comment?: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal state
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [targetOrderId, setTargetOrderId] = useState<string | null>(null);
  const correctPin = '0516'; // <-- шаардлагатай PIN

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch('/api/first');
    const data: Order[] = await res.json();
    setOrders(data);
    setLoading(false);
  };

  const handleCheckboxChange = async (id: string, checked: boolean) => {
    setOrders(prev =>
      prev.map(o => (o._id === id ? { ...o, selected: checked } : o))
    );
    await fetch('/api/first', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, selected: checked }),
    });
  };

  const handleCommentChange = async (id: string, value: string) => {
    setOrders(prev =>
      prev.map(o => (o._id === id ? { ...o, comment: value } : o))
    );
    await fetch('/api/first', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, comment: value }),
    });
  };

  const handleDelete = (id: string) => {
    setTargetOrderId(id);
    setShowPinModal(true);
  };

  const confirmDelete = async () => {
    if (pinValue !== correctPin) {
      // PIN буруу бол modal хаагдана, value-нь цэвэрлэгдэнэ
      setPinValue('');
      setShowPinModal(false);
      return;
    }

    const res = await fetch(`/api/first?id=${targetOrderId}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setOrders(prev => prev.filter(o => o._id !== targetOrderId));
    }

    // Reset modal state
    setShowPinModal(false);
    setPinValue('');
    setTargetOrderId(null);
  };

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">УУГАНБАЯРЫН АЖИЛ</h1>

      {loading ? (
        <p>Уншиж байна...</p>
      ) : orders.length === 0 ? (
        <p>Захиалга байхгүй байна.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-300 rounded-md">
          <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white">
            <thead className="bg-gray-100 hidden md:table-header-group">
              <tr>
                {['Сонгох','Хаяг','Утас','Шүүлтүүр','Үнэ','Очих цаг','Огноо','Сэтгэгдэл','Устгах'].map(h => (
                  <th key={h} className="px-4 py-2 border">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id} className={`md:text-center ${order.selected ? 'bg-green-100' : ''}`}>
                  <td className="px-4 py-2 border md:table-cell flex justify-center items-center">
                    <input
                      type="checkbox"
                      checked={order.selected || false}
                      onChange={e => handleCheckboxChange(order._id, e.target.checked)}
                      className="w-5 h-5 accent-green-500"
                    />
                  </td>
                  <td className="px-4 py-2 border" data-label="Хаяг">{order.khayg}</td>
                  <td className="px-4 py-2 border" data-label="Утас">{order.utas}</td>
                  <td className="px-4 py-2 border" data-label="Шүүлтүүр">{order.filter}</td>
                  <td className="px-4 py-2 border" data-label="Үнэ">{order.une}</td>
                  <td className="px-4 py-2 border" date-label="Очих цаг">{order.time}</td>
                  <td className="px-4 py-2 border text-sm text-gray-600" data-label="Огноо">
                    {new Date(order.createdAt).toLocaleString('mn-MN')}
                  </td>
                  <td className="px-4 py-2 border" data-label="Сэтгэгдэл">
                    <input
                      type="text"
                      value={order.comment || ''}
                      onChange={e => handleCommentChange(order._id, e.target.value)}
                      className="w-full border rounded px-2 py-1"
                      placeholder="Сэтгэгдэл бичих"
                    />
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Устгах
                    </button>
                  </td>
                  
                  <style jsx>{`
                    @media (max-width: 767px) {
                      tr {
                        display: block;
                        margin-bottom: 1rem;
                        border: 2px solid #d1d5db;
                        border-radius: 0.375rem;
                        background: ${order.selected ? '#dcfce7' : 'transparent'};
                      }
                      td {
                        display: flex;
                        justify-content: space-between;
                        padding: 0.5rem 1rem;
                        border: none !important;
                        border-bottom: 1px solid #e5e7eb;
                      }
                      td:last-child {
                        border-bottom: none !important;
                      }
                      td[data-label]:before {
                        content: attr(data-label)': ';
                        font-weight: 600;
                        color: #374151;
                      }
                    }
                  `}</style>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 w-80 shadow-md">
            <h2 className="text-lg font-semibold mb-4">PIN код оруулна уу</h2>
            <input
              type="password"
              value={pinValue}
              onChange={e => setPinValue(e.target.value)}
              placeholder="••••"
              className="w-full border px-3 py-2 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowPinModal(false); setPinValue(''); setTargetOrderId(null); }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Цуцлах
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Устгах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
