Phase 1: Building the Share Component
Use this prompt to generate the core UI component and the native sharing logic.

Prompt 1:

Context: Act as the Shareable Links Assistant. Please thoroughly read .github/instructions/share-links.instructions.md.

Task: Create a new reusable React component named ShareModal in components/ShareModal.tsx.

Requirements:

It should accept url and title as props.
Implement native sharing intent URLs for WhatsApp, X (Twitter), Facebook, and Email. Ensure all dynamic data is safely encoded using encodeURIComponent to prevent XSS.
Implement a "Copy to Clipboard" button as a fallback for platforms like Instagram. Show a brief visual confirmation (like a toast or tooltip) when copied successfully.
Use navigator.share (Web Share API) if available on the user's device. If it is supported, clicking "Share" should open the native OS share sheet.
Use Tailwind CSS for styling, lucide-react for the social icons, and @radix-ui/react-dialog for the accessible modal implementation. Do not build custom fixed dialogs if radix-ui exists in the project.
Crucial Accessibility Rule: Comply with jsx-a11y/anchor-is-valid. Do not use <a> tags for purely clickable actions like "Copy to Clipboard" or triggering the Web Share API; use <button> tags instead.

Phase 2: Integrating the Component into the Dashboard
Once the component is built and looks good, use this prompt to wire it up to your actual links.

Prompt 2:

Context: Act as the Shareable Links Assistant.

Task: Integrate the newly created ShareModal component into the application's existing dashboard and creation flow.

Requirements:

Locate the component that renders the list of the user's shortened links (e.g., inside app/dashboard/ or the relevant LinkCard component).
Add a new "Share" button next to the existing actions (like Copy or Delete).
When clicked, this button should open the ShareModal, passing the specific link's short URL and title as props.
Additionally, update the "Create Link" success flow. When a user successfully generates a new short link, present them with an immediate option to open the ShareModal so they can share it without having to navigate back to the main list.
Phase 3: Unit Testing and Security Validation
Finally, use this prompt to enforce the security standards and ensure the component is thoroughly tested.

Prompt 3:

Context: Act as the Shareable Links Assistant.

Task: Implement unit testing for the ShareModal and perform a security sweep.

Requirements:

Create a test file at components/ShareModal.test.tsx using Jest and React Testing Library.
Write a test to verify that the intent URLs (WhatsApp, Twitter, etc.) are correctly generated and properly encoded (XSS protection).
Write a test to verify the "Copy to Clipboard" fallback functionality.
Write a test simulating an environment where navigator.share is present to ensure it gets called with the correct parameters.
After writing the tests, run npm run lint and npm audit --audit-level=high. Report back if there are any eslint-plugin-security warnings or high-level package vulnerabilities that we need to fix.