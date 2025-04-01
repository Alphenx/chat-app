enum Response {
  OK = 'OK',
}

abstract class BaseRepository<T> {
  protected db: Database;
  protected key: Record<string, (id: string) => string> = {};

  constructor(db: Database) {
    this.db = db;
  }

  // COMMON
  /** Checks if an entry exists */
  protected async exists(key: string): Promise<boolean> {
    return (await this.db.exists(key)) === 1;
  }

  // HASHES
  /** Creates a new entry as a hash map. If the key already exists, it will be overwritten. */
  protected async set(key: string, values: Partial<T>): Promise<T | null> {
    const [created, result] = await this.db.pipeline().hset(key, values).hgetall(key).exec();

    if (created < 0 || !result || Object.keys(result).length === 0) return null;
    return result as T;
  }

  /** Retrieves a complete entry as a map */
  protected async get(key: string): Promise<T | null> {
    const data = await this.db.hgetall(key);
    if (!data || Object.keys(data).length === 0) return null;
    return data as T;
  }

  /** Deletes an entry */
  protected async delete(key: string | string[]): Promise<boolean> {
    if (Array.isArray(key)) {
      const result = await this.db.del(...key);
      return result === key.length;
    }
    return (await this.db.del(key)) === 1;
  }

  /** Checks if a field exists in an entry */
  protected async existsField(key: string, field: string): Promise<boolean> {
    return (await this.db.hexists(key, field)) === 1;
  }

  /** Retrieves a field from an entry */
  protected async getField<U>(key: string, field: string): Promise<U | null> {
    const value = await this.db.hget(key, field);
    return value as U;
  }

  /** Deletes a field from an entry */
  protected async deleteField(key: string, field: string): Promise<boolean> {
    return (await this.db.hdel(key, field)) === 1;
  }

  // STRINGS
  /** Creates a key with a simple string value. If the key already exists, its value will be overwritten. */
  protected async setValue<U>(key: string, value: U, ex?: number): Promise<U | null> {
    const result = await this.db.set(key, value, ex ? { ex } : undefined);
    return result !== Response.OK ? null : value;
  }

  /** Updates a key with a combined value of the current and new value. If the key does not exist, it will not create a new one. */
  protected async updateValue<U>(key: string, updates: U): Promise<U | null> {
    const currentValue = await this.getValue<U>(key);
    if (currentValue === null) return null;

    let combinedValue: U;
    if (typeof currentValue === 'object' && typeof updates === 'object') {
      combinedValue = { ...currentValue, ...updates };
    } else {
      combinedValue = updates;
    }

    const result = await this.db.set(key, combinedValue);
    return result !== Response.OK ? null : combinedValue;
  }

  /** Retrieves a value as a parsed string */
  protected async getValue<U>(key: string): Promise<U | null> {
    const value = await this.db.get<U>(key);
    return value ? (value as U) : null;
  }

  // SETS
  /** Adds a member to a set */
  protected async addToSet(key: string, member: string): Promise<boolean> {
    return (await this.db.sadd(key, member)) === 1;
  }

  /** Retrieves all members from a set */
  protected async getSetMembers(key: string): Promise<string[]> {
    return await this.db.smembers(key);
  }

  /** Removes a member from a set */
  protected async removeFromSet(key: string, member: string): Promise<boolean> {
    return (await this.db.srem(key, member)) === 1;
  }

  /** Checks if a member exists in a set */
  protected async isSetMember(key: string, member: string): Promise<boolean> {
    return (await this.db.sismember(key, member)) === 1;
  }

  // SORTED SETS
  /** Adds a member to a sorted set */
  protected async addToSortedSet(key: string, member: string, score: number): Promise<boolean> {
    return (await this.db.zadd(key, { score, member })) === 1;
  }

  /** Retrieves all members from a sorted set */
  protected async getSortedSetMembers(key: string): Promise<string[]> {
    return await this.db.zrange(key, 0, -1);
  }

  /** Removes a member from a sorted set */
  protected async removeFromSortedSet(key: string, member: string): Promise<boolean> {
    return (await this.db.zrem(key, member)) === 1;
  }

  /** Checks if a member exists in a sorted set */
  protected async isSortedSetMember(key: string, member: string): Promise<boolean> {
    return (await this.db.zrank(key, member)) !== null;
  }
}

export default BaseRepository;
