import { Component, inject, input } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth";
import { Router } from "@angular/router";

@Component({
  selector: 'signup-page',
  template: `
  <div class="mt-20 flex items-center justify-center">
  <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

    <!-- Header -->
    <div class="flex flex-col items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        Signup
      </h1>
      <p class="text-gray-500 text-sm">
        Secure access to your portal
      </p>
    </div>

    <!-- Form -->
    <form class="space-y-5" (ngSubmit)="onSubmit()">

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          required
          (ngModel)="email()"
          placeholder="you@example.com"
          class="mt-1 w-full text-[14pt] px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Username -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Username (Optional)
        </label>
        <input
          type="text"
          name="username"
          required
          (ngModel)="username()"
          placeholder="Pic Hero"
          class="mt-1 w-full text-[14pt] px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          name="password"
          required
          (ngModel)="password()"
          placeholder="Enter password"
          class="mt-1 w-full text-[14pt] px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Password -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          name="password2"
          required
          (ngModel)="password2()"
          placeholder="Confirm password"
          class="mt-1 w-full text-[14pt] px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Submit -->
      <button
        type="submit"
        [disabled]="false"
        class="w-full text-[14pt] py-2 rounded-xl bg-blue-600 text-white! font-semibold shadow-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        Submit
      </button>

    </form>

    <!-- Footer -->
    <p class="mt-6 text-center text-sm text-gray-600">
      Don’t have an account?
      <a routerLink="/login" class="text-blue-600 hover:underline font-medium ml-1">
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


  form = this.fb.nonNullable.group({
    username: ['', [Validators.required]],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    password: ['', Validators.required],
  });

  username = input('');
  email = input('');
  password = input('');
  password2 = input('');

  onSubmit() {
    const signupData = {
      username: this.username(),
      email: this.email(),
      password: this.password(),
      password2: this.password2(),
    };

    this.authService.signup(signupData.email, signupData.password, signupData.username).subscribe({
      next: () => {
        this.router.navigate(['']);
      },
      error: (error) => {
        this.error = true;
        console.error('Email/Password sign up error:', error);
      },
    });

    // TODO: call authentication service here
  }


}
