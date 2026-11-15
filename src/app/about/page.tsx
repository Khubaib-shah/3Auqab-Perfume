import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { siteConfig } from "@/data/siteConfig";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn the story behind ${siteConfig.name} (${siteConfig.shortName}) and our commitment to handcrafted Arabian Oud and French Eau de Parfum.`,
};

const teamMembers = [
  {
    name: "Tariq Al-Mansoor",
    role: "Founder & Master Perfumer, 3Uqab",
    avatar: "/assets/images/member3.png",
  },
  {
    name: "Zayd Al-Hashimi",
    role: "Head of Oud Sourcing & Distillation",
    avatar: "/assets/images/member2.png",
  },
  {
    name: "Sara Siddiqui",
    role: "Creative Fragrance Director",
    avatar: "/assets/images/member1.png",
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
                      <div className="col-lg-5 col-md-offset-7">
                        <div className="content-inner">
                          <h2 className="title">
                            Signature Scents <br /> Crafted for You
                          </h2>
                          <div className="sub-title">
                            Blending authentic Arabian Oud heritage with <br />
                            modern French Eau de Parfum artistry.
                          </div>
                          <Link href="/shop" className="stelina-button button">
                            Explore Collection
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-3 col-md-4 col-sm-4">
                    <div className="stelina-iconbox layout1">
                      <div className="iconbox-inner">
                        <div className="icon-item">
                          <span className="placeholder-text">01</span>
                          <span className="icon flaticon-rocket-ship"></span>
                        </div>
                        <div className="content">
                          <h4 className="title">Fast Worldwide Delivery</h4>
                          <div className="text">
                            Complimentary express shipping on all perfume orders
                            above $90.00
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-4 col-sm-4 col-lg-offset-1">
                    <div className="stelina-iconbox layout1">
                      <div className="iconbox-inner">
                        <div className="icon-item">
                          <span className="placeholder-text">02</span>
                          <span className="icon flaticon-return"></span>
                        </div>
                        <div className="content">
                          <h4 className="title">100% Authentic Oils</h4>
                          <div className="text">
                            High-concentration Eau de Parfum and pure oud oils
                            guaranteed to last 12+ hours.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-4 col-sm-4 col-lg-offset-1">
                    <div className="stelina-iconbox layout1">
                      <div className="iconbox-inner">
                        <div className="icon-item">
                          <span className="placeholder-text">03</span>
                          <span className="icon flaticon-padlock"></span>
                        </div>
                        <div className="content">
                          <h4 className="title">Fragrance Concierge 24/7</h4>
                          <div className="text">
                            Need help choosing a gift or signature scent? Our
                            perfume specialists are here 24/7.
                          </div>
                        </div>
                      </div>
                    </div>
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
                                <img src={member.avatar} alt={member.name} />
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
