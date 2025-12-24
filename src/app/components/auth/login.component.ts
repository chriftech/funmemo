import { Component } from "@angular/core";

@Component({
  selector: 'login-page',
  template: `
  <div class="mt-20 flex items-center justify-center">
  <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

    <!-- Header -->
    <div class="flex flex-col items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">
        Login
      </h1>
      <p class="text-gray-500 text-sm">
        Secure access to your portal
      </p>
    </div>

    <!-- Form -->
    <form class="space-y-5" (ngSubmit)="onSubmit()" #loginForm="ngForm">

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          required
          [(ngModel)]="email"
          placeholder="you@example.com"
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
          [(ngModel)]="password"
          placeholder="••••••••"
          class="mt-1 w-full text-[14pt] px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Options -->
      <div class="flex items-center justify-between">
        <label class="flex items-center gap-2 text-sm text-gray-600">
          <input
            type="checkbox"
            name="rememberMe"
            [(ngModel)]="rememberMe"
            class="rounded border-gray-300 w-4 h-4 cursor-pointer"
          />
          Remember me
        </label>

        <a routerLink="/forgot-password" class="text-sm text-blue-600 hover:underline">
          Forgot Password?
        </a>
      </div>

      <!-- Submit -->
      <button
        type="submit"
        [disabled]="loginForm.invalid"
        class="w-full text-[14pt] py-2 rounded-xl bg-blue-600 text-white! font-semibold shadow-md hover:bg-blue-700 transition disabled:opacity-50"
      >
        Login
      </button>

    </form>

    <!-- Footer -->
    <p class="mt-6 text-center text-sm text-gray-600">
      Don’t have an account?
      <a routerLink="/signup" class="text-blue-600 hover:underline font-medium ml-1">
        Sign Up
      </a>
    </p>

  </div>
</div>

  `,
  standalone: false
})

export class LoginComponent {

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  onSubmit() {
    const loginData = {
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    };

    console.log('Login submitted:', loginData);

    // TODO: call authentication service here
  }

}
