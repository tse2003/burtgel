// app/api/first/[id]/checkbox/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const client = await MongoClient.connect(process.env.MONGO!);
  const db = client.db();
  const collection = db.collection("first");

  const { selected } = await req.json();

  await collection.updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { selected } }
  );

  client.close();
  return NextResponse.json({ success: true });
}
