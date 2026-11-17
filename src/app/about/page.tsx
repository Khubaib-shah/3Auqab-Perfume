import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { siteConfig } from "@/data/siteConfig";

export const metadata: Metadata = {
  title: "About Us",
  description: `Discover 3Uqab (Three Uqab Perfumes) based in Karachi. Handcrafted pure Arabian Oud, artisanal non-alcoholic attars, and luxury Eau de Parfum with express delivery across Karachi.`,
};

const teamMembers = [
  {
    name: "Yahya",
    role: "Founder & Master Perfumer, 3Uqab",
    avatar: "/assets/images/yahya-3uqab-perfume-brand-owner.jpeg",
  },
  {
    name: "3 Uqab",
    role: "Head of Oud Sourcing & Distillation",
    avatar: "/assets/images/logo.png",
  },
  {
    name: "Zakariya",
    role: "Creative Fragrance Director",
    avatar: "/assets/images/zakariya-3uqab-perfume-brand-owner.jpeg",
  },
];

export default function AboutPage() {
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
              <h3 className="custom_blog_title">About {siteConfig.name}</h3>
              <div className="page-main-content">
                <div className="header-banner banner-image">
                  <div className="banner-wrap">
                    <div className="banner-header">
                      <div className="col-lg-6 col-md-7 col-lg-offset-5 col-md-offset-5 col-sm-8 col-sm-offset-4 col-xs-12">
                        <div className="content-inner">
                          <h2 className="title">
                            Pure Scents <br /> Handcrafted in Karachi
                          </h2>
                          <div className="sub-title">
                            Mastering the royal legacy of pure Arabian Oud, <br />
                            concentrated attars, and bespoke Eau de Parfum.
                          </div>
                          <Link href="/shop" className="stelina-button button">
                            Explore Collection
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row about-features-row">
                  <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <div className="stelina-iconbox layout1">
                      <div className="iconbox-inner">
                        <div className="icon-item">
                          <span className="icon flaticon-rocket-ship"></span>
                        </div>
                        <div className="content">
                          <h4 className="title">Express Karachi Delivery</h4>
                          <div className="text">
                            Fast & reliable delivery exclusively across Karachi with Cash on Delivery (COD). Free delivery on orders above Rs 3,000.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-6 col-xs-12">
                    <div className="stelina-iconbox layout1">
                      <div className="iconbox-inner">
                        <div className="icon-item">
                          <span className="icon flaticon-return"></span>
                        </div>
                        <div className="content">
                          <h4 className="title">100% Pure & Potent Oils</h4>
                          <div className="text">
                            Handcrafted concentrated attars, aged Dehn Al Oud, and luxury EDPs guaranteed for 12+ hours of lasting sillage.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <div className="stelina-iconbox layout1">
                      <div className="iconbox-inner">
                        <div className="icon-item">
                          <span className="icon flaticon-padlock"></span>
                        </div>
                        <div className="content">
                          <h4 className="title">Fragrance Concierge</h4>
                          <div className="text">
                            Direct consultation to help you discover your signature note or select an exclusive gift. We are here to assist you.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row" style={{ marginTop: 50, marginBottom: 30 }}>
                  <div className="col-lg-10 col-lg-offset-1 col-md-12 text-center">
                    <h3 style={{ fontSize: 28, fontWeight: 600, color: "#222222", marginBottom: 16 }}>
                      The 3Uqab Story
                    </h3>
                    <p style={{ fontSize: 16, lineHeight: 1.85, color: "#555555", marginBottom: 14 }}>
                      Rooted in Karachi, <strong>3Uqab (Three Uqab Perfumes)</strong> brings the majesty of traditional Eastern perfumery to modern fragrance lovers. Inspired by the eagle (Uqab)—symbolizing regal strength and elevation—our atelier curates only the finest pure non-alcoholic attars, rare Dehn Al Oud, and contemporary Eau de Parfum formulations.
                    </p>
                    <p style={{ fontSize: 15, lineHeight: 1.8, color: "#666666", marginBottom: 0 }}>
                      Every blend is meticulously aged and bottled right here in Karachi, ensuring maximum longevity, rich scent development, and an unforgettable sillage.
                    </p>
                  </div>
                </div>

                <div className="team-member">
                  <div className="row">
                    <div className="col-sm-12 border-custom">
                      <span></span>
                    </div>
                  </div>
                  <h2 className="custom_blog_title center">
                    3Uqab (Three Uqab) Master Perfumers
                  </h2>
                  <div className="team-member-slider nav-center owl-slick">
                    <div className="row">
                      {teamMembers.map((member) => (
                        <div
                          key={member.name}
                          className="col-lg-4 col-md-4 col-sm-6 col-xs-12"
                        >
                          <div className="stelina-team-member">
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
