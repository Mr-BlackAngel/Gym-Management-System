// GuestPortal.tsx — FINAL PREMIUM VERSION (no JSX errors)
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Dumbbell,
  Clock,
  Users,
  Zap,
  Calculator,
  Activity,
  Check,
} from "lucide-react";
import OneDayPassBooking from "./OneDayPassBooking";

interface GuestPortalProps {
  onJoinNow: () => void;
  onLogin: () => void;
}

const facilities = [
  { name: "Treadmills", icon: Activity, count: "15+ Machines" },
  { name: "Free Weights", icon: Dumbbell, count: "500+ lbs" },
  { name: "Yoga Studio", icon: Users, count: "Private Room" },
  { name: "Cardio Zone", icon: Zap, count: "20+ Equipment" },
];

const classes = [
  { name: "Morning Yoga", time: "6:00 AM - 7:00 AM", days: "Mon, Wed, Fri" },
  { name: "HIIT Training", time: "7:00 AM - 8:00 AM", days: "Tue, Thu, Sat" },
  { name: "Strength Training", time: "5:00 PM - 6:00 PM", days: "Mon, Wed, Fri" },
  { name: "Zumba Dance", time: "6:00 PM - 7:00 PM", days: "Tue, Thu" },
];

const plans = [
  {
    name: "Basic",
    price: "₹2,499",
    duration: "per month",
    features: [
      "Access to gym equipment",
      "Locker room access",
      "Free WiFi",
      "2 guest passes / month",
    ],
  },
  {
    name: "Premium",
    price: "₹4,999",
    duration: "per month",
    features: [
      "All Basic features",
      "Unlimited group classes",
      "2 personal training sessions / month",
      "Nutrition consultation",
    ],
    popular: true,
  },
  {
    name: "VIP",
    price: "₹8,999",
    duration: "per month",
    features: [
      "All Premium features",
      "8 personal sessions / month",
      "Spa & private locker",
      "Priority booking",
    ],
  },
];

