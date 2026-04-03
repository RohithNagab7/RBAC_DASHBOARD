import User, { IUser } from "@/models/User";
import { BaseRepository } from "@/repositories/base.repository";

export class UserRepository extends BaseRepository {
  async create(userData: Partial<IUser>): Promise<any> {
    await this.ensureConnection();
    const user = new User(userData);
    const savedUser = await user.save();
    return savedUser.toJSON();
  }

  async findByEmail(email: string, includePassword = false): Promise<any | null> {
    await this.ensureConnection();
    const query = User.findOne({ email }).lean();
    if (includePassword) {
      query.select("+password");
    }
    return await query.exec();
  }

  async findById(id: string): Promise<any | null> {
    await this.ensureConnection();
    return await User.findById(id).lean().exec();
  }

  async findAll(filter: any = {}, options: { page?: number; limit?: number; search?: string } = {}): Promise<{ users: any[]; total: number }> {
    await this.ensureConnection();
    const { page = 1, limit = 10, search } = options;
    const skip = (page - 1) * limit;

    const queryFilter = { ...filter };
    if (search) {
      queryFilter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      User.find(queryFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(queryFilter),
    ]);

    return { users, total };
  }

  async update(id: string, updateData: Partial<IUser>): Promise<any | null> {
    await this.ensureConnection();
    return await User.findByIdAndUpdate(id, updateData, { new: true }).lean().exec();
  }

  async delete(id: string): Promise<any | null> {
    await this.ensureConnection();
    return await User.findByIdAndDelete(id).lean().exec();
  }

  async exists(email: string): Promise<boolean> {
    await this.ensureConnection();
    const count = await User.countDocuments({ email });
    return count > 0;
  }
}

export const userRepository = new UserRepository();
