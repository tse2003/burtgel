import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGO!;
const client = new MongoClient(uri);
const db = client.db();
const collection = db.collection("first");

// POST - Захиалга нэмэх
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const data = {
    khayg: formData.get("khayg"),
    utas: formData.get("utas"),
    filter: formData.get("filter"),
    une: formData.get("une"),
    selected: formData.get("selected") === "true", // checkbox
    createdAt: new Date(),
  };

  await client.connect();
  const result = await collection.insertOne(data);
  return NextResponse.json({ success: true, insertedId: result.insertedId });
}

// GET - Бүх захиалгууд
export async function GET() {
  await client.connect();
  const list = await collection.find().sort({ createdAt: -1 }).toArray();

  const cleaned = list.map((item) => ({
    ...item,
    _id: item._id.toString(),
    selected: item.selected || false,
  }));

  return NextResponse.json(cleaned);
}

// PATCH - Checkbox утга хадгалах
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, selected } = body;

  await client.connect();
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { selected: selected } }
  );

  return NextResponse.json({ success: true });
}
