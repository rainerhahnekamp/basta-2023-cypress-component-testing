import { AbstractControl, isFormControl, isFormGroup, ValidatorFn } from '@angular/forms';

export const validateAddress: ValidatorFn = (ac: AbstractControl) => {
  if (!isFormControl(ac)) {
    throw new Error('Address Validator can be applied to a Form Control');
  }
  const { value } = ac;
  if (typeof value !== 'string') {
    throw new Error('Input must be of type string');
  }
  const shortPattern = /^([\w\s]+)\s(\d+)$/;
  const longPattern = /^([\w\s]+)\s(\d+),\s(\d+)\s([\w]+)$/;
  let match: string[] | null = value.match(shortPattern);

  if (match) {
    const [, street, streetNumber] = match;
    return null;
  } else {
    match = value.match(longPattern);
    if (match) {
      const [, street, streetNumber, zip, city] = match;
      return null;
    }
  }

  return { address: false };
};
