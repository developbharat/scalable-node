import { AuthValidators } from "../../src/validators/AuthValidators";

describe("Authentication Validators", () => {
  it("should invalidate invalid passwords", () => {
    expect(AuthValidators.isPasswordValid(undefined as any)).toBeFalsy();
    expect(AuthValidators.isPasswordValid("")).toBeFalsy();
    expect(AuthValidators.isPasswordValid("hello")).toBeFalsy();
    expect(AuthValidators.isPasswordValid("          ")).toBeFalsy();
    expect(AuthValidators.isPasswordValid("Jooooooooooooooooohhhhhhhhnnnnnn")).toBeFalsy();
    expect(AuthValidators.isPasswordValid("password")).toBeFalsy();
    expect(AuthValidators.isPasswordValid("13222222")).toBeFalsy();
  });

  it("should validate valid passwords", () => {
    expect(AuthValidators.isPasswordValid("Password@123")).toBeTruthy();
    expect(AuthValidators.isPasswordValid("JoHnson@822")).toBeTruthy();
  });

  it("should return false, in case of invalid first names", () => {
    expect(AuthValidators.isFirstnameValid(undefined as any)).toBeFalsy();
    expect(AuthValidators.isFirstnameValid("")).toBeFalsy();
    expect(AuthValidators.isFirstnameValid("ab")).toBeFalsy();
    expect(AuthValidators.isFirstnameValid("32122")).toBeFalsy();
    expect(AuthValidators.isFirstnameValid("hell221")).toBeFalsy();
    expect(AuthValidators.isFirstnameValid("hello--")).toBeFalsy();
    expect(AuthValidators.isFirstnameValid("@@@")).toBeFalsy();
    expect(AuthValidators.isFirstnameValid("       ")).toBeFalsy();
    expect(AuthValidators.isFirstnameValid("Jake Sparrow")).toBeFalsy();
    expect(AuthValidators.isFirstnameValid("Joooooooooooooooohhhhhhhhhhhhnnnnnnn")).toBeFalsy();
  });

  it("should return true, in case of valid first names", () => {
    expect(AuthValidators.isFirstnameValid("bob")).toBeTruthy();
    expect(AuthValidators.isFirstnameValid("alice")).toBeTruthy();
    expect(AuthValidators.isFirstnameValid("Jayant")).toBeTruthy();
    expect(AuthValidators.isFirstnameValid("JONNY")).toBeTruthy();
    expect(AuthValidators.isFirstnameValid("Jack")).toBeTruthy();
  });

  it("should return false, in case of invalid last names", () => {
    expect(AuthValidators.isLastnameValid("")).toBeFalsy();
    expect(AuthValidators.isLastnameValid("ab")).toBeFalsy();
    expect(AuthValidators.isLastnameValid("32122")).toBeFalsy();
    expect(AuthValidators.isLastnameValid("hell221")).toBeFalsy();
    expect(AuthValidators.isLastnameValid("hello--")).toBeFalsy();
    expect(AuthValidators.isLastnameValid("@@@")).toBeFalsy();
    expect(AuthValidators.isLastnameValid("       ")).toBeFalsy();
    expect(AuthValidators.isLastnameValid("Jake Sparrow")).toBeFalsy();
    expect(AuthValidators.isLastnameValid("Joooooooooooooooohhhhhhhhhhhhnnnnnnn")).toBeFalsy();
    expect(AuthValidators.isLastnameValid(undefined)).toBeFalsy();
  });

  it("should return true, in case of valid last names", () => {
    expect(AuthValidators.isLastnameValid("Smith")).toBeTruthy();
    expect(AuthValidators.isLastnameValid("malik")).toBeTruthy();
    expect(AuthValidators.isLastnameValid("johnson")).toBeTruthy();
  });
});
