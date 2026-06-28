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
    <section ref={ref} className="bg-white py-20">
      <div
        className="mx-auto max-w-2xl px-6 text-center"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease-in-out" }}
      >
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green/10 text-green">
            <MdEmail className="h-7 w-7" />
          </div>
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-green">Stay Informed</span>
        <h2 className="mt-3 text-4xl font-extrabold text-slate-900">Get Our Newsletter</h2>
        <p className="mt-3 text-slate-400">
          Receive updates on campaigns, events, and urgent appeals — straight to your inbox.
        </p>

        <div className="mt-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <MdEmail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all duration-200 focus:border-green focus:ring-1 focus:ring-green placeholder:text-slate-400"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-green px-6 py-3 text-sm font-bold text-white shadow-glow-green-sm transition-all duration-200 ease-in-out hover:-translate-y-px active:scale-[0.98]"
              >
                Subscribe <MdArrowForward className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-full border border-green/20 bg-green/5 px-6 py-3 text-sm font-semibold text-green">
              <MdCheckCircle className="h-5 w-5" />
              You're subscribed — thank you!
            </div>
          )}
          <p className="mt-3 text-xs text-slate-400">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
