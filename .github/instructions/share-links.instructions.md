---
description: Read this before implementing the Shareable Short Links feature for the link shortener dashboard.
---

# Shareable Short Links Instructions

## Goal

Build a UI component and integration to allow users to easily share their generated short links across popular platforms: WhatsApp, Email, Facebook, Instagram, and Twitter (X). Ensure the implementation follows strict coding standards and includes automated security and unit testing.

## Stepwise Implementation

1. Create a reusable `ShareMenu` or `ShareModal` React component using existing libraries (like `@radix-ui/react-dialog` or `shadcn`) to avoid creating unnecessary HTML components from scratch and to ensure native accessibility.
2. Implement native URL sharing intents for WhatsApp, Twitter, Facebook, and Email.
3. Implement a "Copy to Clipboard" fallback for platforms like Instagram that do not support direct URL sharing intents.
4. Integrate the `navigator.share` (Web Share API) for mobile devices to trigger native sharing sheets.
5. Add a "Share" button to the link creation success state and the dashboard link list.
6. Ensure the UI matches the existing application's design system and tone.
7. Write unit tests for the share component and utility functions using Jest and React Testing Library.
8. Run ESLint with the security plugin and `npm audit` to ensure no vulnerabilities are introduced.

## Sharing Intent Rules

- **WhatsApp:** Use `https://wa.me/?text=[encoded_text]`
- **Twitter (X):** Use `https://twitter.com/intent/tweet?url=[encoded_url]&text=[encoded_text]`
- **Facebook:** Use `https://www.facebook.com/sharer/sharer.php?u=[encoded_url]`
- **Email:** Use `mailto:?subject=[encoded_subject]&body=[encoded_body]`
- **Instagram:** Provide a "Copy Link" action since Instagram does not support direct link sharing via web intents.
- **Native Mobile:** Check `if (navigator.share)` and trigger it before falling back to custom buttons on mobile viewports.

## Security & Coding Standard Rules

- **Linting:** Ensure all code passes existing ESLint rules (including `plugin:security/recommended` and accessibility checks).
- **Unit Testing:** Write robust unit tests covering URL encoding, clipboard copy fallback, and DOM rendering. Ensure tests run successfully.
- **Vulnerability Checks:** Check for high-level security vulnerabilities using `npm audit` before finalizing the code.
- **XSS Prevention:** Ensure all dynamically generated URLs and injected text are strictly encoded using `encodeURIComponent` to prevent DOM-based Cross-Site Scripting (XSS).
- **Component Reusability:** Always check `package.json` for existing UI libraries before building raw HTML modals to avoid repetitive code and pass `jsx-a11y` requirements natively.
- **Jest Environment Setup:** Radix UI components require mocking `ResizeObserver`, `PointerEvent`, and `window.matchMedia` in `jest.setup.js` to prevent JSDOM crashes.
- **Async Testing:** When testing asynchronous browser APIs (like `navigator.clipboard.writeText`), use `waitFor` or `findByText` to assert state changes that happen after promises resolve. Use `Object.defineProperty` to mock read-only browser globals safely instead of reassigning the global object.
- **Jest Syntax & Compilers:** Always write tests using Jest's API (`describe`, `it`, `expect`), removing any imports from `node:test` or `node:assert`. If encountering `SyntaxError` for JSX or imports, ensure `jest.config.js` is correctly configured to use `@swc/jest` directly instead of relying solely on `next/jest`, which can sometimes fail to parse files correctly.
- **Testing Library Dependencies:** Ensure that `@testing-library/dom` is explicitly installed in `devDependencies` alongside `@testing-library/react` to prevent "Cannot find module '@testing-library/dom'" errors during test execution.

## Prompt Rules

- Keep the UI components accessible (use proper ARIA attributes for modal/dropdowns).
- Ensure all generated URLs are properly encoded using `encodeURIComponent`.
- Handle the clipboard copy action gracefully with a visual toast or tooltip confirmation.
- Adhere strictly to the "Security & Coding Standard Rules" when generating code.

## Verification

- Confirm the share menu opens correctly on desktop and mobile.
- Confirm each social button opens the respective platform in a new tab with the correct URL pre-filled.
- Confirm the "Copy" button successfully writes to the clipboard and shows user feedback.
- Confirm all unit tests pass locally (`npm run test`).
- Confirm no coding standard or security linting errors are present (`npm run lint`).