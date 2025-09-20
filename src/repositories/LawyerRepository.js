const BaseRepository = require('./BaseRepository');
const { Lawyer, Lawsuit } = require('../models');

/**
 * Lawyer Repository
 */
class LawyerRepository extends BaseRepository {
  constructor() {
    super(Lawyer);
  }

  /**
   * Find lawyer with their associated lawsuits
   */
  async findByIdWithLawsuits(id) {
    return await this.model.findByPk(id, {
      include: [
        {
          model: Lawsuit,
          as: 'lawsuits',
          attributes: ['id', 'case_number', 'status', 'case_type', 'created_at'],
        },
      ],
    });
  }

  /**
   * Find active lawyers only
   */
  async findActiveLawyers(options = {}) {
    const searchOptions = {
      ...options,
      where: {
        ...options.where,
        status: 'active',
      },
    };
    return await this.findAll(searchOptions);
  }

  /**
   * Find lawyers by specialization
   */
  async findBySpecialization(specialization, options = {}) {
    const searchOptions = {
      ...options,
      where: {
        ...options.where,
        specialization,
      },
    };
    return await this.findAll(searchOptions);
  }

  /**
   * Get lawyer statistics
   */
  async getLawyerStats(id) {
    const lawyer = await this.findByIdWithLawsuits(id);
    if (!lawyer) return null;

    const lawsuits = lawyer.lawsuits || [];
    
    return {
      lawyer: {
        id: lawyer.id,
        name: lawyer.name,
        email: lawyer.email,
        specialization: lawyer.specialization,
        status: lawyer.status,
      },
      stats: {
        total: lawsuits.length,
        pending: lawsuits.filter(l => l.status === 'pending').length,
        assigned: lawsuits.filter(l => l.status === 'assigned').length,
        resolved: lawsuits.filter(l => l.status === 'resolved').length,
        byType: {
          civil: lawsuits.filter(l => l.case_type === 'civil').length,
          criminal: lawsuits.filter(l => l.case_type === 'criminal').length,
          labor: lawsuits.filter(l => l.case_type === 'labor').length,
          commercial: lawsuits.filter(l => l.case_type === 'commercial').length,
        }
      },
      lawsuits,
    };
  }
}

module.exports = LawyerRepository;
