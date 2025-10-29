import { ProfileValidationError } from '../errors';

function validateUuid(id: string, field: string): void {
  if (!id || id.trim().length === 0) {
    throw new ProfileValidationError(`${field} cannot be empty`);
  }

  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new ProfileValidationError(`Invalid UUID format for ${field}: ${id}`);
  }
}

function ensureNonEmpty(value: string, field: string): void {
  if (!value || value.trim().length === 0) {
    throw new ProfileValidationError(`${field} cannot be empty`);
  }
}

function ensureUrl(value: string | null, field: string): void {
  if (!value) {
    return;
  }

  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      throw new Error();
    }
  } catch {
    throw new ProfileValidationError(`${field} must be a valid URL`);
  }
}

export class Profile {
  private constructor(
    private readonly _id: string,
    private readonly _userId: string,
    private readonly _bio: string,
    private readonly _position: string,
    private readonly _department: string,
    private readonly _linkedinUrl: string | null,
    private readonly _gravatarUrl: string,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get userId(): string {
    return this._userId;
  }

  get bio(): string {
    return this._bio;
  }

  get position(): string {
    return this._position;
  }

  get department(): string {
    return this._department;
  }

  get linkedinUrl(): string | null {
    return this._linkedinUrl;
  }

  get gravatarUrl(): string {
    return this._gravatarUrl;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  static create(data: {
    id: string;
    userId: string;
    bio: string;
    position: string;
    department: string;
    linkedinUrl?: string | null;
    gravatarUrl: string;
  }): Profile {
    const now = new Date();
    return new Profile(
      data.id,
      data.userId,
      data.bio,
      data.position,
      data.department,
      data.linkedinUrl ?? null,
      data.gravatarUrl,
      now,
      now,
    );
  }

  static fromPersistence(data: {
    id: string;
    userId: string;
    bio: string;
    position: string;
    department: string;
    linkedinUrl: string | null;
    gravatarUrl: string;
    createdAt: Date;
    updatedAt: Date;
  }): Profile {
    return new Profile(
      data.id,
      data.userId,
      data.bio,
      data.position,
      data.department,
      data.linkedinUrl,
      data.gravatarUrl,
      data.createdAt,
      data.updatedAt,
    );
  }

  update(data: {
    bio?: string;
    position?: string;
    department?: string;
    linkedinUrl?: string | null;
    gravatarUrl?: string;
  }): Profile {
    return new Profile(
      this._id,
      this._userId,
      data.bio ?? this._bio,
      data.position ?? this._position,
      data.department ?? this._department,
      data.linkedinUrl !== undefined ? data.linkedinUrl : this._linkedinUrl,
      data.gravatarUrl ?? this._gravatarUrl,
      this._createdAt,
      new Date(),
    );
  }

  private validate(): void {
    validateUuid(this._id, 'Profile ID');
    validateUuid(this._userId, 'User ID');

    ensureNonEmpty(this._bio, 'Bio');
    ensureNonEmpty(this._position, 'Position');
    ensureNonEmpty(this._department, 'Department');
    ensureNonEmpty(this._gravatarUrl, 'Gravatar URL');
    ensureUrl(this._linkedinUrl, 'LinkedIn URL');

    if (this._createdAt > this._updatedAt) {
      throw new ProfileValidationError('Created date cannot be after updated date');
    }
  }
}

