import { Injectable, signal } from '@angular/core';
import {
  Auth,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  user,
  User,
  UserCredential,
} from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  user$: Observable<any | null>;

  constructor(private firebaseAuth: Auth) {
    this.setSessionStoragePersistence();
    this.user$ = user(this.firebaseAuth);
  }

  currentUser = signal<any | null | undefined>(undefined)

  private setSessionStoragePersistence(): void {
    setPersistence(this.firebaseAuth, browserSessionPersistence);
  }

  signup(email: string, password: string, username: string = ''): Observable<void> {
    const promise = createUserWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password,
    ).then((response: UserCredential) => updateProfile(response.user, { displayName: username }))
    return from(promise)
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(
      this.firebaseAuth,
      email,
      password
    ).then(() => {
    });
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.firebaseAuth).then(() => {
      sessionStorage.clear();
    });
    return from(promise);
  }

}
