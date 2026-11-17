import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { siteConfig, contentConfig } from "@/config";

export const metadata: Metadata = {
  title: `About Us | ${siteConfig.brand.name}`,
  description: siteConfig.brand.description,
};

export default function AboutPage() {
  const { about } = contentConfig;

  return (
    <div className="main-content main-content-about">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <Breadcrumb items={[{ label: "About Us" }]} />
          </div>
        </div>
        <div className="row">
          <div className="content-area content-about col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="site-main">
              <h3 className="custom_blog_title">About {siteConfig.brand.name}</h3>
              <div className="page-main-content">
                {/* Header Banner */}
                <div className="header-banner banner-image">
                  <div className="banner-wrap">
                    <div className="banner-header">
                      <div className="col-lg-6 col-md-7 col-lg-offset-5 col-md-offset-5 col-sm-8 col-sm-offset-4 col-xs-12">
                        <div className="content-inner">
                          <h2
                            className="title"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {about.bannerTitle}
                          </h2>
                          <div
                            className="sub-title"
                            style={{ whiteSpace: "pre-line" }}
                          >
                            {about.bannerSubtitle}
                          </div>
                          <Link
                            href="/shop"
                            className="app-button button"
                          >
                            {about.bannerCta}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features Row */}
                <div className="row about-features-row">
                  {about.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className={
                        idx === 2
                          ? "col-lg-4 col-md-4 col-sm-12 col-xs-12"
                          : "col-lg-4 col-md-4 col-sm-6 col-xs-12"
                      }
                    >
                      <div className="app-iconbox layout1">
                        <div className="iconbox-inner">
                          <div className="icon-item">
                            <span className={`icon ${feat.iconClass}`}></span>
                          </div>
                          <div className="content">
                            <h4 className="title">{feat.title}</h4>
                            <div className="text">{feat.description}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Brand Story Section */}
                <div
                  className="row"
                  style={{ marginTop: 50, marginBottom: 30 }}
                >
                  <div className="col-lg-10 col-lg-offset-1 col-md-12 text-center">
                    <h3
                      style={{
                        fontSize: 28,
                        fontWeight: 600,
                        color: "var(--color-heading)",
                        marginBottom: 16,
                      }}
                    >
                      {about.storyTitle}
                    </h3>
                    {about.storyParagraphs.map((para, pIdx) => (
                      <p
                        key={pIdx}
                        style={{
                          fontSize: pIdx === 0 ? 16 : 15,
                          lineHeight: pIdx === 0 ? 1.85 : 1.8,
                          color: pIdx === 0 ? "var(--color-body)" : "var(--color-muted)",
                          marginBottom: pIdx === about.storyParagraphs.length - 1 ? 0 : 14,
                        }}
                      >
                        {para}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Team Members Section */}
                <div className="team-member">
                  <div className="row">
                    <div className="col-sm-12 border-custom">
                      <span></span>
                    </div>
                  </div>
                  <h2 className="custom_blog_title center">
                    {about.teamTitle}
                  </h2>
                  <div className="team-member-slider nav-center owl-slick">
                    <div className="row">
                      {about.teamMembers.map((member) => (
                        <div
                          key={member.name}
                          className="col-lg-4 col-md-4 col-sm-6 col-xs-12"
                        >
                          <div className="app-team-member">
                            <div className="team-member-item">
                              <div className="member_avatar">
                                <img
                                  src={member.avatar}
                                  alt={member.name}
                                  width={240}
                                  height={240}
                                />
                              </div>
                              <h5 className="member_name">{member.name}</h5>
                              <div className="member_position">
                                {member.role}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
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
