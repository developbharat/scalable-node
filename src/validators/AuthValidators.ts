import Joi from "joi";
import { BaseValidator } from "../core/BaseValidator";
import JoiPasswordComplexity from "joi-password-complexity";

const emailSchema = Joi.string()
  .trim()
  .email({ tlds: { allow: true }, allowUnicode: false })
  .label("Email")
  .required();

const passwordSchema = JoiPasswordComplexity({ min: 6, max: 20, symbol: 1, numeric: 2 }, "Password").trim().required();

const fnameSchema = Joi.string()
  .trim()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z]*$/, "alphabets")
  .label("First name")
  .required();
const lnameSchema = Joi.string()
  .trim()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z]*$/, "alphabets")
  .label("Last name")
  .required();

export class AuthValidators extends BaseValidator {
  public static isEmailValid(email: string): boolean {
    return this.isValidJoi(emailSchema, email);
  }

  public static isPasswordValid(password: string): boolean {
    return this.isValidJoi(passwordSchema, password);
  }

  public static isFirstnameValid(fname: string): boolean {
    return this.isValidJoi(fnameSchema, fname);
  }

  public static isLastnameValid(lname: string | undefined): boolean {
    return this.isValidJoi(lnameSchema, lname);
  }
}
