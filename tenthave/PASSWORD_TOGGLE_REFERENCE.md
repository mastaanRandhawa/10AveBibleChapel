# Password Toggle - Visual Reference

## Component Overview

The PasswordInput component provides a consistent, accessible password field with show/hide toggle across the entire application.

---

## Visual States

### Hidden State (Default)
```
┌──────────────────────────────────────────────┐
│ ••••••••••••                            👁️   │
│                                              │
└──────────────────────────────────────────────┘
```
- Password characters hidden as dots
- Eye icon (closed eye with slash)
- Button aria-label: "Show password"

### Visible State (Toggled)
```
┌──────────────────────────────────────────────┐
│ myP@ssw0rd123                          👁️‍🗨️  │
│                                              │
└──────────────────────────────────────────────┘
```
- Password characters visible as plain text
- Eye icon (open eye)
- Button aria-label: "Hide password"

### Focus State
```
┌──────────────────────────────────────────────┐
│ ••••••••••••                            👁️   │ ← Primary color outline
│                                              │
└──────────────────────────────────────────────┘
```
- 2px outline in `--color-primary` (#FBCB9C)
- 2px offset for visibility
- Applies to both input and toggle button

### Hover State (Icon)
```
┌──────────────────────────────────────────────┐
│ ••••••••••••                            👁️   │ ← Icon darkens
│                                              │
└──────────────────────────────────────────────┘
```
- Icon color changes from muted gray to dark
- Smooth transition (150ms)

### Disabled State
```
┌──────────────────────────────────────────────┐
│ ••••••••••••                            👁️   │ ← 50% opacity
│                                              │
└──────────────────────────────────────────────┘
```
- Both input and icon at 50% opacity
- Cursor: not-allowed
- Pointer events disabled on toggle

---

## Usage Examples

### Login Form
```tsx
<PasswordInput
  id="password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="Enter your password"
  label="PASSWORD"
  required
  autoComplete="current-password"
/>
```

### Signup Form
```tsx
<PasswordInput
  id="password"
  name="password"
  value={formData.password}
  onChange={handleChange}
  placeholder="Create a password"
  label="PASSWORD"
  required
  autoComplete="new-password"
/>

<PasswordInput
  id="confirmPassword"
  name="confirmPassword"
  value={formData.confirmPassword}
  onChange={handleChange}
  placeholder="Confirm your password"
  label="CONFIRM PASSWORD"
  required
  autoComplete="new-password"
/>
```

---

## Accessibility Features

### Keyboard Navigation
1. **Tab** - Focus input field
2. **Tab** - Focus toggle button
3. **Enter/Space** - Toggle password visibility
4. **Shift+Tab** - Navigate backward

### Screen Reader Announcements
- Input: "Password, edit text, secure" (when hidden)
- Input: "Password, edit text" (when visible)
- Button: "Show password, button" (when hidden)
- Button: "Hide password, button" (when visible)

### ARIA Attributes
- `aria-label` on button updates dynamically
- Button has `type="button"` to prevent form submission
- Input maintains standard password field semantics

---

## Technical Details

### Icon SVGs
**Eye (Show - Hidden State):**
```svg
<svg width="20" height="20" viewBox="0 0 24 24">
  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
  <circle cx="12" cy="12" r="3" />
</svg>
```

**Eye-Off (Hide - Visible State):**
```svg
<svg width="20" height="20" viewBox="0 0 24 24">
  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
  <line x1="1" y1="1" x2="23" y2="23" />
</svg>
```

### CSS Variables Used
```css
--color-muted-gray: #6B7280        /* Icon default color */
--color-dark: #1a1a1a              /* Icon hover color */
--color-primary: #FBCB9C           /* Focus outline color */
--transition-fast: 150ms ease-in-out /* Transition timing */
--radius-sm: 0.375rem              /* Button border radius */
```

### Positioning
```css
.password-input-container {
  position: relative;
}

.password-toggle-btn {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
}

.password-input-field {
  padding-right: 3rem; /* Space for icon */
}
```

---

## Browser Compatibility

✅ **Chrome/Edge:** Full support
✅ **Firefox:** Full support
✅ **Safari:** Full support
✅ **Mobile Safari:** Full support
✅ **Chrome Mobile:** Full support

### Tested Features
- SVG rendering
- Focus-visible polyfill
- Transition animations
- Touch interactions (mobile)
- Screen reader compatibility

---

## Common Issues & Solutions

### Issue: Icon overlaps text
**Solution:** Input has `padding-right: 3rem` to reserve space

### Issue: Focus ring not visible
**Solution:** Uses both `:focus` and `:focus-visible` for cross-browser support

### Issue: Password managers not working
**Solution:** Proper `autoComplete` attributes maintained

### Issue: Mobile keyboard covers input
**Solution:** Standard input behavior, browser handles scrolling

---

## Customization Options

### Change Icon Size
```css
.password-toggle-btn svg {
  width: 24px;  /* Default: 20px */
  height: 24px;
}
```

### Change Icon Position
```css
.password-toggle-btn {
  right: 1rem;  /* Default: 0.75rem */
}
```

### Change Icon Colors
```css
.password-toggle-btn {
  color: #999;  /* Default: var(--color-muted-gray) */
}

.password-toggle-btn:hover {
  color: #000;  /* Default: var(--color-dark) */
}
```

---

## Integration Checklist

When adding PasswordInput to a new form:

- [ ] Import PasswordInput component
- [ ] Replace `<input type="password">` with `<PasswordInput>`
- [ ] Pass all required props (id, name, value, onChange)
- [ ] Add label prop if needed
- [ ] Set appropriate autoComplete value
- [ ] Test keyboard navigation
- [ ] Test with screen reader
- [ ] Verify focus states
- [ ] Test on mobile device

---

## Performance Notes

- **Bundle size:** ~2KB (component + CSS)
- **No dependencies:** Uses inline SVG
- **Render performance:** Minimal re-renders (only on toggle)
- **Accessibility tree:** No extra nodes

---

## Future Enhancements

Potential improvements (not implemented):

1. **Password Strength Indicator**
   - Visual bar showing password strength
   - Color-coded (red/yellow/green)
   - Real-time feedback

2. **Password Requirements Tooltip**
   - Shows requirements on focus
   - Checks off requirements as met
   - Positioned above/below input

3. **Generate Password Button**
   - Additional button to generate secure password
   - Copy to clipboard functionality
   - Configurable length/complexity

4. **Caps Lock Warning**
   - Detect caps lock state
   - Show warning icon
   - Prevent common typos

---

## Conclusion

The PasswordInput component provides a polished, accessible password field experience that:

✅ Matches existing design system
✅ Works across all browsers and devices
✅ Meets WCAG 2.1 AA accessibility standards
✅ Requires zero configuration to use
✅ Maintains all standard password field functionality

Simply import and use wherever password inputs are needed!

