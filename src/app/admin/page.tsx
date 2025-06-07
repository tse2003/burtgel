'use client';

import { useEffect, useState } from 'react';

type Order = {
  _id: string;
  khayg: string;
  utas: string;
  filter: string;
  une: string;
  createdAt: string;
};

export default function OrderPage() {
  const [firstOrders, setFirstOrders] = useState<Order[]>([]);
  const [secondOrders, setSecondOrders] = useState<Order[]>([]);
  const [formData, setFormData] = useState({
    khayg: '',
    utas: '',
    filter: '',
    une: '',
  });
  const [targetCollection, setTargetCollection] = useState<'first' | 'second'>('second');

  const fetchData = async () => {
    const firstRes = await fetch('/api/first');
    const secondRes = await fetch('/api/second');
    setFirstOrders(await firstRes.json());
    setSecondOrders(await secondRes.json());
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = new FormData();
    form.append('khayg', formData.khayg);
    form.append('utas', formData.utas);
    form.append('filter', formData.filter);
    form.append('une', formData.une);

    const res = await fetch(`/api/${targetCollection}`, {
      method: 'POST',
      body: form,
    });

    if (res.ok) {
      setFormData({ khayg: '', utas: '', filter: '', une: '' });
      fetchData(); // refresh list
    } else {
      alert('Алдаа гарлаа.');
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Add New Order */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto"
      >
        <h2 className="text-xl font-bold mb-4">Шинэ захиалга нэмэх</h2>

        <select
          className="w-full border px-3 py-2 mb-2"
          value={targetCollection}
          onChange={(e) => setTargetCollection(e.target.value as 'first' | 'second')}
        >
          <option value="first">АЖИЛТАН - 1</option>
          <option value="second">АЖИЛТАН - 2</option>
        </select>

        <input
          className="w-full border px-3 py-2 mb-2"
          placeholder="Хаяг"
          value={formData.khayg}
          onChange={(e) => setFormData({ ...formData, khayg: e.target.value })}
          required
        />
        <input
          className="w-full border px-3 py-2 mb-2"
          placeholder="Утас"
          value={formData.utas}
          onChange={(e) => setFormData({ ...formData, utas: e.target.value })}
          required
        />
        <input
          className="w-full border px-3 py-2 mb-2"
          placeholder="Шүүлтүүр"
          value={formData.filter}
          onChange={(e) => setFormData({ ...formData, filter: e.target.value })}
          required
        />
        <input
          className="w-full border px-3 py-2 mb-4"
          placeholder="Үнэ"
          value={formData.une}
          onChange={(e) => setFormData({ ...formData, une: e.target.value })}
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          Хадгалах
        </button>
      </form>

      {/* First Collection */}
      {/* <div>
        <h3 className="text-2xl font-semibold mb-2">First Collection</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {firstOrders.map((order) => (
            <div key={order._id} className="p-4 bg-gray-100 rounded shadow">
              <p><strong>Хаяг:</strong> {order.khayg}</p>
              <p><strong>Утас:</strong> {order.utas}</p>
              <p><strong>Шүүлтүүр:</strong> {order.filter}</p>
              <p><strong>Үнэ:</strong> {order.une}</p>
              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div> */}

      {/* Second Collection */}
      {/* <div>
        <h3 className="text-2xl font-semibold mb-2">Second Collection</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {secondOrders.map((order) => (
            <div key={order._id} className="p-4 bg-gray-100 rounded shadow">
              <p><strong>Хаяг:</strong> {order.khayg}</p>
              <p><strong>Утас:</strong> {order.utas}</p>
              <p><strong>Шүүлтүүр:</strong> {order.filter}</p>
              <p><strong>Үнэ:</strong> {order.une}</p>
              <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
}
