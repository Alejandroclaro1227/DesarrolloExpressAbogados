const BaseRepository = require('./BaseRepository');
const { User } = require('../models');
const AppError = require('../utils/appError');

/**
 * User Repository - Specific data access for User entity
 * Extends BaseRepository following Open/Closed Principle
 */
class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  /**
   * Find user by username
   */
  async findByUsername(username) {
    const user = await this.findOne({ where: { username } });
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return user;
  }

  /**
   * Find users by role
   */
  async findByRole(role, options = {}) {
    const searchOptions = {
      ...options,
      where: {
        ...options.where,
        role,
      },
    };
    return await this.findAll(searchOptions);
  }

  /**
   * Check if username exists
   */
  async existsByUsername(username) {
    const count = await this.count({ where: { username } });
    return count > 0;
  }

  /**
   * Get user statistics
   */
  async getUserStats() {
    const totalCount = await this.count();
    const adminCount = await this.count({ where: { role: 'admin' } });
    const operatorCount = await this.count({ where: { role: 'operator' } });

    return {
      total: totalCount,
      byRole: {
        admin: adminCount,
        operator: operatorCount,
      },
    };
  }

  /**
   * Create user with unique username validation
   */
  async create(data) {
    const exists = await this.existsByUsername(data.username);
    if (exists) {
      throw new AppError('Username already exists', 409);
    }
    
    return await super.create(data);
  }
}

module.exports = UserRepository;
