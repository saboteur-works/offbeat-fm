"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Formik, Field } from "formik";
import { Button, ErrorText, FormLabel } from "@mda/components";
import toast from "react-hot-toast";
import axiosInstance from "../../../util/axiosInstance";
import { authValidators } from "@common/validation";
import { IUserLogin } from "@common/types/src/types";
import { mutate } from "swr";
import useAuth from "../../../swrHooks/useAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { authenticatedUser, isLoading } = useAuth();
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (authenticatedUser?.authenticated && authenticatedUser?.user?.role === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [authenticatedUser, isLoading, router]);

  const initialValues: IUserLogin = { username: "", password: "" };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">OffBeat Admin Login</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={authValidators.loginSchema}
        onSubmit={async (values) => {
          try {
            const res = await axiosInstance.post("/auth/log-in", values);
            if (res.data.user?.role !== "admin") {
              setLoginError("Your account does not have admin access.");
              return;
            }
            mutate("/auth/check-auth", { authenticated: true, user: res.data.user }, { revalidate: false });
            toast.success("Logged in.");
            router.push("/admin/dashboard");
          } catch {
            setLoginError("Invalid credentials.");
            toast.error("Login failed.");
          }
        }}
      >
        {({ handleSubmit, errors, touched }) => (
          <form
            className="flex flex-col gap-4 w-72"
            onSubmit={(e) => { e.preventDefault(); handleSubmit(e); }}
          >
            <FormLabel>
              <Field name="username" type="text" placeholder="Username" className="w-full" />
            </FormLabel>
            {errors.username && touched.username && <ErrorText message={errors.username} />}
            <FormLabel>
              <Field name="password" type="password" placeholder="Password" className="w-full" />
            </FormLabel>
            {errors.password && touched.password && <ErrorText message={errors.password} />}
            <Button label="Sign In" type="submit" category="outline" />
            {loginError && <ErrorText message={loginError} />}
          </form>
        )}
      </Formik>
    </div>
  );
}
