const BaseService = require('./BaseService');
const LawyerRepository = require('../repositories/LawyerRepository');
const AppError = require('../utils/appError');

/**
 * Lawyer Service - Business logic for Lawyer operations
 * Implements business rules and validation
 */
class LawyerService extends BaseService {
  constructor() {
    const repository = new LawyerRepository();
    super(repository);
  }

  /**
   * Get lawyer with detailed statistics
   */
  async getLawyerWithStats(id) {
    try {
      this.logger.info('Fetching lawyer with statistics', { id });
      
      const result = await this.repository.getLawyerStats(id);
      
      if (!result) {
        throw new AppError('Lawyer not found', 404);
      }
      
      return result;
    } catch (error) {
      this.logger.error('Error fetching lawyer statistics', { error: error.message, id });
      throw error;
    }
  }

  /**
   * Get only active lawyers
   */
  async getActiveLawyers(options = {}) {
    try {
      this.logger.info('Fetching active lawyers', { options });
      
      return await this.repository.findActiveLawyers(options);
    } catch (error) {
      this.logger.error('Error fetching active lawyers', { error: error.message, options });
      throw error;
    }
  }

  /**
   * Find lawyers by specialization
   */
  async getLawyersBySpecialization(specialization, options = {}) {
    try {
      this.logger.info('Fetching lawyers by specialization', { specialization, options });
      
      if (!specialization || specialization.trim().length === 0) {
        throw new AppError('Specialization is required', 400);
      }
      
      return await this.repository.findBySpecialization(specialization, options);
    } catch (error) {
      this.logger.error('Error fetching lawyers by specialization', { 
        error: error.message, 
        specialization, 
        options 
      });
      throw error;
    }
  }

  /**
   * Business rule validation before creating a lawyer
   */
  async _validateBeforeCreate(data) {
    // Validate email format (additional to Joi validation)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new AppError('Invalid email format', 400);
    }

    // Validate phone format (Colombian format)
    const phoneRegex = /^[0-9]{7,15}$/;
    if (!phoneRegex.test(data.phone)) {
      throw new AppError('Phone must contain only numbers and be between 7-15 digits', 400);
    }

    // Business rule: Specialization should be properly capitalized
    if (data.specialization) {
      data.specialization = this._capitalizeSpecialization(data.specialization);
    }
  }

  /**
   * Business rule validation before updating a lawyer
   */
  async _validateBeforeUpdate(id, data) {
    // Apply same validation rules as create
    await this._validateBeforeCreate(data);

    // Additional business rule: Cannot deactivate lawyer with pending cases
    if (data.status === 'inactive') {
      const lawyer = await this.repository.findByIdWithLawsuits(id);
      const pendingCases = lawyer.lawsuits?.filter(lawsuit => lawsuit.status === 'assigned') || [];
      
      if (pendingCases.length > 0) {
        throw new AppError(
          `Cannot deactivate lawyer with ${pendingCases.length} active cases. Please reassign cases first.`,
          400
        );
      }
    }
  }

  /**
   * Business rule validation before deleting a lawyer
   */
  async _validateBeforeDelete(id) {
    const lawyer = await this.repository.findByIdWithLawsuits(id);
    
    if (lawyer.lawsuits && lawyer.lawsuits.length > 0) {
      throw new AppError(
        'Cannot delete lawyer with associated lawsuits. Please reassign or resolve all cases first.',
        400
      );
    }
  }

  /**
   * Helper method to capitalize specialization properly
   */
  _capitalizeSpecialization(specialization) {
    return specialization
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get lawyer workload statistics
   */
  async getLawyerWorkload() {
    try {
      this.logger.info('Calculating lawyer workload statistics');
      
      const lawyers = await this.repository.findAll({ include: ['lawsuits'] });
      
      const workloadStats = lawyers.data.map(lawyer => ({
        id: lawyer.id,
        name: lawyer.name,
        specialization: lawyer.specialization,
        status: lawyer.status,
        activeCases: lawyer.lawsuits?.filter(l => l.status === 'assigned').length || 0,
        resolvedCases: lawyer.lawsuits?.filter(l => l.status === 'resolved').length || 0,
        totalCases: lawyer.lawsuits?.length || 0,
      }));

      // Sort by active cases (descending)
      workloadStats.sort((a, b) => b.activeCases - a.activeCases);

      return {
        lawyers: workloadStats,
        summary: {
          totalLawyers: workloadStats.length,
          activeLawyers: workloadStats.filter(l => l.status === 'active').length,
          averageCasesPerLawyer: workloadStats.reduce((sum, l) => sum + l.activeCases, 0) / workloadStats.length,
          mostBusyLawyer: workloadStats[0],
        },
      };
    } catch (error) {
      this.logger.error('Error calculating lawyer workload', { error: error.message });
      throw error;
    }
  }
}

module.exports = LawyerService;
