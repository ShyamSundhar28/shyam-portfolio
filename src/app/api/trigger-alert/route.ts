import { NextRequest, NextResponse } from "next/server";
import { PubSub } from "@google-cloud/pubsub";

const pubSubClient = new PubSub({
  projectId: "shyamportfolio-3f1a3",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const vehicle_id = body.get("vehicle_id") as string;
    const temp = body.get("temp") as string;

    if (!vehicle_id || !temp) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const data = {
      vehicle_id,
      engine_temperature: parseFloat(temp),
      timestamp: new Date().toISOString(),
    };

    const topicName = "telemetry-alerts";
    const dataBuffer = Buffer.from(JSON.stringify(data));

    await pubSubClient.topic(topicName).publishMessage({ data: dataBuffer });

    return NextResponse.json({
      success: true,
      message: "Event Published! The AI Cloud Function is now processing this in the background.",
    });
  } catch (error: any) {
    console.error("Error publishing to Pub/Sub:", error);
    return NextResponse.json(
      { error: "Failed to publish event: " + error.message },
      { status: 500 }
    );
  }
}
