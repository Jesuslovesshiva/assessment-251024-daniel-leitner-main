export abstract class UserDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class UserNotFoundError extends UserDomainError {
  constructor(identifier: string) {
    super(`User not found: ${identifier}`);
  }
}

export class UserAlreadyExistsError extends UserDomainError {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
  }
}

export class UserValidationError extends UserDomainError {
  constructor(message: string) {
    super(`User validation failed: ${message}`);
  }
}

export abstract class ProfileDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ProfileNotFoundError extends ProfileDomainError {
  constructor(userId: string) {
    super(`Profile for user ${userId} not found`);
  }
}

export class ProfileValidationError extends ProfileDomainError {
  constructor(message: string) {
    super(`Profile validation failed: ${message}`);
  }
}
