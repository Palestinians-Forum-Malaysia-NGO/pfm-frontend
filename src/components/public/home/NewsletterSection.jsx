import React, { useState } from "react";
import { MdEmail, MdArrowForward, MdCheckCircle } from "react-icons/md";
import useInView from "hooks/useInView";

const NewsletterSection = () => {
  const [ref, inView] = useInView();
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <section
      ref={ref}
      className="py-20"
      style={{ background: "linear-gradient(135deg, #003d1f 0%, #007A3D 55%, #004d26 100%)" }}
    >
      <div
        className="mx-auto max-w-2xl px-6 text-center"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease-in-out" }}
      >
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
            <MdEmail className="h-7 w-7" />
          </div>
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-white/60">Stay Informed</span>
        <h2 className="mt-3 text-4xl font-extrabold text-white">Get Our Newsletter</h2>
        <p className="mt-3 text-white/60">
          Receive updates on campaigns, events, and urgent appeals — straight to your inbox.
        </p>

        <div className="mt-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <MdEmail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full rounded-full bg-white/10 py-3 pl-11 pr-4 text-sm text-white outline-none ring-1 ring-white/20 backdrop-blur-sm transition-all duration-200 focus:ring-white/40 placeholder:text-white/35"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold transition-all duration-200 ease-in-out hover:-translate-y-px active:scale-[0.98]"
                style={{ color: "#007A3D" }}
              >
                Subscribe <MdArrowForward className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm">
              <MdCheckCircle className="h-5 w-5 text-green/80" />
              You're subscribed — thank you!
            </div>
          )}
          <p className="mt-3 text-xs text-white/30">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
