import type { Form, ValidationErrors } from 'svelte-use-form';
import passwordValidator from 'password-validator';

const schema = new passwordValidator();
  schema
      .is().min(8)                                    // Minimum length 8
      .is().max(100)                                  // Maximum length 100
      .has().uppercase()                              // Must have uppercase letters
      .has().lowercase()                              // Must have lowercase letters
      .has().digits(2)                                // Must have at least 2 digits
      .has().not().spaces()

export function passwordValid(value: string): null | ValidationErrors {
  return schema.validate(value)
    ? null
    : { passwordValid: "Passwords must lenght min 8 char and containe Uppercase, Lowercase, minimum 2 digit, and no space" };

}


export function passwordMatch(value: string, form?: Form): null | ValidationErrors {
  return value === form?.password.value
    ? null
    : { passwordMatch: "Passwords are not matching" };
}
