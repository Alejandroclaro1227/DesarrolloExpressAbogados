const BaseError = require('./BaseError');

/**
 * Business Rule Error Class
 * Used when business logic rules are violated
 */
class BusinessRuleError extends BaseError {
  constructor(message, rule = null, context = {}) {
    super(message, 400, 'BUSINESS_RULE_VIOLATION', true);
    this.rule = rule;
    this.context = context;
  }

  /**
   * Create error for maximum workload violation
   */
  static maxWorkloadExceeded(currentCases, maxCases = 10) {
    return new BusinessRuleError(
      `Maximum workload exceeded (${currentCases}/${maxCases} cases)`,
      'MAX_WORKLOAD_RULE',
      { currentCases, maxCases }
    );
  }

  /**
   * Create error for lawyer deactivation with active cases
   */
  static cannotDeactivateLawyerWithCases(activeCases) {
    return new BusinessRuleError(
      `Cannot deactivate lawyer with ${activeCases} active cases`,
      'DEACTIVATION_RULE',
      { activeCases }
    );
  }

  /**
   * Create error for same party in lawsuit
   */
  static samePartyInLawsuit() {
    return new BusinessRuleError(
      'Plaintiff and defendant cannot be the same party',
      'SAME_PARTY_RULE'
    );
  }

  /**
   * Create error for invalid case number format
   */
  static invalidCaseNumberFormat(caseNumber) {
    return new BusinessRuleError(
      'Case number must follow format: ABC-YYYY-001',
      'CASE_NUMBER_FORMAT_RULE',
      { providedFormat: caseNumber }
    );
  }

  toJSON() {
    return {
      ...super.toJSON(),
      rule: this.rule,
      context: this.context,
    };
  }
}

module.exports = BusinessRuleError;
