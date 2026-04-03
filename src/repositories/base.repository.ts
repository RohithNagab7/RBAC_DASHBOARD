import connectDB from "@/lib/db";

export abstract class BaseRepository {
  protected async ensureConnection() {
    await connectDB();
  }
}
