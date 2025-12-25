import { Component, inject, input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth";
import { Router } from "@angular/router";

@Component({
  selector: 'signup-page',
  template: `
  <div class="mt-20 flex items-center justify-center">
  <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

    <!-- Header -->
    <div class="flex flex-col items-center mb-6 border-b border-b-gray-200">
      <nz-icon mzType="lock"></nz-icon>
      <h1 class="text-2xl font-bold text-gray-800">
        Signup
      </h1>
      <p class="text-gray-500 text-sm">
        Secure access to your portal
      </p>
    </div>

    <!-- Form -->
    <form
      nz-form
      [nzLayout]="'vertical'"
      [formGroup]="signupForm"
    class="space-y-5 pb-0! mb-0!">

      <!-- Email -->
      <div class="grid grid-cols-1 gap-6">
        <div class="">
          <nz-form-label nzRequired nzFor="email"
            >Email Address
          </nz-form-label>
          <nz-form-control nzErrorTip="Enter email address">
            <input
              type="email"
              formControlName="email"
              placeholder="my@gmail.com"
              class="mt-1 w-full text-[14pt] px-4 py-3 rounded-xl border border-gray-300 text-gray-700! focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </nz-form-control>
        </div>

        <!-- Username -->
        <div class="">
          <nz-form-label nzFor="username"
            >Username (option)
          </nz-form-label>
          <nz-form-control nzErrorTip="Enter username">
            <input
              type="text"
              formControlName="username"
              placeholder=""
              class="mt-1 w-full text-[14pt] px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </nz-form-control>
        </div>
      </div>

      <!-- Password -->
      <div class="grid grid-cols-2 gap-2">
        <div class="">
          <nz-form-item>
            <nz-form-label nzRequired nzFor="password"
            >Password
          </nz-form-label>
          <nz-form-control nzErrorTip="Re-enter your password!">
            <nz-input-password class="rounded-xl!">
              <nz-icon nzInputPrefix nzType="lock" />
              <input
                nz-input
                  formControlName="password"
                  placeholder="Enter password"
                  class="mt-1 w-full text-[14pt] px-41 py-1.5! border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </nz-input-password>
            </nz-form-control>
          </nz-form-item>
        </div>

        <!-- Password -->
        <div class="">
          <nz-form-item>
            <nz-form-label nzRequired nzFor="password2"
            >Confirm Password
          </nz-form-label>
          <nz-form-control nzErrorTip="Re-enter your password!">
            <nz-input-password class="rounded-xl!">
              <nz-icon nzInputPrefix nzType="lock" />
              <input
              nz-input
                formControlName="password2"
                placeholder="Re-enter password"
                class="mt-1 w-full text-[14pt] px-41 py-1.5! border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </nz-input-password>
          </nz-form-control>
        </nz-form-item>
        </div>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        [disabled]="!signupForm.valid"
        (click)="onSubmit()"
        class="w-full cursor-pointer text-[14pt] py-2 -mt-4! my-0 rounded-xl bg-blue-400 text-white! font-semibold shadow-md hover:bg-blue-700 hover:shadow-2xl hover:shadow-green-400 transition disabled:opacity-50"
      >
        Submit
      </button>

    </form>

    <!-- Footer -->
    <p class="mt-6 text-center text-sm text-gray-600 pt-2">
      Don’t have an account?
      <a routerLink="/login" class="text-blue-400 hover:underline font-medium ml-1">
        Take me back
      </a>
    </p>

  </div>
</div>

  `,
  standalone: false
})

export class SignupComponent {
  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  router = inject(Router)
  error: boolean = false;


  signupForm = this.fb.group({
    username: ['', [Validators.required]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    password: ['', Validators.required],
    password2: ['', Validators.required],
  });

  markAllDirty(form: FormGroup) {
  Object.values(form.controls).forEach(control => {
    control.markAsDirty();
    control.updateValueAndValidity();

    if (control instanceof FormGroup) {
      this.markAllDirty(control);
    }
  });
}

  onSubmit() {
    this.markAllDirty(this.signupForm)

    if (this.signupForm.valid) {
      this.authService.signup(
        this.signupForm.value.email!,
        this.signupForm.value.password!,
        this.signupForm.value.username!,
      ).subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (error) => {
          this.error = true;
          console.error('Email/Password sign up error:', error);
        },
      });
    }

  }


}
