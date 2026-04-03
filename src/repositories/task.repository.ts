import Task, { ITask } from "@/models/Task";
import { BaseRepository } from "@/repositories/base.repository";

export class TaskRepository extends BaseRepository {
  async create(taskData: Partial<ITask>): Promise<any> {
    await this.ensureConnection();
    const task = new Task(taskData);
    const savedTask = await task.save();
    return savedTask.toJSON();
  }

  async findById(id: string): Promise<any | null> {
    await this.ensureConnection();
    return await Task.findById(id).lean().exec();
  }

  async findAll(filter: any = {}, options: { page?: number; limit?: number; search?: string } = {}): Promise<{ tasks: any[]; total: number }> {
    await this.ensureConnection();
    const { page = 1, limit = 10, search } = options;
    const skip = (page - 1) * limit;

    const queryFilter = { ...filter };
    if (search) {
      queryFilter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const [tasks, total] = await Promise.all([
      Task.find(queryFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Task.countDocuments(queryFilter),
    ]);

    return { tasks, total };
  }

  async update(id: string, updateData: Partial<ITask>): Promise<any | null> {
    await this.ensureConnection();
    return await Task.findByIdAndUpdate(id, updateData, { new: true }).lean().exec();
  }

  async delete(id: string): Promise<any | null> {
    await this.ensureConnection();
    return await Task.findByIdAndDelete(id).lean().exec();
  }
}

export const taskRepository = new TaskRepository();
