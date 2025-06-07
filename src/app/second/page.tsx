'use client';

import { useEffect, useState } from 'react';

type Order = {
  _id: string;
  khayg: string;
  utas: string;
  filter: string;
  une: string;
  createdAt: string;
  selected?: boolean; // checkbox сонголт
};

const LOCAL_STORAGE_KEY = 'orders_selected';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Серверээс захиалгуудыг авах + localStorage-аас selected мэдээллийг авах
  useEffect(() => {
    const fetchOrders = async () => {
      const res = await fetch('/api/second');
      const data: Order[] = await res.json();

      // localStorage-аас selected checkbox-ын мэдээллийг авах
      const savedSelected = localStorage.getItem(LOCAL_STORAGE_KEY);
      const selectedMap: Record<string, boolean> = savedSelected
        ? JSON.parse(savedSelected)
        : {};

      // server-с ирсэн захиалгуудыг selected утгатай хослуулах
      const withSelected = data.map((order) => ({
        ...order,
        selected: selectedMap[order._id] ?? false,
      }));

      setOrders(withSelected);
      setLoading(false);
    };

    fetchOrders();
  }, []);

  // Checkbox-ийн өөрчлөлт гарахад state болон localStorage-д хадгалах
  const handleCheckboxChange = (id: string, checked: boolean) => {
    setOrders((prev) => {
      const newOrders = prev.map((order) =>
        order._id === id ? { ...order, selected: checked } : order
      );

      // localStorage-д хадгалах
      const selectedMap: Record<string, boolean> = {};
      newOrders.forEach((order) => {
        if (order.selected) selectedMap[order._id] = true;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(selectedMap));

      return newOrders;
    });
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
