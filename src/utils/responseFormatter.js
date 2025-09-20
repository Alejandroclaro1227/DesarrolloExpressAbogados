/**
 * Response Formatter for consistent API responses
 */
class ResponseFormatter {
  /**
   * Format successful response
   */
  static success(res, data, message = 'Operation successful', statusCode = 200) {
    const response = {
      status: 'success',
      message,
      data,
      timestamp: new Date().toISOString(),
    };

    // Add pagination info if present
    if (data && data.pagination) {
      response.pagination = data.pagination;
      response.data = data.data;
    }

    return res.status(statusCode).json(response);
  }

  /**
   * Format created response (201)
   */
  static created(res, data, message = 'Resource created successfully') {
    return this.success(res, data, message, 201);
  }

  /**
   * Format error response
   */
  static error(res, message = 'An error occurred', statusCode = 500, errors = null) {
    const response = {
      status: 'error',
      message,
      timestamp: new Date().toISOString(),
    };

    // Add validation errors if present
    if (errors) {
      response.errors = errors;
    }

    // Add error code for client handling
    response.errorCode = this._getErrorCode(statusCode);

    return res.status(statusCode).json(response);
  }

  /**
   * Format validation error response (400)
   */
  static validationError(res, errors, message = 'Validation failed') {
    return this.error(res, message, 400, errors);
  }

  /**
   * Format not found response (404)
   */
  static notFound(res, message = 'Resource not found') {
    return this.error(res, message, 404);
  }

  /**
   * Format unauthorized response (401)
   */
  static unauthorized(res, message = 'Authentication required') {
    return this.error(res, message, 401);
  }

  /**
   * Format forbidden response (403)
   */
  static forbidden(res, message = 'Access denied') {
    return this.error(res, message, 403);
  }

  /**
   * Format conflict response (409)
   */
  static conflict(res, message = 'Resource already exists') {
    return this.error(res, message, 409);
  }

  /**
   * Format too many requests response (429)
   */
  static tooManyRequests(res, message = 'Too many requests') {
    return this.error(res, message, 429);
  }

  /**
   * Format internal server error response (500)
   */
  static internalError(res, message = 'Internal server error') {
    return this.error(res, message, 500);
  }

  /**
   * Format paginated response
   */
  static paginated(res, data, pagination, message = 'Data retrieved successfully') {
    const response = {
      status: 'success',
      message,
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total: pagination.total,
        totalPages: pagination.totalPages,
        hasNextPage: pagination.hasNextPage,
        hasPrevPage: pagination.hasPrevPage,
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  }

  /**
   * Format list response with metadata
   */
  static list(res, items, meta = {}) {
    const response = {
      status: 'success',
      message: 'Data retrieved successfully',
      data: items,
      meta: {
        count: Array.isArray(items) ? items.length : 0,
        ...meta,
      },
      timestamp: new Date().toISOString(),
    };

    return res.status(200).json(response);
  }

  /**
   * Format analytics response
   */
  static analytics(res, analytics, message = 'Analytics generated successfully') {
    const response = {
      status: 'success',
      message,
      analytics,
      generatedAt: new Date().toISOString(),
    };

    return res.status(200).json(response);
  }

  /**
   * Format health check response
   */
  static health(res, status = 'healthy', checks = {}) {
    const response = {
      status: status === 'healthy' ? 'success' : 'error',
      health: status,
      checks,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    };

    const statusCode = status === 'healthy' ? 200 : 503;
    return res.status(statusCode).json(response);
  }

  /**
   * Get error code based on status code
   */
  static _getErrorCode(statusCode) {
    const errorCodes = {
      400: 'VALIDATION_ERROR',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      429: 'RATE_LIMIT_EXCEEDED',
      500: 'INTERNAL_ERROR',
    };

    return errorCodes[statusCode] || 'UNKNOWN_ERROR';
  }
}

module.exports = ResponseFormatter;
