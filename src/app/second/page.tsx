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

const LOCAL_STORAGE_KEY = 'orders_selected';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [targetOrderId, setTargetOrderId] = useState<string | null>(null);
  const [pinInput, setPinInput] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch('/api/second');
    const data: Order[] = await res.json();

    const savedSelected = localStorage.getItem(LOCAL_STORAGE_KEY);
    const selectedMap: Record<string, boolean> = savedSelected ? JSON.parse(savedSelected) : {};

    const withSelected = data.map((order) => ({
      ...order,
      selected: selectedMap[order._id] ?? order.selected ?? false,
      comment: order.comment || '',
    }));

    setOrders(withSelected);
    setLoading(false);
  };

  const handleCheckboxChange = async (id: string, checked: boolean) => {
    setOrders((prev) => {
      const newOrders = prev.map((order) =>
        order._id === id ? { ...order, selected: checked } : order
      );

      const selectedMap: Record<string, boolean> = {};
      newOrders.forEach((order) => {
        if (order.selected) selectedMap[order._id] = true;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedMap));

      return newOrders;
    });

    try {
      await fetch('/api/second', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, selected: checked }),
      });
    } catch (error) {
      console.error('Checkbox update error:', error);
    }
  };

  const handleCommentChange = async (id: string, comment: string) => {
    setOrders((prev) =>
      prev.map((order) => (order._id === id ? { ...order, comment } : order))
    );

    try {
      await fetch('/api/second', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, comment }),
      });
    } catch (error) {
      console.error('Comment update error:', error);
    }
  };

  const handleDeleteConfirm = (id: string) => {
    setTargetOrderId(id);
    setPinInput('');
    setShowDialog(true);
  };

  const deleteOrder = async () => {
    if (pinInput !== '0516') {
      alert('Буруу PIN код!');
      return;
    }

    if (!targetOrderId) return;

    try {
      const res = await fetch(`/api/second?id=${targetOrderId}`, { method: 'DELETE' });
      const data = await res.json();

      if (data.success) {
        setOrders((prev) => prev.filter((order) => order._id !== targetOrderId));
        const savedSelected = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedSelected) {
          const selectedMap = JSON.parse(savedSelected);
          delete selectedMap[targetOrderId];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedMap));
        }
        setShowDialog(false);
      } else {
        alert('Устгах үед алдаа гарлаа: ' + data.message);
      }
    } catch (error) {
      alert('Алдаа гарлаа: ' + error);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ТӨМӨР-ОЧИРЫН АЖИЛ</h1>

      {loading ? (
        <p>Уншиж байна...</p>
      ) : orders.length === 0 ? (
        <p>Захиалга байхгүй байна.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-300 rounded-md">
          <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white">
            <thead className="bg-gray-100 hidden md:table-header-group">
              <tr>
                <th className="px-4 py-2 border">Сонгох</th>
                <th className="px-4 py-2 border">Хаяг</th>
                <th className="px-4 py-2 border">Утас</th>
                <th className="px-4 py-2 border">Шүүлтүүр</th>
                <th className="px-4 py-2 border">Үнэ</th>
                <th className='px-4 py-2 border'>Очих цаг</th>
                <th className="px-4 py-2 border">Огноо</th>
                <th className="px-4 py-2 border">Сэтгэгдэл</th>
                <th className="px-4 py-2 border">Устгах</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className={`md:text-center ${order.selected ? 'bg-green-100' : ''}`}
                >
                  <td className="px-4 py-2 border md:table-cell flex justify-center items-center">
                    <input
                      type="checkbox"
                      checked={order.selected || false}
                      onChange={(e) =>
                        handleCheckboxChange(order._id, e.target.checked)
                      }
                      className="w-5 h-5 text-green-500 accent-green-500"
                    />
                  </td>
                  <td className="px-4 py-2 border">{order.khayg}</td>
                  <td className="px-4 py-2 border">{order.utas}</td>
                  <td className="px-4 py-2 border">{order.filter}</td>
                  <td className="px-4 py-2 border">{order.une}</td>
                  <td className="px-4 py-2 border">{order.time}</td>
                  <td className="px-4 py-2 border text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString('mn-MN')}
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="text"
                      value={order.comment || ''}
                      onChange={(e) =>
                        handleCommentChange(order._id, e.target.value)
                      }
                      placeholder="Сэтгэгдэл бичих..."
                      className="w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </td>
                  <td className="px-4 py-2 border text-center">
                    <button
                      onClick={() => handleDeleteConfirm(order._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Устгах
                    </button>
                  </td>

                  {/* Mobile responsive styles */}
                  <style jsx>{`
                    @media (max-width: 767px) {
                      tr {
                        display: block;
                        margin-bottom: 1rem;
                        border: 2px solid #d1d5db;
                        border-radius: 0.375rem;
                        background: ${order.selected ? '#dcfce7' : 'white'};
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
                        content: attr(data-label) ": ";
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

      {/* Dialog */}
      {showDialog && (
        <div className="fixed inset-0 bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
            <h2 className="text-lg font-bold mb-2">PIN баталгаажуулалт</h2>
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="PIN код оруулна уу"
              className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDialog(false)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Болих
              </button>
              <button
                onClick={deleteOrder}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
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
