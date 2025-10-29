import { Email } from '../value-objects/email.vo';
import { UserName } from '../value-objects/user-name.vo';
import { UserValidationError } from '../errors';

export class User {
  private constructor(
    private readonly _id: string,
    private readonly _name: UserName,
    private readonly _email: Email,
    private readonly _createdAt: Date,
    private readonly _updatedAt: Date,
  ) {
    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get name(): UserName {
    return this._name;
  }

  get email(): Email {
    return this._email;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  private validate(): void {
    if (!this._id || this._id.trim().length === 0) {
      throw new UserValidationError('User ID cannot be empty');
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(this._id)) {
      throw new UserValidationError(`Invalid UUID format: ${this._id}`);
    }

    if (this._createdAt > this._updatedAt) {
      throw new UserValidationError('Created date cannot be after updated date');
    }
  }

  static create(id: string, name: string, email: string): User {
    const now = new Date();
    return new User(id, UserName.create(name), Email.create(email), now, now);
  }

  static fromPersistence(data: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      data.id,
      UserName.create(data.name),
      Email.create(data.email),
      data.createdAt,
      data.updatedAt,
    );
  }

  updateName(newName: string): User {
    return new User(this._id, UserName.create(newName), this._email, this._createdAt, new Date());
  }

  updateEmail(newEmail: string): User {
    return new User(this._id, this._name, Email.create(newEmail), this._createdAt, new Date());
  }

  update(data: { name?: string; email?: string }): User {
    const updatedName = data.name ? UserName.create(data.name) : this._name;
    const updatedEmail = data.email ? Email.create(data.email) : this._email;

    return new User(this._id, updatedName, updatedEmail, this._createdAt, new Date());
  }

  getNameAsString(): string {
    return this._name.value;
  }

  getEmailAsString(): string {
    return this._email.value;
  }

  equals(other: User): boolean {
    return this._id === other._id;
  }
}
