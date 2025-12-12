import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OffBeat - Community Standards",
  description: "Community standards for OffBeat app",
};
export default function CommunityStandardsPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Community Standards</h1>
      <p className="mb-4">
        At OffBeat, we are committed to fostering a safe and respectful
        community for all users. Our community standards are designed to ensure
        that everyone can enjoy our platform without fear of harassment,
        discrimination, or other harmful behavior.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Respectful Behavior</h2>
      <p className="mb-4">
        We expect all users to treat each other with respect and kindness.
        Harassment, discrimination, or any form of abuse will not be tolerated.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Content Guidelines</h2>
      <p className="mb-4">
        All content shared on our platform must be appropriate and comply with
        our guidelines. This includes avoiding certain types of explicit content
        such as hate speech, and any material that could be considered offensive
        or harmful.
      </p>
      <h2 className="text-2xl font-semibold mb-2">AI Content</h2>
      <p className="mb-4">
        We recognize the the real and potential damage that AI-generated content
        can cause to artists and creators. Therefore, we strictly prohibit the
        upload or sharing of any AI-generated content on our platform. Users
        found to be in violation of this policy will face account suspension or
        termination.
      </p>
      <h2 className="text-2xl font-semibold mb-2">Reporting Violations</h2>
      <p className="mb-4">
        If you encounter any violations of our community standards, please
        report them to us at{" "}
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
