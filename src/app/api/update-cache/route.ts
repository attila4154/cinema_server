import { udpateCache } from "@/app/service/cachingService";

// todo: add auth header

// this function should get all the movies from data from today
// get all the saved film data from db
// for new films update db
// and finally update redis cache for today with film data from csfd

export async function GET() {
  const success = await udpateCache();
  if (!success) {
    return Response.json({
      success: false,
      message: "check the logs",
    });
  }

  return Response.json({ success: true });
}
