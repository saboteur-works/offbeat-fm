"use client";
import { Formik, Field } from "formik";
import { useRouter } from "next/navigation";
import { Button, ErrorText, FormLabel } from "@mda/components";
import axiosInstance from "../../util/axiosInstance";
import toast from "react-hot-toast";
import Link from "next/link";
import { userFormValidators } from "@common/validation";
import { IUserSignup } from "@common/types/src/types";
import { useState } from "react";
import ResendVerification from "../../commonComponents/ResendVerification";

export default function SignUpPage() {
  const initialValues: IUserSignup & { confirmPassword: string } = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  };
  const [email, setEmail] = useState("");
  const [signupSuccess, setSignupSuccess] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center py-2 w-full">
      <h1 className="text-3xl font-bold mb-4">
        Sign Up {signupSuccess && "Successful"}
      </h1>
      {!signupSuccess && (
        <Link href="/login" className="mb-4">
          Already have an account? Login
        </Link>
      )}

      {!signupSuccess && (
        <Formik
          initialValues={initialValues}
          validationSchema={userFormValidators.signUpSchema}
          onSubmit={async (values) => {
            if (signupSuccess) return;
            try {
              await axiosInstance.post("/auth/sign-up", values);
              setEmail(values.email);
              toast.success("Sign up successful");
              setSignupSuccess(true);
            } catch (error) {
              console.error("Signup error:", error.response.data);
              toast.error(
                "Sign up failed. Please review the form and try again.",
              );
            }
          }}
        >
          {({ handleSubmit, errors, touched }) => (
            <form
              className="flex flex-col space-y-4 w-80"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              <FormLabel>
                <Field
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full"
                />
              </FormLabel>
              {errors.email && touched.email ? (
                <ErrorText message={errors.email} />
              ) : null}
              <FormLabel>
                <Field
                  id="username"
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full"
                />
              </FormLabel>
              {errors.username && touched.username ? (
                <ErrorText message={errors.username} />
              ) : null}
              <FormLabel>
                <Field
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full"
                />
              </FormLabel>
              {errors.password && touched.password ? (
                <ErrorText message={errors.password} />
              ) : null}
              <FormLabel>
                <Field
                  id="confirmPassword"
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full"
                />
              </FormLabel>
              {errors.confirmPassword && touched.confirmPassword ? (
                <ErrorText message={errors.confirmPassword} />
              ) : null}
              <p>
                By submitting this form, you agree to our{" "}
                <a target="blank" href="/tos">
                  Terms of Service
                </a>
                ,{" "}
                <a target="blank" href="/privacy">
                  Privacy Policy
                </a>
                , and{" "}
                <a target="blank" href="/community-standards">
                  Community Guidelines
                </a>
                .
              </p>
              <Button type="submit" label="Sign Up" category="outline" />
            </form>
          )}
        </Formik>
      )}
      {signupSuccess && (
        <div>
          <ResendVerification email={email} />
        </div>
      )}
    </div>
  );
}
