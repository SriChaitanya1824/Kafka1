import { Model, FilterQuery, UpdateQuery } from "mongoose";
export class BaseRepository<T> {
  constructor(private model: Model<T>) {}
  create(data: object) { return this.model.create(data); }
  findById(id: string) { return this.model.findById(id); }
  findOne(filter: FilterQuery<T>) { return this.model.findOne(filter); }
  updateById(id: string, data: UpdateQuery<T>) { return this.model.findByIdAndUpdate(id, data, { new: true }); }
  deleteById(id: string) { return this.model.findByIdAndDelete(id); }
  async paginate(filter: FilterQuery<T>, page = 1, limit = 20, sort: Record<string, 1 | -1> = { createdAt: -1 }) {
    const [items, total] = await Promise.all([this.model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit), this.model.countDocuments(filter)]);
    return { items, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) || 1 } };
  }
}
