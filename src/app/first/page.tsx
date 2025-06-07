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
    // UI дээрх төлвийг өөрчилнө
    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, selected: checked } : order
      )
    );

    // Серверт хадгалах хүсэлт явуулна
    await fetch('/api/first', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, selected: checked }),
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">First Collection Захиалгууд</h1>

      {loading ? (
        <p>Уншиж байна...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Сонгох</th>
                <th className="px-4 py-2 border">Хаяг</th>
                <th className="px-4 py-2 border">Утас</th>
                <th className="px-4 py-2 border">Шүүлтүүр</th>
                <th className="px-4 py-2 border">Үнэ</th>
                <th className="px-4 py-2 border">Огноо</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className={`text-center transition-colors ${
                    order.selected ? 'bg-green-100' : ''
                  }`}
                >
                  <td className="px-4 py-2 border">
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
                  <td className="px-4 py-2 border text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleString('mn-MN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
