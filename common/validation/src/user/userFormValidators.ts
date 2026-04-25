import { object, ObjectSchema, string, ref } from "yup";
import { IUserSignup } from "@common/types/src/types";

export const signUpSchema: ObjectSchema<IUserSignup> = object({
  email: string().email("Invalid email").required("Email is required"),
  username: string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .required("Username is required"),
  password: string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be at most 50 characters")
    .required("Password is required"),
  confirmPassword: string()
    // @ts-expect-error Yup ref typing issue
    .oneOf([ref("password"), null], "Passwords must match")
    .required("Password confirmation is required."),
});

export const resendVerificationSchema: ObjectSchema<{ email: string }> = object(
  {
    email: string().email("Invalid email").required("Email is required"),
  },
);
