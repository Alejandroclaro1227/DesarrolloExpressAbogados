const IService = require('../interfaces/IService');
const AppError = require('../utils/appError');
const Logger = require('../utils/logger');

/**
 * Base Service for common business logic operations
 */
class BaseService extends IService {
  constructor(repository) {
    super();
    this.repository = repository;
    this.logger = Logger;
  }

  async create(data) {
    try {
      this.logger.info(`Creating new ${this.constructor.name.replace('Service', '')}`, { data });
      
      // Apply business rules before creation
      await this._validateBeforeCreate(data);
      
      const result = await this.repository.create(data);
      
      this.logger.info(`${this.constructor.name.replace('Service', '')} created successfully`, { id: result.id });
      
      return result;
    } catch (error) {
      this.logger.error(`Error creating ${this.constructor.name.replace('Service', '')}`, { error: error.message, data });
      throw error;
    }
  }

  async getById(id) {
    try {
      this.logger.info(`Fetching ${this.constructor.name.replace('Service', '')} by ID`, { id });
      
      const result = await this.repository.findById(id);
      
      return result;
    } catch (error) {
      this.logger.error(`Error fetching ${this.constructor.name.replace('Service', '')} by ID`, { error: error.message, id });
      throw error;
    }
  }

  async getAll(options = {}) {
    try {
      this.logger.info(`Fetching all ${this.constructor.name.replace('Service', '')}s`, { options });
      
      // Apply business rules for filtering
      const processedOptions = await this._processGetAllOptions(options);
      
      const result = await this.repository.findAll(processedOptions);
      
      return result;
    } catch (error) {
      this.logger.error(`Error fetching ${this.constructor.name.replace('Service', '')}s`, { error: error.message, options });
      throw error;
    }
  }

  async update(id, data) {
    try {
      this.logger.info(`Updating ${this.constructor.name.replace('Service', '')}`, { id, data });
      
      // Apply business rules before update
      await this._validateBeforeUpdate(id, data);
      
      const result = await this.repository.update(id, data);
      
      this.logger.info(`${this.constructor.name.replace('Service', '')} updated successfully`, { id });
      
      return result;
    } catch (error) {
      this.logger.error(`Error updating ${this.constructor.name.replace('Service', '')}`, { error: error.message, id, data });
      throw error;
    }
  }

  async delete(id) {
    try {
      this.logger.info(`Deleting ${this.constructor.name.replace('Service', '')}`, { id });
      
      // Apply business rules before deletion
      await this._validateBeforeDelete(id);
      
      const result = await this.repository.delete(id);
      
      this.logger.info(`${this.constructor.name.replace('Service', '')} deleted successfully`, { id });
      
      return result;
    } catch (error) {
      this.logger.error(`Error deleting ${this.constructor.name.replace('Service', '')}`, { error: error.message, id });
      throw error;
    }
  }

  /**
   * Validation methods for business rules
   */
  async _validateBeforeCreate(data) {
    // Implement in subclasses
  }

  async _validateBeforeUpdate(id, data) {
    // Implement in subclasses
  }

  async _validateBeforeDelete(id) {
    // Implement in subclasses
  }

  async _processGetAllOptions(options) {
    // Implement in subclasses
    return options;
  }
}

module.exports = BaseService;
