const BaseService = require('./BaseService');
const LawsuitRepository = require('../repositories/LawsuitRepository');
const LawyerRepository = require('../repositories/LawyerRepository');
const AppError = require('../utils/appError');

/**
 * Lawsuit Service - Business logic for Lawsuit operations
 * Implements complex business rules for case management
 */
class LawsuitService extends BaseService {
  constructor() {
    const repository = new LawsuitRepository();
    super(repository);
    this.lawyerRepository = new LawyerRepository();
  }

  /**
   * Get all lawsuits with lawyer information
   */
  async getAllWithLawyers(options = {}) {
    try {
      this.logger.info('Fetching lawsuits with lawyer information', { options });
      
      return await this.repository.findAllWithLawyers(options);
    } catch (error) {
      this.logger.error('Error fetching lawsuits with lawyers', { error: error.message, options });
      throw error;
    }
  }

  /**
   * Assign lawyer to lawsuit with business rules
   */
  async assignLawyer(lawsuitId, lawyerId) {
    try {
      this.logger.info('Assigning lawyer to lawsuit', { lawsuitId, lawyerId });
      
      // Business rule: Check lawyer workload
      await this._validateLawyerWorkload(lawyerId);
      
      // Business rule: Check specialization match (optional warning)
      await this._checkSpecializationMatch(lawsuitId, lawyerId);
      
      const result = await this.repository.assignLawyer(lawsuitId, lawyerId);
      
      this.logger.info('Lawyer assigned successfully', { lawsuitId, lawyerId });
      
      return result;
    } catch (error) {
      this.logger.error('Error assigning lawyer', { error: error.message, lawsuitId, lawyerId });
      throw error;
    }
  }

  /**
   * Get lawsuit statistics and analytics
   */
  async getLawsuitAnalytics() {
    try {
      this.logger.info('Generating lawsuit analytics');
      
      const stats = await this.repository.getLawsuitStats();
      const recentLawsuits = await this.repository.findAll({ 
        limit: 5, 
        order: [['created_at', 'DESC']] 
      });
      
      // Calculate additional metrics
      const assignmentRate = stats.total > 0 ? 
        ((stats.byStatus.assigned + stats.byStatus.resolved) / stats.total * 100).toFixed(2) : 0;
      
      const resolutionRate = stats.byStatus.assigned > 0 ? 
        (stats.byStatus.resolved / (stats.byStatus.assigned + stats.byStatus.resolved) * 100).toFixed(2) : 0;

      return {
        ...stats,
        metrics: {
          assignmentRate: `${assignmentRate}%`,
          resolutionRate: `${resolutionRate}%`,
          pendingPercentage: `${stats.total > 0 ? (stats.byStatus.pending / stats.total * 100).toFixed(2) : 0}%`,
        },
        recentLawsuits: recentLawsuits.data,
      };
    } catch (error) {
      this.logger.error('Error generating lawsuit analytics', { error: error.message });
      throw error;
    }
  }

  /**
   * Get lawsuits by status with enhanced filtering
   */
  async getLawsuitsByStatus(status, options = {}) {
    try {
      this.logger.info('Fetching lawsuits by status', { status, options });
      
      const validStatuses = ['pending', 'assigned', 'resolved'];
      if (!validStatuses.includes(status)) {
        throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
      }
      
      return await this.repository.findByStatus(status, options);
    } catch (error) {
      this.logger.error('Error fetching lawsuits by status', { error: error.message, status, options });
      throw error;
    }
  }

