export class HttpError extends Error {
  public readonly statusCode: number

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = 'Bad Request') {
    super(400, message)
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Unauthorized') {
    super(401, message)
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = 'Forbidden') {
    super(403, message)
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Not Found') {
    super(404, message)
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = 'Internal Server Error') {
    super(500, message)
  }
}

export class ServiceUnavailableError extends HttpError {
  constructor(message: string = 'Service Unavailable') {
    super(503, message)
  }
}
