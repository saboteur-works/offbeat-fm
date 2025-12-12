import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OffBeat - Privacy Policy",
  description: "Terms of service for OffBeat app",
};
export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="mb-4">
        At OffBeat, we are committed to protecting your personal information and
        your right to privacy. If you have any questions about this Privacy
        Policy or our practices, please contact us at{" "}
        <a
          href={`mailto:${process.env.NEXT_PUBLIC_ADMIN_EMAIL}`}
          className="text-blue-500"
        >
          {process.env.NEXT_PUBLIC_ADMIN_EMAIL}
        </a>
      </p>
      <h2 className="text-2xl font-semibold mb-2">Information We Collect</h2>
      <p className="mb-4">
        We collect personal information that you provide to us, such as your
        email address and username. We also collect information about your
        interactions with our services.
      </p>
      <h2 className="text-2xl font-semibold mb-2">
        How We Use Your Information
      </h2>
      <p className="mb-4">
        We use the information we collect to provide and improve our services,
        communicate with you, and comply with legal obligations.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Data Security</h2>
      <p className="mb-4">
        We implement appropriate security measures to protect your personal
        information from unauthorized access, alteration, disclosure, or
        destruction.
      </p>
    </div>
  );
}