  /**
   * Recommend best lawyer for a lawsuit based on specialization and workload
   */
  async recommendLawyer(lawsuitId) {
    try {
      this.logger.info('Recommending lawyer for lawsuit', { lawsuitId });
      
      const lawsuit = await this.repository.findById(lawsuitId);
      
      // Get active lawyers
      const lawyers = await this.lawyerRepository.findActiveLawyers();
      
      if (lawyers.data.length === 0) {
        throw new AppError('No active lawyers available', 404);
      }

      // Score lawyers based on specialization match and workload
      const scoredLawyers = await Promise.all(
        lawyers.data.map(async (lawyer) => {
          const stats = await this.lawyerRepository.getLawyerStats(lawyer.id);
          
          let score = 0;
          
          // Specialization match bonus
          if (this._getSpecializationForCaseType(lawsuit.case_type) === lawyer.specialization) {
            score += 10;
          }
          
          // Workload penalty (fewer active cases = higher score)
          const activeCases = stats.stats.assigned;
          score += Math.max(0, 10 - activeCases);
          
          return {
            lawyer,
            score,
            activeCases,
            matchReason: this._getMatchReason(lawsuit.case_type, lawyer.specialization, activeCases),
          };
        })
      );

      // Sort by score (highest first)
      scoredLawyers.sort((a, b) => b.score - a.score);

      return {
        lawsuit: {
          id: lawsuit.id,
          case_number: lawsuit.case_number,
          case_type: lawsuit.case_type,
        },
        recommendations: scoredLawyers.slice(0, 3), // Top 3 recommendations
      };
    } catch (error) {
      this.logger.error('Error recommending lawyer', { error: error.message, lawsuitId });
      throw error;
    }
  }

  /**
   * Business rule validation before creating a lawsuit
   */
  async _validateBeforeCreate(data) {
    // Validate case number format (business rule)
    const caseNumberRegex = /^[A-Z]{2,4}-\d{4}-\d{3,4}$/;
    if (!caseNumberRegex.test(data.case_number)) {
      throw new AppError('Case number must follow format: ABC-YYYY-001', 400);
    }

    // Business rule: Plaintiff and defendant cannot be the same
    if (data.plaintiff.toLowerCase().trim() === data.defendant.toLowerCase().trim()) {
      throw new AppError('Plaintiff and defendant cannot be the same party', 400);
    }
  }

  /**
   * Validate lawyer workload before assignment
   */
  async _validateLawyerWorkload(lawyerId) {
    const stats = await this.lawyerRepository.getLawyerStats(lawyerId);
    const activeCases = stats.stats.assigned;
    
    // Business rule: Lawyer cannot have more than 10 active cases
    if (activeCases >= 10) {
      throw new AppError(
        `Lawyer has reached maximum workload (${activeCases}/10 active cases). Please assign to another lawyer.`,
        400
      );
    }
    
    // Warning for high workload (7+ cases)
    if (activeCases >= 7) {
      this.logger.warn('High workload assignment', { 
        lawyerId, 
        activeCases, 
        message: 'Lawyer has high workload' 
      });
    }
  }

  /**
   * Check if lawyer specialization matches case type
   */
  async _checkSpecializationMatch(lawsuitId, lawyerId) {
    const lawsuit = await this.repository.findById(lawsuitId);
    const lawyer = await this.lawyerRepository.findById(lawyerId);
    
    const expectedSpecialization = this._getSpecializationForCaseType(lawsuit.case_type);
    
    if (expectedSpecialization !== lawyer.specialization) {
      this.logger.warn('Specialization mismatch', {
        lawsuitId,
        lawyerId,
        caseType: lawsuit.case_type,
        expectedSpecialization,
        lawyerSpecialization: lawyer.specialization,
      });
    }
  }

  /**
   * Map case type to expected specialization
   */
  _getSpecializationForCaseType(caseType) {
    const mapping = {
      'civil': 'Civil',
      'criminal': 'Penal',
      'labor': 'Laboral',
      'commercial': 'Comercial',
    };
    return mapping[caseType] || 'General';
  }

  /**
   * Generate match reason for lawyer recommendation
   */
  _getMatchReason(caseType, lawyerSpecialization, activeCases) {
    const reasons = [];
    
    if (this._getSpecializationForCaseType(caseType) === lawyerSpecialization) {
      reasons.push('Perfect specialization match');
    }
    
    if (activeCases <= 3) {
      reasons.push('Low workload');
    } else if (activeCases <= 6) {
      reasons.push('Moderate workload');
    } else {
      reasons.push('High workload');
    }
    
    return reasons.join(', ');
  }
}

module.exports = LawsuitService;
