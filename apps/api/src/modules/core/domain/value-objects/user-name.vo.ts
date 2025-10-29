export class UserName {
  private readonly _value: string;
  private static readonly MIN_LENGTH = 2;
  private static readonly MAX_LENGTH = 100;

  private constructor(value: string) {
    this._value = value;
  }

  get value(): string {
    return this._value;
  }

  static create(value: string): UserName {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      throw new Error('Name cannot be empty or only whitespace');
    }

    if (trimmedValue.length < UserName.MIN_LENGTH) {
      throw new Error(
        `Name must be at least ${UserName.MIN_LENGTH} characters, got ${trimmedValue.length}`,
      );
    }

    if (trimmedValue.length > UserName.MAX_LENGTH) {
      throw new Error(
        `Name cannot exceed ${UserName.MAX_LENGTH} characters, got ${trimmedValue.length}`,
      );
    }

    return new UserName(trimmedValue);
  }

  equals(other: UserName): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
