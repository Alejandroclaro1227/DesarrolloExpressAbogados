const IRepository = require('../interfaces/IRepository');
const AppError = require('../utils/appError');

/**
 * Base Repository for common CRUD operations
 */
class BaseRepository extends IRepository {
  constructor(model) {
    super();
    this.model = model;
  }

  async create(data) {
    try {
      return await this.model.create(data);
    } catch (error) {
      this._handleSequelizeError(error);
    }
  }

  async findById(id) {
    try {
      const result = await this.model.findByPk(id);
      if (!result) {
        throw new AppError(`${this.model.name} not found`, 404);
      }
      return result;
    } catch (error) {
      this._handleSequelizeError(error);
    }
  }

  async findAll(options = {}) {
    try {
      const { page = 1, limit = 10, where = {}, include = [], order = [] } = options;
      const offset = (page - 1) * limit;

      const result = await this.model.findAndCountAll({
        where,
        include,
        order,
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      return {
        data: result.rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: result.count,
          totalPages: Math.ceil(result.count / limit),
          hasNextPage: page < Math.ceil(result.count / limit),
          hasPrevPage: page > 1,
        },
      };
    } catch (error) {
      this._handleSequelizeError(error);
    }
  }

  async update(id, data) {
    try {
      const record = await this.findById(id);
      return await record.update(data);
    } catch (error) {
      this._handleSequelizeError(error);
    }
  }

  async delete(id) {
    try {
      const record = await this.findById(id);
      await record.destroy();
      return { message: `${this.model.name} deleted successfully` };
    } catch (error) {
      this._handleSequelizeError(error);
    }
  }

  async findOne(criteria) {
    try {
      return await this.model.findOne(criteria);
    } catch (error) {
      this._handleSequelizeError(error);
    }
  }

  async count(criteria = {}) {
    try {
      return await this.model.count(criteria);
    } catch (error) {
      this._handleSequelizeError(error);
    }
  }

  /**
   * Handle Sequelize errors
   */
  _handleSequelizeError(error) {
    if (error instanceof AppError) {
      throw error;
    }

    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map(err => err.message);
      throw new AppError(`Validation error: ${messages.join(', ')}`, 400);
    }

    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      throw new AppError(`${field} already exists`, 409);
    }

    if (error.name === 'SequelizeForeignKeyConstraintError') {
      throw new AppError('Referenced record does not exist', 400);
    }

    throw new AppError(error.message || 'Database operation failed', 500);
  }
}

module.exports = BaseRepository;
