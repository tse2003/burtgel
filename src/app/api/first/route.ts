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
    comment: formData.get("comment") || "",        // Шинээр нэмсэн comment талбар
    createdAt: new Date(),
  };

  await client.connect();
  const result = await collection.insertOne(data);
  return NextResponse.json({ success: true, insertedId: result.insertedId });
}

// GET - Бүх захиалгуудыг авах
export async function GET() {
  await client.connect();
  const list = await collection.find().sort({ createdAt: -1 }).toArray();

  const cleaned = list.map((item) => ({
    ...item,
    _id: item._id.toString(),
    selected: item.selected || false,
    comment: item.comment || "",
  }));

  return NextResponse.json(cleaned);
}

// PATCH - Checkbox болон сэтгэгдэл хадгалах
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, selected, comment } = body;

  await client.connect();

  const updateFields: any = {};
  if (typeof selected === 'boolean') updateFields.selected = selected;
  if (typeof comment === 'string') updateFields.comment = comment;

  if (Object.keys(updateFields).length === 0) {
    return NextResponse.json({ error: 'Шинэчилэх утга байхгүй' }, { status: 400 });
  }

  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateFields }
  );

  return NextResponse.json({ success: true });
}

// DELETE - Захиалга устгах
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID параметр заавал шаардлагатай' }, { status: 400 });
  }

  await client.connect();
  const result = await collection.deleteOne({ _id: new ObjectId(id) });

  if (result.deletedCount === 0) {
    return NextResponse.json({ error: 'Устгах захиалга олдсонгүй' }, { status: 404 });
  }

  return NextResponse.json({ success: true, deletedId: id });
}
