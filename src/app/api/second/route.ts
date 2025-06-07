import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

// MongoDB connection
const clientPromise = MongoClient.connect(process.env.MONGO!);

// ➕ POST: Add new document
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const data = {
    khayg: formData.get('khayg'),
    utas: formData.get('utas'),
    filter: formData.get('filter'),
    une: formData.get('une'),
    createdAt: new Date(),
  };

  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('second');

  const result = await collection.insertOne(data);

  return NextResponse.json({ success: true, insertedId: result.insertedId });
}

// 📥 GET: Fetch all documents
export async function GET() {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('second');

  const list = await collection.find().sort({ createdAt: -1 }).toArray();

  const cleaned = list.map((item) => ({
    ...item,
    _id: item._id.toString(),
  }));

  return NextResponse.json(cleaned);
}

// ❌ DELETE: Remove document by ID
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing id' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection('second');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: 'Item not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}

// ✏️ PATCH: Update 'selected' or 'comment' fields
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, selected, comment } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();
    const collection = db.collection("second");

    const updateFields: Record<string, any> = {};
    if (selected !== undefined) updateFields.selected = selected;
    if (comment !== undefined) updateFields.comment = comment;

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.modifiedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, message: "Item not updated" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: (error as Error).message }, { status: 500 });
  }
}
