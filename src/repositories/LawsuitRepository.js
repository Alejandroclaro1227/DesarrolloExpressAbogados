const BaseRepository = require('./BaseRepository');
const { Lawsuit, Lawyer } = require('../models');
const AppError = require('../utils/appError');

/**
 * Lawsuit Repository - Specific data access for Lawsuit entity
 * Extends BaseRepository following Open/Closed Principle
 */
class LawsuitRepository extends BaseRepository {
  constructor() {
    super(Lawsuit);
  }

  /**
   * Find lawsuits with lawyer information
   */
  async findAllWithLawyers(options = {}) {
    const searchOptions = {
      ...options,
      include: [
        {
          model: Lawyer,
          as: 'lawyer',
          attributes: ['id', 'name', 'specialization'],
        },
      ],
    };
    return await this.findAll(searchOptions);
  }

  /**
   * Find lawsuits by status
   */
  async findByStatus(status, options = {}) {
    const searchOptions = {
      ...options,
      where: {
        ...options.where,
        status,
      },
    };
    return await this.findAllWithLawyers(searchOptions);
  }

  /**
   * Find lawsuits by lawyer
   */
  async findByLawyer(lawyerId, options = {}) {
    const searchOptions = {
      ...options,
      where: {
        ...options.where,
        lawyer_id: lawyerId,
      },
    };
    return await this.findAllWithLawyers(searchOptions);
  }

  /**
   * Assign lawyer to lawsuit
   */
  async assignLawyer(lawsuitId, lawyerId) {
    const lawsuit = await this.findById(lawsuitId);
    
    // Verify lawyer exists and is active
    const lawyer = await Lawyer.findByPk(lawyerId);
    if (!lawyer) {
      throw new AppError('Lawyer not found', 404);
    }
    
    if (lawyer.status !== 'active') {
      throw new AppError('Cannot assign inactive lawyer', 400);
    }

    // Update lawsuit
    await lawsuit.update({
      lawyer_id: lawyerId,
      status: 'assigned',
    });

    // Return updated lawsuit with lawyer info
    return await this.model.findByPk(lawsuitId, {
      include: [
        {
          model: Lawyer,
          as: 'lawyer',
          attributes: ['id', 'name', 'specialization'],
        },
      ],
    });
  }

  /**
   * Find pending lawsuits (unassigned)
   */
  async findPendingLawsuits(options = {}) {
    return await this.findByStatus('pending', options);
  }

  /**
   * Get lawsuit statistics
   */
  async getLawsuitStats() {
    const totalCount = await this.count();
    const pendingCount = await this.count({ where: { status: 'pending' } });
    const assignedCount = await this.count({ where: { status: 'assigned' } });
    const resolvedCount = await this.count({ where: { status: 'resolved' } });

    const civilCount = await this.count({ where: { case_type: 'civil' } });
    const criminalCount = await this.count({ where: { case_type: 'criminal' } });
    const laborCount = await this.count({ where: { case_type: 'labor' } });
    const commercialCount = await this.count({ where: { case_type: 'commercial' } });

    return {
      total: totalCount,
      byStatus: {
        pending: pendingCount,
        assigned: assignedCount,
        resolved: resolvedCount,
      },
      byType: {
        civil: civilCount,
        criminal: criminalCount,
        labor: laborCount,
        commercial: commercialCount,
      },
    };
  }
}

module.exports = LawsuitRepository;
