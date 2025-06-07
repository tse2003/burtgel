import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const clientPromise = MongoClient.connect(process.env.MONGO!);

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
