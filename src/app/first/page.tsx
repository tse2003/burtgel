'use client';

import { useEffect, useState } from 'react';

type Order = {
  _id: string;
  khayg: string;
  utas: string;
  filter: string;
  une: string;
  createdAt: string;
  selected?: boolean;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/api/first');
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const handleCheckboxChange = async (id: string, checked: boolean) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, selected: checked } : order
      )
    );

    await fetch('/api/first', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, selected: checked }),
    });
  };

  const handleDelete = async (id: string) => {
    const confirmed = confirm('Энэ захиалгыг устгах уу?');
    if (!confirmed) return;

    const res = await fetch(`/api/first?id=${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setOrders((prev) => prev.filter((order) => order._id !== id));
    } else {
      alert('Устгах үйлдэл амжилтгүй боллоо');
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">First Collection Захиалгууд</h1>

      {loading ? (
        <p>Уншиж байна...</p>
      ) : orders.length === 0 ? (
        <p>Захиалга байхгүй байна.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-300 rounded-md">
          <table className="min-w-full table-auto border-collapse border border-gray-300 bg-white">
            <thead className="bg-gray-100 hidden md:table-header-group">
              <tr>
                <th className="px-4 py-2 border border-gray-300">Сонгох</th>
                <th className="px-4 py-2 border border-gray-300">Хаяг</th>
                <th className="px-4 py-2 border border-gray-300">Утас</th>
                <th className="px-4 py-2 border border-gray-300">Шүүлтүүр</th>
                <th className="px-4 py-2 border border-gray-300">Үнэ</th>
                <th className="px-4 py-2 border border-gray-300">Огноо</th>
                <th className="px-4 py-2 border border-gray-300">Устгах</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className={`md:text-center ${
                    order.selected ? 'bg-green-100' : ''
                  }`}
                >
                  <td className="px-4 py-2 border border-gray-300 md:table-cell flex justify-center items-center">
                    <input
                      type="checkbox"
                      checked={order.selected || false}
                      onChange={(e) =>
                        handleCheckboxChange(order._id, e.target.checked)
                      }
                      className="w-5 h-5 text-green-500 accent-green-500"
                      aria-label={`Сонгох ${order.khayg}`}
                    />
                  </td>

                  <td className="px-4 py-2 border border-gray-300 md:table-cell" data-label="Хаяг">
                    {order.khayg}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 md:table-cell" data-label="Утас">
                    {order.utas}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 md:table-cell" data-label="Шүүлтүүр">
                    {order.filter}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 md:table-cell" data-label="Үнэ">
                    {order.une}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 md:table-cell text-sm text-gray-600" data-label="Огноо">
                    {new Date(order.createdAt).toLocaleString('mn-MN')}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 md:table-cell text-center" data-label="Устгах">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Устгах
                    </button>
                  </td>

                  {/* Mobile styling: display each row as block with labels */}
                  <style jsx>{`
                    @media (max-width: 767px) {
                      tr {
                        display: block;
                        margin-bottom: 1rem;
                        border: 2px solid #d1d5db; /* gray-300 */
                        border-radius: 0.375rem;
                        background: ${order.selected ? '#dcfce7' : 'transparent'};
                      }
                      td {
                        display: flex;
                        justify-content: space-between;
                        padding: 0.5rem 1rem;
                        border: none !important;
                        border-bottom: 1px solid #e5e7eb; /* gray-200 */
                      }
                      td:last-child {
                        border-bottom: none !important;
                      }
                      td[data-label]:before {
                        content: attr(data-label) ": ";
                        font-weight: 600;
                        color: #374151; /* gray-700 */
                      }
                      td:first-child {
                        justify-content: flex-start;
                      }
                      td:last-child {
                        justify-content: center;
                      }
                    }
                  `}</style>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
