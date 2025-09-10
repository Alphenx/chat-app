enum Response {
  OK = 'OK',
}

abstract class BaseRepository<T = Record<string, unknown>> {
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

  /** Retrieves multiple entries as a map */
  protected async getMany(keys: string[], buildKey: (key: string) => string): Promise<T[]> {
    if (keys.length === 0) return [];

    const pipeline = this.db.pipeline();
    for (const key of keys) pipeline.hgetall(buildKey(key));

    const results = await pipeline.exec();

    return results.reduce<T[]>((acc, entry) => {
      if (entry && Object.keys(entry).length > 0) {
        acc.push(entry as T);
      }
      return acc;
    }, []);
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
  protected async addToSet<U>(key: string, member: U): Promise<boolean> {
    return (await this.db.sadd(key, member)) === 1;
  }

  /** Retrieves all members from a set */
  protected async getSetMembers<U = string>(key: string): Promise<U[]> {
    const members = await this.db.smembers(key);
    return members as U[];
  }

  /** Removes a member from a set */
  protected async removeFromSet<U = string>(key: string, member: U): Promise<boolean> {
    return (await this.db.srem(key, member)) === 1;
  }

  /** Checks if a member exists in a set */
  protected async isSetMember<U = string>(key: string, member: U): Promise<boolean> {
    return (await this.db.sismember(key, member)) === 1;
  }

  // SORTED SETS
  /** Adds a member to a sorted set */
  protected async addToSortedSet<U = string>(key: string, member: U, score: number) {
    return (await this.db.zadd(key, { score, member })) === 1;
  }

  /** Retrieves all members from a sorted set */
  protected async getSortedSetMembers<U = string>(key: string): Promise<U[]> {
    const members = await this.db.zrange<string[]>(key, 0, -1);
    return members as U[];
  }

  /** Removes a member from a sorted set */
  protected async removeFromSortedSet<U = string>(key: string, member: U): Promise<boolean> {
    return (await this.db.zrem(key, member)) === 1;
  }

  /** Checks if a member exists in a sorted set */
  protected async isSortedSetMember<U = string>(key: string, member: U): Promise<boolean> {
    return (await this.db.zrank(key, member)) !== null;
  }

  /** Retrieves a range of members from a sorted set */
  protected async getSortedSetRange<U = string>(
    key: string,
    start: number | `(${number}` | '-inf',
    stop: number | `(${number}` | '+inf',
    limit?: { offset: number; count: number },
    rev = true
  ): Promise<U[]> {
    const isScoreRange = typeof start === 'string' || typeof stop === 'string';

    const opts: Record<string, unknown> = {};
    if (isScoreRange) opts.byScore = true;
    if (rev) opts.rev = true;
    if (limit) opts.limit = limit;

    const members = await this.db.zrange<string[]>(key, start as number, stop as number, opts);
    return members as U[];
  }
}

export default BaseRepository;
