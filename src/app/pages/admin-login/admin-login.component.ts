import { Component, OnDestroy } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { AuthService } from '../../Services/authService';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TEMP_TOKEN } from '../../constants/constants';

type View = 'login' | 'forgot' | 'otp' | 'new-password';

function noEmojiValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const val: string = control.value ?? '';

    const emojiRegex =
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2300}-\u{23FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{FE00}-\u{FE0F}\u{1F1E0}-\u{1F1FF}]/u;
    return emojiRegex.test(val) ? { noEmoji: true } : null;
  };
}

function noSpacesValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const val: string = control.value ?? '';
    return /\s/.test(val) ? { noSpaces: true } : null;
  };
}

function strictEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const val: string = (control.value ?? '').trim();
    if (!val) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val) ? null : { email: true };
  };
}

function passwordMatchValidator(
  group: AbstractControl
): ValidationErrors | null {
  const pw = group.get('newPassword')?.value;
  const cpw = group.get('confirmPassword')?.value;
  return pw && cpw && pw !== cpw ? { mismatch: true } : null;
}

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css',
})
export class AdminLoginComponent implements OnDestroy {
  currentDate = new Date().getFullYear();
  view: View = 'login';
  loading = false;
  error = '';

  showLoginPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  resendCountdown = 0;
  private resendTimer: ReturnType<typeof setInterval> | null = null;

  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      strictEmailValidator(),
      noEmojiValidator(),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      noEmojiValidator(),
      noSpacesValidator(),
    ]),
  });

  forgotForm = new FormGroup({
    forgotEmail: new FormControl('', [
      Validators.required,
      strictEmailValidator(),
      noEmojiValidator(),
    ]),
  });

  otpControls: FormControl[] = Array.from(
    { length: 6 },
    () => new FormControl('', [Validators.required, Validators.pattern(/^\d$/)])
  );
  otpForm = new FormGroup(
    Object.fromEntries(this.otpControls.map((c, i) => [`otp${i}`, c]))
  );

  newPasswordForm = new FormGroup(
    {
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
        noEmojiValidator(),
        noSpacesValidator(),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: passwordMatchValidator }
  );

  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    this.clearResendTimer();
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
  get forgotEmail() {
    return this.forgotForm.get('forgotEmail');
  }
  get newPassword() {
    return this.newPasswordForm.get('newPassword');
  }
  get confirmPassword() {
    return this.newPasswordForm.get('confirmPassword');
  }

  isOtpComplete(): boolean {
    return this.otpControls.every((c) => c.valid);
  }

  get otpValue(): string {
    return this.otpControls.map((c) => c.value ?? '').join('');
  }

  goToLogin(): void {
    this.error = '';
    this.view = 'login';
  }

  goToForgot(): void {
    this.error = '';
    this.view = 'forgot';
  }

  stripEmoji(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cleaned = input.value.replace(
      /[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FE0F}\u{200D}]/gu,
      ''
    );
    if (cleaned !== input.value) {
      const pos = input.selectionStart ?? 0;
      input.value = cleaned;
      input.setSelectionRange(pos - 1, pos - 1);

      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

  toggleLoginPasswordVisibility(): void {
    this.showLoginPassword = !this.showLoginPassword;
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.error = '';

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (res: any) => {
        this.loading = false;
        if (res.meta?.status_code === 0) {
          this.error = res.meta.status_message;
          return;
        }
        this.router.navigate(['/admin']);
      },
      error: (err: any) => {
        this.loading = false;
        this.error =
          err.error?.meta?.status_message ||
          'Invalid Credentials. Please try again.';
      },
    });
  }

  onSendOtp(): void {
    if (this.forgotForm.invalid) return;
    this.loading = true;
    this.error = '';

    const email = this.forgotForm.value.forgotEmail!;
    this.authService.forgetPasswort(email).subscribe({
      next: () => {
        this.loading = false;
        this.resetOtpControls();
        this.view = 'otp';
        this.startResendCountdown();
      },
      error: (err: any) => {
        this.error =
          err.error?.message || 'Failed to send code. Please try again.';
        this.loading = false;
      },
    });
  }

  onVerifyOtp(): void {
    if (!this.isOtpComplete()) return;
    this.loading = true;
    this.error = '';

    const email = this.forgotForm.value.forgotEmail!;
    const payload = { email, otp: this.otpValue };
    this.authService.verifyOTP(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.clearResendTimer();
        this.newPasswordForm.reset();
        this.showNewPassword = false;
        this.showConfirmPassword = false;
        this.view = 'new-password';
        localStorage.setItem(TEMP_TOKEN, res.data.token);
      },
      error: (err: any) => {
        this.error =
          err.error?.message || 'Invalid or expired code. Please try again.';
        this.loading = false;
      },
    });
  }

  onResendOtp(): void {
    this.error = '';
    this.loading = true;
    const email = this.forgotForm.value.forgotEmail!;
    this.authService.forgetPasswort(email).subscribe({
      next: () => {
        this.loading = false;
        this.resetOtpControls();
        this.startResendCountdown();
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to resend code.';
        this.loading = false;
      },
    });
  }

  onResetPassword(): void {
    if (this.newPasswordForm.invalid) return;
    this.loading = true;
    this.error = '';

    const email = this.forgotForm.value.forgotEmail!;
    const newPw = this.newPasswordForm.value.newPassword!;

    const payload = {
      email,
      newPassword: newPw,
      confirmPassword: this.newPasswordForm.value.confirmPassword!,
    };

    this.authService.resetPassword(payload).subscribe({
      next: () => {
        this.authService.login(email, newPw).subscribe({
          next: () => this.router.navigate(['/admin']),
          error: () => this.router.navigate(['/admin']),
        });
      },
      error: (err: any) => {
        this.error =
          err.error?.message || 'Failed to reset password. Please try again.';
        this.loading = false;
      },
    });
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const val = input.value.replace(/\D/g, '').slice(-1);
    this.otpControls[index].setValue(val);
    if (val && index < 5) {
      (
        document.getElementById(`otp-${index + 1}`) as HTMLInputElement
      )?.focus();
    }
  }

  onOtpKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      if (!this.otpControls[index].value && index > 0) {
        this.otpControls[index - 1].setValue('');
        (
          document.getElementById(`otp-${index - 1}`) as HTMLInputElement
        )?.focus();
      } else {
        this.otpControls[index].setValue('');
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      (
        document.getElementById(`otp-${index - 1}`) as HTMLInputElement
      )?.focus();
    } else if (event.key === 'ArrowRight' && index < 5) {
      (
        document.getElementById(`otp-${index + 1}`) as HTMLInputElement
      )?.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const digits = (event.clipboardData?.getData('text') ?? '')
      .replace(/\D/g, '')
      .slice(0, 6)
      .split('');
    digits.forEach((d, i) => {
      if (i < 6) this.otpControls[i].setValue(d);
    });
    const focusIdx = Math.min(digits.length, 5);
    (document.getElementById(`otp-${focusIdx}`) as HTMLInputElement)?.focus();
  }

  getPasswordStrength(): { level: number; label: string; color: string } {
    const pw = this.newPassword?.value || '';
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { level: 1, label: 'Weak', color: '#c0392b' };
    if (score === 2) return { level: 2, label: 'Fair', color: '#e67e22' };
    if (score === 3) return { level: 3, label: 'Good', color: '#d4ac0d' };
    return { level: 4, label: 'Strong', color: '#27ae60' };
  }

  private resetOtpControls(): void {
    this.otpControls.forEach((c) => c.setValue(''));
    setTimeout(() => {
      (document.getElementById('otp-0') as HTMLInputElement)?.focus();
    }, 100);
  }

  private startResendCountdown(seconds = 60): void {
    this.clearResendTimer();
    this.resendCountdown = seconds;
    this.resendTimer = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) this.clearResendTimer();
    }, 1000);
  }

  private clearResendTimer(): void {
    if (this.resendTimer) {
      clearInterval(this.resendTimer);
      this.resendTimer = null;
    }
    this.resendCountdown = 0;
  }
}
