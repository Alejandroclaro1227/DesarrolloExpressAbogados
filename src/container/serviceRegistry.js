const DIContainer = require('./DIContainer');

// Repositories
const LawyerRepository = require('../repositories/LawyerRepository');
const LawsuitRepository = require('../repositories/LawsuitRepository');
const UserRepository = require('../repositories/UserRepository');

// Services
const LawyerService = require('../services/LawyerService');
const LawsuitService = require('../services/LawsuitService');

/**
 * Service Registry
 */
class ServiceRegistry {
  static initialize() {
    // Register Repositories as singletons
    DIContainer.registerSingleton('LawyerRepository', () => new LawyerRepository());
    DIContainer.registerSingleton('LawsuitRepository', () => new LawsuitRepository());
    DIContainer.registerSingleton('UserRepository', () => new UserRepository());

    // Register Services with their dependencies
    DIContainer.registerSingleton('LawyerService', () => new LawyerService());
    DIContainer.registerSingleton('LawsuitService', () => new LawsuitService());

    console.log('Services initialized');
    console.log(`Registered services: ${DIContainer.getRegisteredServices().join(', ')}`);
  }

  /**
   * Get service instance
   */
  static get(serviceName) {
    return DIContainer.resolve(serviceName);
  }

  /**
   * Get all registered services
   */
  static getServices() {
    return DIContainer.getRegisteredServices();
  }
}

module.exports = ServiceRegistry;
