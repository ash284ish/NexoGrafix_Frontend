"use client";
import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer
      className="
    nx-footer
    bg-gradient-to-b
    from-[#FFF8F1]
    via-[#FFEEDD]
    to-[#FFD9B3]
  "
    >

      <div className="nx-footer-inner">
        <div className="nx-footer-top">
          <div className="nx-footer-brand">
            <div className="nx-footer-logo">Nexografix</div>
            <div className="nx-footer-sub">
              AI-enabled services for Publishing, Content, Assessments & Automation — enterprise delivery standards.
            </div>

            <div className="nx-footer-newsletter">
              <div className="nx-footer-h">Newsletter Signup</div>

              <form className="nx-news-form" onSubmit={(e) => e.preventDefault()}>
                <input
                  className="nx-news-input"
                  type="email"
                  placeholder="Enter your email address"
                />
                <button className="nx-news-btn" type="submit" aria-label="Subscribe">
                  →
                </button>
              </form>

              <label className="nx-news-check">
                <input type="checkbox" />
                <span>
                  I agree to the{" "}
                  <Link className="nx-footer-link" href="/privacy">
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>
            </div>
          </div>

          <div className="nx-footer-mid">
            <div className="nx-footer-title">
              Digital Solutions for Publishing & AI Automation.
            </div>

            <div className="nx-footer-cols">
              {/* REPLACED: Socials -> Home */}
              <div className="nx-footer-col">
                <div className="nx-footer-h">Home</div>
                {/* <div className="nx-footer-note">
                  Enterprise-grade delivery for publishing, content & assessment workflows.
                </div> */}

                <Link className="nx-footer-item" href="/">Home</Link>
                <Link className="nx-footer-item" href="/about">About Us</Link>
                <Link className="nx-footer-item" href="/contact">Contact Us</Link>
                <Link className="nx-footer-item" href="/contact">Support</Link>
              </div>

              {/* REPLACED: Menu -> Our Product + Solutions below */}
              <div className="nx-footer-col">
                <div className="nx-footer-h">Our Product</div>
                <Link className="nx-footer-item" href="/arohio">Arohio.ai</Link>

                <div className="nx-footer-h nx-footer-h2 mt-2">Resources</div>
                <Link className="nx-footer-item" href="/feedback">Feedback</Link>
                <Link className="nx-footer-item" href="/blog">Blog</Link>
                <Link className="nx-footer-item" href="/faqs">FAQs</Link>

              </div>

              <div className="nx-footer-col">
                <div className="nx-footer-h nx-footer-h2">Solutions</div>
                <Link className="nx-footer-item" href="/solutions/ai-services">AI Services</Link>
                <Link className="nx-footer-item" href="/solutions/book-publishing">Book Publishing</Link>
                <Link className="nx-footer-item" href="/solutions/content-creation">Content Creation</Link>
                <Link className="nx-footer-item" href="/solutions/assessment-development">Assessment Development</Link>
                <Link className="nx-footer-item" href="/solutions/bpo-services">BPO Services</Link>
              </div>

              {/* KEEP SAME: Contact Info */}
              <div className="nx-footer-col">
                <div className="nx-footer-h">Contact Info</div>
                <a className="nx-footer-item" href="mailto:contact@nexografix.com">
                  info@nexografix.com
                </a>
                <a className="nx-footer-item" href="tel:+911234567890">
                  +91 12345 67890
                </a>

                {/* Social Icons */}
                <div className="nx-footer-socials">
                  <a
                    href="https://www.linkedin.com/company/nexografix"
                    target="_blank"
                    rel="noreferrer"
                    className="nx-social"
                    aria-label="LinkedIn"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M20.45 20.45h-3.55v-5.4c0-1.29-.03-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85v5.5H9.47V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.35-1.85 3.58 0 4.24 2.35 4.24 5.4v6.34zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
                    </svg>
                  </a>

                  <a
                    href="https://www.instagram.com/nexografix/"
                    target="_blank"
                    rel="noreferrer"
                    className="nx-social"
                    aria-label="Instagram"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.97.24 2.43.41.6.23 1.02.5 1.47.95.45.45.73.87.95 1.47.18.46.36 1.26.41 2.43.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.24 1.97-.41 2.43-.23.6-.5 1.02-.95 1.47-.45.45-.87.73-1.47.95-.46.18-1.26.36-2.43.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.97-.24-2.43-.41-.6-.23-1.02-.5-1.47-.95-.45-.45-.73-.87-.95-1.47-.18-.46-.36-1.26-.41-2.43C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.24-1.97.41-2.43.23-.6.5-1.02.95-1.47.45-.45.87-.73 1.47-.95.46-.18 1.26-.36 2.43-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.08a6.76 6.76 0 1 0 0 13.52 6.76 6.76 0 0 0 0-13.52zm0 11.15a4.39 4.39 0 1 1 0-8.78 4.39 4.39 0 0 1 0 8.78zm7.04-11.69a1.58 1.58 0 1 1-3.16 0 1.58 1.58 0 0 1 3.16 0z" />
                    </svg>
                  </a>

                  <a
                    href="https://www.facebook.com/nexografix/"
                    target="_blank"
                    rel="noreferrer"
                    className="nx-social"
                    aria-label="Facebook"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M22.68 0H1.32C.59 0 0 .59 0 1.32v21.36C0 23.41.59 24 1.32 24h11.5v-9.29H9.69v-3.62h3.13V8.41c0-3.1 1.89-4.79 4.66-4.79 1.33 0 2.47.1 2.8.14v3.24l-1.92.01c-1.5 0-1.79.71-1.79 1.75v2.29h3.58l-.47 3.62h-3.11V24h6.09c.73 0 1.32-.59 1.32-1.32V1.32C24 .59 23.41 0 22.68 0z" />
                    </svg>
                  </a>

                  <a
                    href="https://wa.me/911234567890"
                    target="_blank"
                    rel="noreferrer"
                    className="nx-social"
                    aria-label="WhatsApp"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                      <path d="M12.04 2a9.94 9.94 0 0 0-8.45 15.28L2 22l4.88-1.57A9.95 9.95 0 1 0 12.04 2zm5.78 14.43c-.24.68-1.4 1.3-1.92 1.35-.49.04-1.11.06-1.79-.12-.41-.11-.94-.31-1.63-.6-2.87-1.24-4.74-4.15-4.88-4.34-.13-.19-1.16-1.55-1.16-2.95 0-1.4.74-2.08 1-2.36.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.42-.07.66.5.24.58.82 2.01.9 2.16.08.15.13.32.02.51-.11.19-.17.32-.33.49-.16.17-.34.38-.49.51-.16.13-.33.27-.14.53.19.26.86 1.42 1.85 2.3 1.27 1.13 2.34 1.48 2.68 1.65.34.17.54.14.74-.09.2-.24.85-.99 1.08-1.33.23-.34.46-.28.77-.17.31.11 1.97.93 2.31 1.1.34.17.57.26.65.41.08.15.08.86-.16 1.54z" />
                    </svg>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="nx-footer-divider" />

        <div className="nx-footer-bottom">
          <div>© {new Date().getFullYear()} Nexografix. All rights reserved.</div>
          <div className="nx-footer-bottom-links">
            <Link className="nx-footer-link" href="/privacy">Privacy Policy</Link>
            <span className="nx-footer-dot">|</span>
            <Link className="nx-footer-link" href="/terms">Terms of Service</Link>
            <span className="nx-footer-dot">|</span>
            <Link className="nx-footer-link" href="/refund">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
