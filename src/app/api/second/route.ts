import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// POST: Захиалга хадгалах
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const data = {
    khayg: formData.get('khayg'),
    utas: formData.get('utas'),
    filter: formData.get('filter'),
    une: formData.get('une'),
    createdAt: new Date(),
  };

  const client = await MongoClient.connect(process.env.MONGO!);
  const db = client.db();
  const collection = db.collection('second');

  const result = await collection.insertOne(data);
  client.close();

  return NextResponse.json({ success: true, insertedId: result.insertedId });
}

// GET: Бүх захиалгуудыг авах
export async function GET() {
  const client = await MongoClient.connect(process.env.MONGO!);
  const db = client.db();
  const collection = db.collection('second');

  const list = await collection.find().sort({ createdAt: -1 }).toArray();
  client.close();

  const cleaned = list.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));

  return NextResponse.json(cleaned);
}
