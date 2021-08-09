import Joi from "joi";

export abstract class BaseValidator {
  private static _error: string;

  public static get error(): string {
    return this._error;
  }

  protected static setError(error: string): boolean {
    this._error = error;
    return false;
  }

  protected static isTrue(): boolean {
    this._error = "";
    return true;
  }

  protected static isValidJoi(schema: Joi.Schema, data: any): boolean {
    const { error } = schema.validate(data);
    if (error) {
      this.setError(error.message);
      return false;
    }
    return this.isTrue();
  }
}
