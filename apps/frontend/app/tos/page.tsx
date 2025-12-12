import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OffBeat - Terms of Service",
  description: "Terms of service for OffBeat app",
};
export default function TermsOfServicePage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
      <p className="mb-4">
        Welcome to our OffBeat! By using our services, you agree to comply with
        and be bound by the following terms and conditions. Please read them
        carefully.
      </p>
      <h2 className="text-2xl font-semibold mb-2">1. Acceptance of Terms</h2>
      <p className="mb-4">
        By accessing or using our services, you agree to be bound by these Terms
        of Service and our Privacy Policy. If you do not agree to these terms,
        please do not use our services.
      </p>
      <h2 className="text-2xl font-semibold mb-2">2. User Accounts</h2>
      <p className="mb-4">
        You may be required to create an account to access certain features of
        our services. You are responsible for maintaining the confidentiality of
        your account information and for all activities that occur under your
        account.
      </p>
      <h2 className="text-2xl font-semibold mb-2">3. User Content</h2>
      <p className="mb-4">
        You retain ownership of any content you submit, post, or display on or
        through our services. By submitting content, you grant us a worldwide,
        non-exclusive, royalty-free license to use, copy, modify, and distribute
        your content in connection with our services.
      </p>

      <h2 className="text-2xl font-semibold mb-2">4. Prohibited Conduct</h2>
      <p className="mb-4">
        You agree not to use our services for any unlawful or prohibited
        purpose, including but not limited to:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Violating any applicable laws or regulations.</li>
        <li>Infringing on the intellectual property rights of others.</li>
        <li>Uploading or distributing harmful or malicious content.</li>
        <li>
          Engaging in any activity that disrupts or interferes with our
          services.
        </li>
      </ul>
      <h2 className="text-2xl font-semibold mb-2">5. Termination</h2>
      <p className="mb-4">
        We reserve the right to terminate or suspend your account and access to
        our services at our sole discretion, without prior notice, for conduct
        that we believe violates these Terms of Service or is harmful to other
        users of our services.
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        6. Changes to Terms of Service
      </h2>
      <p className="mb-4">
        We may update these Terms of Service from time to time. We will notify
        you of any changes by posting the new terms on this page. Your continued
        use of our services after any changes constitutes your acceptance of the
        new terms.
      </p>
      <h2 className="text-2xl font-semibold mb-2">7. Contact Us</h2>
      <p className="mb-4">
        If you have any questions about these Terms of Service, please contact
        us at{" "}
        <a
          href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`}
          className="text-blue-500"
        >
          {process.env.NEXT_PUBLIC_ADMIN_EMAIL}
        </a>
      </p>
    </div>
  );
}
