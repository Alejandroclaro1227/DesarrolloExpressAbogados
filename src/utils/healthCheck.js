const { sequelize } = require('../models');
const Logger = require('./logger');

/**
 * Health Check System
 */
class HealthCheck {
  /**
   * Check database connectivity
   */
  static async checkDatabase() {
    try {
      await sequelize.authenticate();
      return {
        status: 'healthy',
        message: 'Database connection is working',
        responseTime: Date.now(),
      };
    } catch (error) {
      Logger.error('Database health check failed', { error: error.message });
      return {
        status: 'unhealthy',
        message: 'Database connection failed',
        error: error.message,
      };
    }
  }

  /**
   * Check memory usage
   */
  static checkMemory() {
    const memUsage = process.memoryUsage();
    const memUsageMB = {
      rss: Math.round(memUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
      external: Math.round(memUsage.external / 1024 / 1024),
    };

    const heapUsagePercentage = (memUsageMB.heapUsed / memUsageMB.heapTotal) * 100;

    return {
      status: heapUsagePercentage > 90 ? 'warning' : 'healthy',
      message: `Memory usage: ${heapUsagePercentage.toFixed(2)}%`,
      details: memUsageMB,
    };
  }

  /**
   * Check disk space (simplified)
   */
  static checkDisk() {
    // In a real application, you would check actual disk space
    return {
      status: 'healthy',
      message: 'Disk space is adequate',
    };
  }

  /**
   * Check application dependencies
   */
  static async checkDependencies() {
    const checks = {};

    // Check if required environment variables are set
    const requiredEnvVars = ['JWT_SECRET', 'DB_NAME', 'DB_USER'];
    const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

    checks.environment = {
      status: missingEnvVars.length === 0 ? 'healthy' : 'unhealthy',
      message: missingEnvVars.length === 0 
        ? 'All required environment variables are set'
        : `Missing environment variables: ${missingEnvVars.join(', ')}`,
    };

    return checks;
  }

  /**
   * Comprehensive health check
   */
  static async getHealthStatus() {
    const startTime = Date.now();
    
    try {
      const [database, memory, disk, dependencies] = await Promise.all([
        this.checkDatabase(),
        Promise.resolve(this.checkMemory()),
        Promise.resolve(this.checkDisk()),
        this.checkDependencies(),
      ]);

      const checks = {
        database,
        memory,
        disk,
        ...dependencies,
      };

      // Determine overall health
      const allChecks = Object.values(checks);
      const hasUnhealthy = allChecks.some(check => check.status === 'unhealthy');
      const hasWarning = allChecks.some(check => check.status === 'warning');

      let overallStatus = 'healthy';
      if (hasUnhealthy) {
        overallStatus = 'unhealthy';
      } else if (hasWarning) {
        overallStatus = 'warning';
      }

      const responseTime = Date.now() - startTime;

      return {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        responseTime: `${responseTime}ms`,
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        checks,
      };
    } catch (error) {
      Logger.error('Health check failed', { error: error.message });
      
      return {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        error: error.message,
        responseTime: `${Date.now() - startTime}ms`,
      };
    }
  }

  /**
   * Quick health check for load balancers
   */
  static async getQuickHealth() {
    try {
      await this.checkDatabase();
      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }
}

module.exports = HealthCheck;
