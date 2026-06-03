import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoEmoji]',
  standalone: true,
})
export class NoEmojiDirective {
  private emojiRegex = /[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu;

  @HostListener('beforeinput', ['$event'])
  onBeforeInput(event: InputEvent): void {
    const value = event.data || '';

    if (this.emojiRegex.test(value)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text') || '';

    if (this.emojiRegex.test(pastedText)) {
      event.preventDefault();
    }
  }
}
