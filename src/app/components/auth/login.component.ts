import { Component, inject, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { AuthService } from "../../services/auth";
import { Router } from "@angular/router";
import { NzNotificationComponent, NzNotificationService } from 'ng-zorro-antd/notification';

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
        (click)="onSubmit()"
        class="w-full cursor-pointer text-[14pt] py-2 -mt-2! my-0 rounded-xl bg-blue-400 text-white! font-semibold shadow-md hover:bg-blue-700 hover:shadow-2xl hover:shadow-green-400 transition disabled:opacity-50"
      >
        Login
      </button>

    </form>

    <!-- Footer -->
    <p class="mt-6 text-center text-sm text-gray-600 pt-3">
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
  @ViewChild('notificationBtnTpl', { static: true }) btnTemplate!: TemplateRef<{ $implicit: NzNotificationComponent }>;

  fb: FormBuilder = inject(FormBuilder);
  authService: AuthService = inject(AuthService);
  notification = inject(NzNotificationService)
  router = inject(Router)
  error: boolean = false;

  form = this.fb.nonNullable.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
      ],
    ],
    password: ['', Validators.required],
  });

  email: string = '';
  password: string = '';
  rememberMe: boolean = false;

  createNotification({type, title, message}: {type?: 'success' | 'error' | 'blank', title: string, message: string}): void {
    switch (type) {
      case 'error':
        this.notification.error(
          title,
          message,
          {
            nzButton: this.btnTemplate
          }
        );
        break

      case 'success':
        this.notification.success(
          title,
          message,
          {
            nzButton: this.btnTemplate
          }
        );
        break

      default:
        this.notification.blank(
          title,
          message,
          {
            nzButton: this.btnTemplate
          }
        );
    }
  }

  onSubmit() {
    const loginData = {
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    };

    this.authService.login(loginData.email, loginData.password).subscribe({
      next: () => {
        this.createNotification({
          type: 'success',
          title: 'Success',
          message: 'Logged in successfully',
        })
        this.router.navigate(['']);
      },
      error: (error) => {
        this.error = true;
        this.createNotification({
          type: 'error',
          title: 'Signin Error',
          message: 'Incorrect email or password',
          // TODO: Do advanced error handling
        })
      },
    });

    // TODO: call authentication service here
  }


}
