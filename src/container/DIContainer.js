/**
 * Dependency Injection Container
 */
class DIContainer {
  constructor() {
    this.services = new Map();
    this.singletons = new Map();
  }

  /**
   * Register a service
   */
  register(name, factory, options = {}) {
    this.services.set(name, {
      factory,
      singleton: options.singleton || false,
      dependencies: options.dependencies || [],
    });
  }

  /**
   * Register a singleton service
   */
  registerSingleton(name, factory, dependencies = []) {
    this.register(name, factory, { singleton: true, dependencies });
  }

  /**
   * Resolve a service and its dependencies
   */
  resolve(name) {
    const serviceConfig = this.services.get(name);
    
    if (!serviceConfig) {
      throw new Error(`Service '${name}' not found in container`);
    }

    // Return singleton instance if already created
    if (serviceConfig.singleton && this.singletons.has(name)) {
      return this.singletons.get(name);
    }

    // Resolve dependencies
    const dependencies = serviceConfig.dependencies.map(dep => this.resolve(dep));

    // Create service instance
    const instance = serviceConfig.factory(...dependencies);

    // Store singleton instance
    if (serviceConfig.singleton) {
      this.singletons.set(name, instance);
    }

    return instance;
  }

  /**
   * Check if service is registered
   */
  has(name) {
    return this.services.has(name);
  }

  /**
   * Get all registered service names
   */
  getRegisteredServices() {
    return Array.from(this.services.keys());
  }

  /**
   * Clear all services (useful for testing)
   */
  clear() {
    this.services.clear();
    this.singletons.clear();
  }
}

// Export singleton instance
module.exports = new DIContainer();
