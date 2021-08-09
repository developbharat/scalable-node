export enum GeneralStatusCodes {
  BadRequest = 400,
  MethodNotAllowed = 405,
  TooManyRequests = 429
}

export enum AuthStatusCodes {
  UnAuthenticated = 403,
  UnAuthorized = 401,
  InvalidCredentials = 403
}

type StatusCode = GeneralStatusCodes | AuthStatusCodes;

export class CustomError extends Error {
  private _status: StatusCode;

  constructor(status: StatusCode, message: string) {
    super(message);
    this._status = status;
  }

  public get status(): StatusCode {
    return this._status;
  }
}

export class AuthError extends CustomError {
  constructor(status: AuthStatusCodes, message: string) {
    super(status, message);
  }
}
