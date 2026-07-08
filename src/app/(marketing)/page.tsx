import { auth } from "@/lib/auth";
import { isStripeConfigured } from "@/lib/stripe";
import { Navbar } from "@/components/marketing/navbar";
import { Hero } from "@/components/marketing/hero";
import { Benefits } from "@/components/marketing/benefits";
import { HowItWorks } from "@/components/marketing/how-it-works";
import { Testimonials } from "@/components/marketing/testimonials";
import { Pricing } from "@/components/marketing/pricing";
import { Faq } from "@/components/marketing/faq";
import { Cta } from "@/components/marketing/cta";
import { Footer } from "@/components/marketing/footer";

export default async function LandingPage() {
  const session = await auth();
  const isAuthenticated = Boolean(session?.user);
  // Payments are dormant until Stripe is configured (free launch → hide pricing).
  const paymentsEnabled = isStripeConfigured();

  return (
    <div className="relative">
      <Navbar isAuthenticated={isAuthenticated} />
      <main>
        <Hero isAuthenticated={isAuthenticated} />
        <Benefits />
        <HowItWorks />
        <Testimonials />
        {paymentsEnabled && <Pricing isAuthenticated={isAuthenticated} />}
        <Faq />
        <Cta isAuthenticated={isAuthenticated} />
      </main>
      <Footer />
    </div>
  );
}
