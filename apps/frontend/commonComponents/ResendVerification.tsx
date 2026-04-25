import { Button, ErrorText, FormLabel } from "@mda/components";
import axiosInstance from "../util/axiosInstance";
import { Field, Formik } from "formik";
import toast from "react-hot-toast";
import { useState } from "react";
import { userFormValidators } from "@common/validation";

interface ResendVerificationProps {
  email?: string;
  showForm?: boolean;
}

export default function ResendVerification({
  email,
  showForm = false,
}: ResendVerificationProps) {
  const initialValues: { email: string } = {
    email: "",
  };
  const [formSent, setFormSent] = useState(false);
  const [renderForm, setRenderForm] = useState(showForm);
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4">
      <h1 className="text-ob-h2 font-bold mb-2">One more step...</h1>
      <p className="text-center mb-4 text-brand-mid">
        We sent you an email with a verification link. Please click the link in
        that email to verify your account and complete the sign-up process. If
        you haven't received the email, please check your spam folder.
      </p>
      {!formSent && (
        <p className="mb-8 text-center text-brand-mid">
          If you still can't find it, click the button below to resend the
          verification email.
        </p>
      )}

      {renderForm && (
        <Formik
          initialValues={initialValues}
          validationSchema={userFormValidators.resendVerificationSchema}
          onSubmit={async (values) => {
            try {
              await axiosInstance.post("/auth/resend-verification", values);
              toast.success("Verification email resent successfully!");
            } catch (error) {
              console.error("Resend verification error:", error.response.data);
              toast.error("Failed to resend verification email.");
            } finally {
              setRenderForm(false);
              setFormSent(true);
            }
          }}
        >
          {({ handleSubmit, errors, touched }) => (
            <form
              className="flex flex-col space-y-4 w-80 "
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              <FormLabel>
                <Field
                  id="email"
                  name="email"
                  type="text"
                  placeholder="Email"
                  className="w-full"
                />
              </FormLabel>
              {errors.email && touched.email ? (
                <ErrorText message={errors.email} />
              ) : null}

              <Button label="Resend " type="submit" category="outline" />
            </form>
          )}
        </Formik>
      )}
      {!renderForm && !formSent && (
        <Button
          label="Resend Verification Email"
          onClick={() => {
            axiosInstance
              .post("/auth/resend-verification", { email })
              .then(() => {
                alert(
                  "If an account with that email exists and is unverified, a new link has been sent.",
                );
              })
              .catch(() => {
                alert(
                  "An error occurred while resending the verification email. Please try again later.",
                );
              });
          }}
        />
      )}
    </div>
  );
}
