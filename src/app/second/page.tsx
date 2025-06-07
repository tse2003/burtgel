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

const LOCAL_STORAGE_KEY = 'orders_selected';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch('/api/second');
    const data: Order[] = await res.json();

    const savedSelected = localStorage.getItem(LOCAL_STORAGE_KEY);
    const selectedMap: Record<string, boolean> = savedSelected
      ? JSON.parse(savedSelected)
      : {};

    const withSelected = data.map((order) => ({
      ...order,
      selected: selectedMap[order._id] ?? false,
    }));

    setOrders(withSelected);
    setLoading(false);
  };

  const handleCheckboxChange = (id: string, checked: boolean) => {
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
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Энэ захиалгыг устгах уу?')) return;

    const res = await fetch(`/api/second?id=${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (data.success) {
      setOrders((prev) => prev.filter((order) => order._id !== id));

      // Мөн localStorage-аас ч устгах
      const savedSelected = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedSelected) {
        const selectedMap = JSON.parse(savedSelected);
        delete selectedMap[id];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedMap));
      }
    } else {
      alert('Устгах үед алдаа гарлаа: ' + data.message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Second Collection Захиалгууд</h1>

      {loading ? (
        <p>Уншиж байна...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300 bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Устгах</th>
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
                  className={`text-center ${order.selected ? 'bg-green-100' : ''}`}
                >
                  <td className="px-4 py-2 border">
                    <input
                      type="checkbox"
                      checked={order.selected ?? false}
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
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Устгах
                    </button>
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
