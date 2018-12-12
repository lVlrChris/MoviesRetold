import { AbstractControl } from '@angular/forms';

export const durationValidator = (control: AbstractControl): {[key: string]: any} | null => {
  const group = control.parent;
      console.log(group.controls['sliceDuration'].value);

      if (group) {
        if (group.controls['sliceDuration'].value > control.value) {
          return { 'SliceDurationTooLarge': true };
        }
      }

      return null;
};