export default function GuestPortal({ onJoinNow, onLogin }: GuestPortalProps) {
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingType, setBookingType] =
    useState<"one_day_pass" | "gym_tour">("one_day_pass");

  const heroRef = useRef<HTMLDivElement | null>(null);
  const heroBgRef = useRef<HTMLDivElement | null>(null);
  const [scrolled, setScrolled] = useState(false);

  const revealObserver = useRef<IntersectionObserver | null>(null);

  // NAV + PARALLAX
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);

      if (heroBgRef.current && heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const offset = Math.min(Math.max(-rect.top * 0.15, -120), 120);
        heroBgRef.current.style.transform = `translate3d(0, ${offset}px, 0) scale(1.03)`;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // SECTION REVEAL ANIMATION
  useEffect(() => {
    revealObserver.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
            el.style.transition =
              "opacity 600ms ease, transform 600ms cubic-bezier(.2,.9,.2,1)";
            revealObserver.current?.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll<HTMLElement>(".reveal-on-scroll").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(18px)";
      revealObserver.current?.observe(el);
    });

    return () => revealObserver.current?.disconnect();
  }, []);

  const handleBookOneDayPass = () => {
    setBookingType("one_day_pass");
    setBookingDialogOpen(true);
  };

  const handleBookTour = () => {
    setBookingType("gym_tour");
    setBookingDialogOpen(true);
  };

  return (
    <div className="min-h-screen antialiased text-slate-900">
      {/* NAV */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-350 ${
          scrolled ? "backdrop-blur-sm bg-slate-900/70" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-2 rounded-md shadow-md">
              <Dumbbell className="size-6 text-white" />
            </div>
            <div className="text-white font-semibold tracking-wide">AKHADA</div>
          </div>

          <div className="flex items-center gap-4 text-white">
            <a className="hidden md:inline hover:text-orange-400" href="#browse">
              Browse
            </a>
            <a className="hidden md:inline hover:text-orange-400" href="#pricing">
              Pricing
            </a>
            <a className="hidden md:inline hover:text-orange-400" href="#tools">
              Tools
            </a>
            <Button
              onClick={onLogin}
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-slate-900"
            >
              Login
            </Button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header ref={heroRef} className="relative h-[75vh] md:h-[82vh] overflow-hidden">
        <div
          ref={heroBgRef}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('/premium-hero.jpg')`,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(3,7,14,0.75), rgba(3,7,14,0.45), rgba(3,7,14,0.7))",
          }}
        />

        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full">
            {/* MAIN HERO TEXT BOX */}
            <div className="md:col-span-7">
              <div
                className="inline-block rounded-3xl bg-white/10 backdrop-blur-md border border-white/10 p-8 md:p-12 shadow-2xl"
                style={{ boxShadow: "0 18px 50px rgba(2,6,23,0.55)" }}
              >
                <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight drop-shadow-md">
                  Make the next version of you
                </h1>

                <p className="mt-4 text-white/85 text-lg md:text-xl">
                  Premium facilities, real results — built for people who mean business.
                </p>

                <div className="mt-6 flex gap-3">
                  <Button
                    onClick={onJoinNow}
                    size="lg"
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    Join Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleBookTour}
                    className="text-white border-white"
                  >
                    Take a Tour
                  </Button>
                </div>

                <div className="mt-6 flex gap-8 text-white/90 text-sm">
                  <div className="flex items-center gap-2">
                    <Activity className="size-4" />
                    <span>World-class equipment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="size-4" />
                    <span>Focused coaching</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FLOATING CTA CARD */}
            <div className="md:col-span-5 relative">
              <div className="absolute -bottom-10 right-0 md:static">
                <div
                  className="
                    w-full max-w-sm rounded-2xl shadow-2xl
                    bg-black/55 backdrop-blur-md border border-white/10
                    text-white p-6
                  "
                >
                  <h3 className="text-xl md:text-2xl font-semibold">
                    Make the next version of you
                  </h3>

                  <p className="mt-2 text-white/80">
                    Premium facilities, real results — built for people who mean business.
                  </p>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={handleBookOneDayPass}
                      className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 py-2 px-4"
                    >
                      One Day Pass
                    </button>

                    <button
                      onClick={onJoinNow}
                      className="flex-1 rounded-xl border border-white/20 bg-white/10 py-2 px-4"
                    >
                      Join Now
                    </button>
                  </div>

                  <div className="mt-4 flex justify-between">
                    <div>
                      <div className="text-xs text-white/70">Full access</div>
                      <div className="font-semibold">24 hours</div>
                    </div>
                    <div className="text-orange-400 font-bold text-xl">₹500</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mt-10">
        <div className="container mx-auto px-4">

          {/* FACILITIES */}
          <section id="browse" className="py-10">
            <p className="text-slate-600 text-center mb-6">
              Carefully curated spaces and equipment to deliver consistent results.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {facilities.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.name} className="reveal-on-scroll">
                    <Card className="p-4 rounded-xl shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="bg-orange-50 p-3 rounded-lg">
                          <Icon className="size-6 text-orange-500" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{f.name}</div>
                          <div className="text-slate-600 text-sm">{f.count}</div>
                        </div>
                      </div>
                    </Card>
                  </div>
                );
              })}
            </div>
          </section>

          {/* CLASS SCHEDULE */}
          <section className="py-10">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Class Schedule</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classes.map((c) => (
                <Card key={c.name} className="p-6 rounded-xl shadow-sm reveal-on-scroll">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-slate-900">{c.name}</h3>
                      <div className="flex gap-3 text-slate-600 mt-2">
                        <Clock className="size-4" />
                        <span>{c.time}</span>
                      </div>
                    </div>
                    <Badge className="bg-slate-100 text-slate-700">{c.days}</Badge>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* PRICING */}
          <section id="pricing" className="py-10">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Choose your plan</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {plans.map((p) => (
                <Card
                  key={p.name}
                  className={`p-6 rounded-2xl reveal-on-scroll ${
                    p.popular ? "border-orange-500 border-2 shadow-xl" : ""
                  }`}
                >
                  <CardHeader>
                    <CardTitle className="text-center">{p.name}</CardTitle>
                    <div className="text-center mt-4">
                      <div className="text-slate-900 font-semibold text-lg">{p.price}</div>
                      <div className="text-slate-600 text-sm">{p.duration}</div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-3">
                          <Check className="size-5 text-green-600 mt-0.5" />
                          <span className="text-slate-700">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={onJoinNow}
                      className={`w-full ${
                        p.popular ? "bg-orange-500 hover:bg-orange-600" : ""
                      }`}
                    >
                      Join Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>

          {/* TOOLS */}
          <section id="tools" className="py-10">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Fitness Tools</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4 rounded-xl reveal-on-scroll">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Calculator className="size-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">Health Calculator</div>
                    <div className="text-slate-600 mt-1">BMI, ideal weight & calories</div>
                  </div>
                  <Button onClick={onLogin} variant="outline">
                    Login
                  </Button>
                </div>
              </Card>

              <Card className="p-4 rounded-xl reveal-on-scroll">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Dumbbell className="size-6 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">Workout Generator</div>
                    <div className="text-slate-600 mt-1">Goal-based workouts</div>
                  </div>
                  <Button onClick={onLogin} variant="outline">
                    Login
                  </Button>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dumbbell className="size-6 text-orange-400" />
            <div className="font-semibold">AKHADA</div>
          </div>
          <p className="text-slate-400">
            Transform Your Body, Transform Your Life
          </p>
          <p className="text-slate-500 mt-3">
            © 2025 AKHADA Gym. All rights reserved.
          </p>
        </div>
      </footer>

      {/* BOOKING DIALOG */}
      <OneDayPassBooking
        isOpen={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
        bookingType={bookingType}
      />
    </div>
  );
}
