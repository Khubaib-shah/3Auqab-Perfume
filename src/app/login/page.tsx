import type { Metadata } from "next";
import LoginClient from "@/components/login/LoginClient";

export const metadata: Metadata = {
  title: "Account Login",
  description:
    "Sign in to your 3Auqab Perfume (Three Auqab) account to track your fragrance orders and wishlist.",
};

export default function LoginPage() {
  return <LoginClient />;
}
