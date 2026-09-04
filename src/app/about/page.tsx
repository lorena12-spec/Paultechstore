import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PaulTech | Meet the CEO & Founder",
  description: "Learn more about PaulTech, our mission, our products, and CEO & Founder Paul Chikamso."
};

const offerings = [
  "iPhones",
  "Samsung smartphones",
  "Google Pixel devices",
  "iPads",
  "Windows laptops",
  "MacBooks"
];

const storyCards = [
  {
    title: "How PaulTech Started",
    body: "PaulTech was founded from a simple idea: making quality technology products more accessible and affordable. Through established connections with importers within the phone market, Paul saw an opportunity to leverage those relationships to provide customers with competitive prices while maintaining a strong focus on quality."
  },
  {
    title: "What We Offer",
    body: "PaulTech specializes in: " + offerings.join(", ") + "."
  },
  {
    title: "Our Commitment",
    body: "At PaulTech, we are 100% committed to providing not only affordable products, but quality and reliable products. We believe customers deserve access to quality technology at competitive prices, backed by excellent customer service. Our customer support team is available 24/7 to assist customers before, during, and after their purchase."
  },
  {
    title: "Our Vision",
    body: "Our vision is to grow PaulTech into an international brand in the technology and mobile phone industry, recognized for quality products, competitive pricing, reliability, and exceptional customer service."
  },
  {
    title: "Our Promise",
    body: "Our goal is not simply to sell devices. We want to build a brand that people can trust."
  }
];

export default function AboutPage() {
  return (
    <main className="container py-12 md:py-16">
      <section className="rounded-[30px] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <div className="grid items-center gap-8 p-6 md:p-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative">
            <div className="absolute -inset-4 rounded-[28px] bg-gradient-to-br from-blue-100 via-sky-50 to-transparent blur-2xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
              <img
                src="/images/paul-chikamso-ceo.jpeg"
                alt="Paul Chikamso, CEO and Founder of PaulTech"
                className="h-[360px] w-full object-contain object-center sm:h-[440px] md:h-[620px]"
              />
            </div>
            <div className="absolute bottom-4 left-4 rounded-full border border-blue-200 bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-blue-700 shadow-sm backdrop-blur-sm">
              CEO & FOUNDER
            </div>
          </div>

          <div className="relative" style={{ animation: "fade-in-up 0.7s ease-out" }}>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">ABOUT PAULTECH</p>
            <h1 className="mt-3 text-3xl font-black text-slate-900 md:text-5xl">Meet the CEO & Founder</h1>

            <div className="mt-6">
              <h2 className="text-2xl font-black text-blue-700 md:text-3xl">Paul Chikamso</h2>
              <p className="mt-2 text-base font-semibold text-slate-700 md:text-lg">
                CEO & Founder — PaulTech
              </p>
              <p className="mt-1 text-base text-slate-600">CEO — ICT Foundations (ICTF)</p>
            </div>

            <p className="mt-6 text-base leading-8 text-slate-600">
              Paul Chikamso is a forex trader, computer programmer, networker, and technology entrepreneur with a passion for technology and business.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {storyCards.map((card, index) => (
          <article
            key={card.title}
            className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
            style={{
              animation: `fade-in-up 0.6s ease-out ${index * 0.08}s both`
            }}
          >
            <h3 className="text-xl font-black text-slate-900">{card.title}</h3>
            <p className="mt-3 text-base leading-7 text-slate-600">{card.body}</p>
            {card.title === "What We Offer" && (
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                {offerings.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-600" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>
    </main>
  );
}
