"use client";

import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useAdminStore } from "@/store/useAdminStore";
import { siteConfig } from "@/data/siteConfig";

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactClient() {
  const submitContactOnServer = useAdminStore((s) => s.submitContactOnServer);
  const { register, handleSubmit, reset } = useForm<ContactFormValues>();

  const onSubmit = async (data: ContactFormValues) => {
    await submitContactOnServer(data);
    toast.success(
      `Thank you ${data.name}! Your message has been received by ${siteConfig.name}.`
    );
    reset();
  };

  return (
    <div className="main-content main-content-contact">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <Breadcrumb items={[{ label: "Contact Us" }]} />
          </div>
        </div>
        <div className="row">
          <div className="content-area content-contact col-lg-12 col-md-12 col-sm-12 col-xs-12">
            <div className="site-main">
              <h3 className="custom_blog_title">Contact Us</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="page-main-content">
        <div className="google-map">
          <iframe
            title="3Auqab Perfume Location"
            width="100%"
            height="500"
            id="gmap_canvas"
            src={siteConfig.contact.mapEmbedUrl}
            style={{ border: 0 }}
          ></iframe>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="form-contact">
                <div className="col-lg-8 no-padding">
                  <div className="form-message">
                    <h2 className="title">Send us a Message!</h2>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="stelina-contact-fom"
                    >
                      <div className="row">
                        <div className="col-sm-6">
                          <p>
                            <span className="form-label">Your Name *</span>
                            <span className="form-control-wrap your-name">
                              <input
                                {...register("name", { required: true })}
                                title="your-name"
                                type="text"
                                required
                                className="form-control form-control-name"
                              />
                            </span>
                          </p>
                        </div>
                        <div className="col-sm-6">
                          <p>
                            <span className="form-label">Your Email *</span>
                            <span className="form-control-wrap your-email">
                              <input
                                {...register("email", { required: true })}
                                title="your-email"
                                type="email"
                                required
                                className="form-control form-control-email"
                              />
                            </span>
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-sm-6">
                          <p>
                            <span className="form-label">Phone / WhatsApp</span>
                            <span className="form-control-wrap your-phone">
                              <input
                                {...register("phone")}
                                title="your-phone"
                                type="text"
                                className="form-control form-control-phone"
                              />
                            </span>
                          </p>
                        </div>
                        <div className="col-sm-6">
                          <p>
                            <span className="form-label">
                              Fragrance Inquiry / Bulk Order
                            </span>
                            <span className="form-control-wrap your-company">
                              <input
                                {...register("subject")}
                                title="your-company"
                                type="text"
                                className="form-control your-company"
                              />
                            </span>
                          </p>
                        </div>
                      </div>
                      <p>
                        <span className="form-label">Your Message</span>
                        <span className="wpcf7-form-control-wrap your-message">
                          <textarea
                            {...register("message", { required: true })}
                            title="your-message"
                            cols={40}
                            rows={9}
                            required
                            className="form-control your-textarea"
                          ></textarea>
                        </span>
                      </p>
                      <p>
                        <input
                          type="submit"
                          value="SEND MESSAGE"
                          className="form-control-submit button-submit"
                        />
                      </p>
                    </form>
                  </div>
                </div>
                <div className="col-lg-4 no-padding">
                  <div className="form-contact-information">
                    <div className="stelina-contact-info">
                      <h2 className="title">Contact information</h2>
                      <div className="info">
                        <div className="item address">
                          <span className="icon"></span>
                          <span className="text">
                            {siteConfig.contact.address}
                          </span>
                        </div>
                        <div className="item phone">
                          <span className="icon"></span>
                          <span className="text">
                            {siteConfig.contact.phone}
                          </span>
                        </div>
                        <div className="item email">
                          <span className="icon"></span>
                          <span className="text">
                            {siteConfig.contact.email}
                          </span>
                        </div>
                      </div>
                      <div className="socials">
                        <a
                          href={siteConfig.socials.facebook}
                          className="social-item"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="icon fa fa-facebook"></span>
                        </a>
                        <a
                          href={siteConfig.socials.twitter}
                          className="social-item"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="icon fa fa-twitter-square"></span>
                        </a>
                        <a
                          href={siteConfig.socials.instagram}
                          className="social-item"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span className="icon fa fa-instagram"></span>
                        </a>
                      </div>
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
