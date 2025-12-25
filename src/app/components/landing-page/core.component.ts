import { Component } from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'app-landing',
  template: `
  <div class="min-h-screen bg-gradient-to-br from-pink-200 via-pink-100 to-white">

  <!-- HERO -->
  <section class="min-h-[90vh] flex items-center justify-center px-6">
    <div class="max-w-5xl text-center">
      <h1 class="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
        Your images,
        <span class="text-pink-600">organized & downloadable</span>
        in one secure gallery
      </h1>

      <p class="mt-6 text-lg text-gray-600">
        Upload, manage, and share high-quality images effortlessly.
        Built for creators, teams, and businesses.
      </p>

      <div class="mt-10 flex justify-center gap-4">
        <button nz-button nzType="primary" class="px-8 py-4 text-lg rounded-full">
          Get Started Free
        </button>
        <button nz-button nzType="default" class="px-8 py-4 text-lg rounded-full">
          View Demo
        </button>
      </div>
    </div>
  </section>

  <!-- STATS / TRUST -->
  <section class="py-20 bg-white/70 backdrop-blur-sm">
    <div class="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
      <div>
        <h3 class="text-4xl font-bold text-gray-900">2M+</h3>
        <p class="mt-2 text-gray-600">Images Stored</p>
      </div>
      <div>
        <h3 class="text-4xl font-bold text-gray-900">99.9%</h3>
        <p class="mt-2 text-gray-600">Secure Uptime</p>
      </div>
      <div>
        <h3 class="text-4xl font-bold text-gray-900">75K+</h3>
        <p class="mt-2 text-gray-600">Active Users</p>
      </div>
    </div>
  </section>

  <!-- FEATURES -->
  <section class="py-24">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-4xl font-bold text-center text-gray-900">
        Everything you need in a gallery
      </h2>

      <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div class="bg-white p-8 rounded-2xl shadow">
          <h4 class="text-xl font-semibold">Smart Organization</h4>
          <p class="mt-3 text-gray-600">
            Organize images with folders, tags, and metadata.
          </p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow">
          <h4 class="text-xl font-semibold">Fast Downloads</h4>
          <p class="mt-3 text-gray-600">
            One-click or bulk downloads without compression.
          </p>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow">
          <h4 class="text-xl font-semibold">Secure Sharing</h4>
          <p class="mt-3 text-gray-600">
            Control access with private links and permissions.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- HOW IT WORKS -->
  <section class="py-24 bg-white">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-4xl font-bold text-center text-gray-900">
        How it works
      </h2>

      <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
        <div>
          <div class="text-5xl font-bold text-pink-500">1</div>
          <h4 class="mt-4 font-semibold">Upload</h4>
          <p class="mt-2 text-gray-600">
            Upload images in seconds from any device.
          </p>
        </div>

        <div>
          <div class="text-5xl font-bold text-pink-500">2</div>
          <h4 class="mt-4 font-semibold">Organize</h4>
          <p class="mt-2 text-gray-600">
            Sort, tag, and group your images easily.
          </p>
        </div>

        <div>
          <div class="text-5xl font-bold text-pink-500">3</div>
          <h4 class="mt-4 font-semibold">Share & Download</h4>
          <p class="mt-2 text-gray-600">
            Share galleries or download images instantly.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- REVIEWS -->
  <section class="py-24">
    <div class="max-w-6xl mx-auto px-6">
      <h2 class="text-4xl font-bold text-center text-gray-900">
        What users say
      </h2>

      <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-2xl shadow">
          <p class="text-gray-600">
            “The fastest and cleanest gallery tool I’ve ever used.”
          </p>
          <div class="mt-6 font-semibold">Alex Morgan</div>
          <div class="text-sm text-gray-500">Photographer</div>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow">
          <p class="text-gray-600">
            “Perfect for client image delivery and archiving.”
          </p>
          <div class="mt-6 font-semibold">Jamie Lee</div>
          <div class="text-sm text-gray-500">Designer</div>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow">
          <p class="text-gray-600">
            “Simple, secure, and beautifully designed.”
          </p>
          <div class="mt-6 font-semibold">Sam Carter</div>
          <div class="text-sm text-gray-500">Creative Director</div>
        </div>
      </div>
    </div>
  </section>

  <!-- FINAL CTA -->
  <section class="py-24 bg-pink-600 text-white text-center">
    <h2 class="text-4xl font-bold">
      Start managing your images today
    </h2>
    <p class="mt-4 text-lg opacity-90">
      No credit card required. Free forever plan available.
    </p>
    <button nz-button nzType="default" class="mt-8 px-10 py-4 text-lg rounded-full">
      Create Your Gallery
    </button>
  </section>

  <!-- FOOTER -->
  <footer class="py-10 bg-gray-900 text-gray-400 text-center">
    <p>© 2025 GalleryApp. All rights reserved.</p>
  </footer>

</div>

  `,
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'none' }))
      ])
    ]),

    trigger('staggerCards', [
      transition(':enter', [
        query('.card', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(120, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ])
  ]
})
export class LandingComponent {}
