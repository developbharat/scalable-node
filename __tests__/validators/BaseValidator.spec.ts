import { BaseValidator } from "../../src/core/BaseValidator";

class SampleValidator extends BaseValidator {
  public static isPassing(): boolean {
    return this.isTrue();
  }
  public static isFailing(): boolean {
    this.setError("Test is failing...");
    return false;
  }
}

describe("BaseValidator", () => {
  test("value of error cannot be changed outside the class.", (done) => {
    try {
      (SampleValidator.error as any) = "hello";
    } catch (err) {
      done();
    }
  });

  it("Previous errors should be cleared, validation succeeds.", () => {
    // Populate the AuthValidators.error to invalid email error.
    expect(SampleValidator.isFailing()).toBeFalsy();
    expect(SampleValidator.error.length).toBeGreaterThan(0);

    // If email is valid then previous error should be cleared.
    SampleValidator.isPassing();
    expect(SampleValidator.error.length).toBe(0);
  });

  test("value of error should be empty string in case of no error.", () => {
    expect(SampleValidator.error).toBe("");
  });
});
