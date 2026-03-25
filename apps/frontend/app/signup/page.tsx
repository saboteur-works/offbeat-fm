"use client";
import { Formik, Field } from "formik";
import { useRouter } from "next/navigation";
import { Button, ErrorText } from "@mda/components";
import axiosInstance from "../../util/axiosInstance";
import toast from "react-hot-toast";
import Link from "next/link";
import { userFormValidators } from "@common/validation";
import { IUserSignup } from "@common/types/src/types";

export default function SignUpPage() {
  const router = useRouter();
  const initialValues: IUserSignup & { confirmPassword: string } = {
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 w-full">
      <h1 className="text-3xl font-bold mb-4">Sign Up</h1>
      <Link href="/login" className="mb-4 text-blue-500 underline">
        Already have an account? Login
      </Link>
      <Formik
        initialValues={initialValues}
        validationSchema={userFormValidators.signUpSchema}
        onSubmit={async (values) => {
          try {
            // TODO: Automatically log in the user after signup
            await axiosInstance.post("/auth/sign-up", values);
            toast.success("Sign up successful");
            router.push("/login");
          } catch (error) {
            console.error("Signup error:", error.response.data);
            toast.error("Sign up failed. Please review the form andtry again.");
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
            <label htmlFor="email">Email</label>
            <Field id="email" type="email" name="email" />
            {errors.email && touched.email ? (
              <ErrorText message={errors.email} />
            ) : null}
            <label htmlFor="username">Username</label>
            <Field id="username" type="text" name="username" />
            {errors.username && touched.username ? (
              <ErrorText message={errors.username} />
            ) : null}
            <label htmlFor="password">Password</label>
            <Field id="password" type="password" name="password" />
            {errors.password && touched.password ? (
              <ErrorText message={errors.password} />
            ) : null}
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Field
              id="confirmPassword"
              type="password"
              name="confirmPassword"
            />
            {errors.confirmPassword && touched.confirmPassword ? (
              <ErrorText message={errors.confirmPassword} />
            ) : null}
            <p>
              By submitting this form, you agree to our{" "}
              <a target="blank" href="/tos" className="text-blue-500 underline">
                Terms of Service
              </a>
              ,{" "}
              <a
                target="blank"
                href="/privacy"
                className="text-blue-500 underline"
              >
                Privacy Policy
              </a>
              , and{" "}
              <a
                target="blank"
                href="/community-standards"
                className="text-blue-500 underline"
              >
                Community Guidelines
              </a>
              .
            </p>
            <p>
              Don't forget to review our{" "}
              <a
                target="blank"
                href="/community-standards"
                className="text-blue-500 underline"
              >
                Community Guidelines
              </a>
              !
            </p>
            <Button type="submit" label="Sign Up" category="outline" />
          </form>
        )}
      </Formik>
    </div>
  );
}
