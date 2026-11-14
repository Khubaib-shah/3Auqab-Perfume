"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useAdminStore } from "@/store/useAdminStore";

export default function LoginClient() {
  const router = useRouter();
  const settings = useAdminStore((s) => s.settings);
  const loginAdmin = useAdminStore((s) => s.loginAdmin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = loginAdmin(email, password);
    if (ok) {
      toast.success(`Welcome to ${settings.shortName} Dashboard!`);
      router.push("/admin");
    } else {
      toast.error("Invalid email or password.");
    }
  };

  return (
    <div className="main-content main-content-login">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <Breadcrumb items={[{ label: "Admin Login" }]} />
          </div>
        </div>
        <div className="row">
          <div className="content-area col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="site-main">
              <h3 className="custom_blog_title" style={{ textAlign: "center" }}>
                Admin Login
              </h3>
              <div className="customer_login">
                <div className="row">
                  <div
                    className="col-lg-6 col-md-8 col-sm-12"
                    style={{ margin: "0 auto", float: "none" }}
                  >
                    <div className="login-item">
                      <h5 className="title-login">Sign in to Dashboard</h5>
                      <form onSubmit={onLogin} className="login">
                        <p className="form-row form-row-wide">
                          <label className="text">Email</label>
                          <input
                            title="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="auqab@owner.com"
                            className="input-text"
                          />
                        </p>
                        <p className="form-row form-row-wide">
                          <label className="text">Password</label>
                          <input
                            title="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="input-text"
                          />
                        </p>
                        <p className="lost_password">
                          <span className="inline">
                            <input type="checkbox" id="cb1" defaultChecked />
                            <label htmlFor="cb1" className="label-text">
                              Remember me
                            </label>
                          </span>
                        </p>
                        <p className="form-row">
                          <input
                            type="submit"
                            className="button-submit"
                            value="Login"
                          />
                        </p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
