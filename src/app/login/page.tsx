import type { Metadata } from "next";
import LoginClient from "@/components/login/LoginClient";
import { siteConfig } from "@/config";

export const metadata: Metadata = {
  title: "Account Login",
  description: siteConfig.seo.pages.login.description,
};

export default function LoginPage() {
  return <LoginClient />;
}
