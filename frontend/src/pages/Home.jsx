import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  BookOpen,
  BellRing,
  ShieldCheck,
  Users,
  CheckCircle2,
  TrendingUp,
  Wallet,
  Smartphone,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("ledger");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const slides = [
    {
      subtitle: "For Retailers & Shopkeepers",
      title: "Digitize Your Shop Ledger Book in 2 Minutes",
      description: "Experience 100% secure shop credit tracking with instant balance calculations, automated due alerts, and custom PDF report downloads.",
      image: "/ledger_mockup.png",
      link: "/register",
      bgClass: "from-indigo-600/5 to-violet-600/5",
      badgeText: "Most Popular"
    },
    {
      subtitle: "For Smart Customers",
      title: "Verify Dues and Outstanding Balances Instantly",
      description: "Never lose track of your local purchases. Get instant SMS/WhatsApp alerts for every credit and payment recorded by your vendor.",
      image: "/ledger_mobile.png",
      link: "/register",
      bgClass: "from-emerald-600/5 to-teal-600/5",
      badgeText: "Customer Centric"
    },
    {
      subtitle: "For Wholesalers & Distributors",
      title: "Manage Multi-shop Ledgers and Dues Seamlessly",
      description: "Keep track of distributor purchase logs, customer credit limits, supplier accounts, and team operator logins from one secure platform.",
      image: "/ledger_mockup.png",
      link: "/register",
      bgClass: "from-amber-600/5 to-orange-600/5",
      badgeText: "Enterprise Grade"
    }
  ];

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [slides.length]);

  const tabs = {
    ledger: {
      label: "Credit Ledger",
      title: "Keep track of credit (Udhaar) and payments (Jama) instantly.",
      description: "Say goodbye to old paper diaries. Record transactions with detailed description tags, filter them by date range, and let the system automatically manage balances.",
      icon: BookOpen,
      image: "/ledger_mockup.png"
    },
    reminders: {
      label: "Free Reminders",
      title: "Recover credit dues 3x faster with custom reminders.",
      description: "Automatically format and compose payment reminders for each customer based on their balance. Share details via WhatsApp or copy to SMS in one click.",
      icon: BellRing,
      image: "/ledger_mobile.png"
    },
    security: {
      label: "Secure & Backed",
      title: "Your shop records are 100% safe and automatically backed up.",
      description: "Complete login protection, data isolation, and cloud backup. Your accounting records are always available whenever and wherever you need them.",
      icon: ShieldCheck,
      image: "/ledger_mockup.png"
    },
    staff: {
      label: "Staff Access",
      title: "Restrict staff actions with customizable roles.",
      description: "Authorize staff accounts to record entries while retaining dashboard totals and settings access exclusively for the store owner.",
      icon: Users,
      image: "/ledger_mobile.png"
    }
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const ActiveTabIcon = tabs[activeTab].icon;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-indigo-500 selection:text-white">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Brand Logo */}
            <div className="flex items-center space-x-2">
              <span className="bg-linear-to-r from-indigo-600 to-violet-600 bg-clip-text text-2xl font-black tracking-tight text-transparent dark:from-indigo-400 dark:to-violet-400">
                MyKhata
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              {/* Dropdown 1 */}
              <div className="relative group py-2">
                <button className="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer">
                  For Business <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/register" className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg">
                    Shopkeeper Ledger
                  </Link>
                  <Link to="/register" className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg">
                    Wholesale Accounts
                  </Link>
                  <Link to="/register" className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg">
                    Distributor Dues
                  </Link>
                </div>
              </div>

              {/* Dropdown 2 */}
              <div className="relative group py-2">
                <button className="flex items-center gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer">
                  For Customers <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                </button>
                <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 p-2 shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/login" className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg">
                    Track My Dues
                  </Link>
                  <Link to="/login" className="block px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100 rounded-lg">
                    Receive Alerts
                  </Link>
                </div>
              </div>

              <a href="#how-it-works" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                How It Works
              </a>

              <a href="#features" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
                Features
              </a>
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/login"
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-5 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 transition hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-2xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-500"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="border-t border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-950 md:hidden animate-in slide-in-from-top duration-200">
            <div className="space-y-4">
              <div>
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">For Business</p>
                <div className="mt-1 space-y-1">
                  <Link to="/register" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900">
                    Shopkeeper Ledger
                  </Link>
                  <Link to="/register" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900">
                    Wholesale Accounts
                  </Link>
                </div>
              </div>
              <hr className="border-slate-100 dark:border-slate-900" />
              <div>
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">For Customers</p>
                <div className="mt-1 space-y-1">
                  <Link to="/login" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900">
                    Track My Dues
                  </Link>
                </div>
              </div>
              <hr className="border-slate-100 dark:border-slate-900" />
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                How It Works
              </a>
              <a
                href="#features"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                Features
              </a>
              <div className="grid grid-cols-2 gap-3 pt-4">
                <Link
                  to="/login"
                  className="flex justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex justify-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Slider Section */}
        <section className="relative overflow-hidden bg-white dark:bg-slate-950 py-12 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-4xl border border-slate-200/60 dark:border-slate-800 bg-linear-to-br from-indigo-50/40 via-white to-violet-50/40 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 p-8 sm:p-12 lg:p-16 shadow-2xl">
              <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
                
                {/* Text Side (Slideshow content) */}
                <div className="space-y-6 lg:col-span-7">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 px-4 py-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100/50 dark:border-indigo-950">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>{slides[currentSlide].subtitle}</span>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 sm:text-5xl lg:text-6xl leading-tight">
                      {slides[currentSlide].title}
                    </h1>
                    <p className="text-base text-slate-600 dark:text-slate-400 sm:text-lg max-w-xl">
                      {slides[currentSlide].description}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Link
                      to={slides[currentSlide].link}
                      className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 hover:bg-indigo-500 transition-all cursor-pointer"
                    >
                      <span>Get Started Now</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <a
                      href="#features"
                      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-7 py-3.5 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                    >
                      Explore Features
                    </a>
                  </div>

                  {/* Manual Slider Indicators */}
                  <div className="flex items-center gap-4 pt-6">
                    <div className="flex gap-2">
                      {slides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentSlide(idx)}
                          className={`h-2.5 rounded-full transition-all duration-300 ${
                            currentSlide === idx ? "w-8 bg-indigo-600" : "w-2.5 bg-slate-300 dark:bg-slate-800"
                          }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        ></button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevSlide}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 cursor-pointer"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={handleNextSlide}
                        className="rounded-xl border border-slate-200 dark:border-slate-800 p-2 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 cursor-pointer"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mockup Image Side */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative group overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 p-2 shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                    <div className="absolute inset-0 bg-linear-to-tr from-indigo-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <img
                      src={slides[currentSlide].image}
                      alt={slides[currentSlide].title}
                      className="rounded-2xl object-cover max-h-[360px] lg:max-h-[420px] w-auto shadow-md"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Product Highlights / Features Grid */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 space-y-24">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 sm:text-4xl">
              Everything You Need to Manage Shop Credit
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Stop using paper notebooks that get lost or damaged. MyKhata makes credit tracking elegant, fast, and simple.
            </p>
          </div>

          {/* Row 1 */}
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            <div className="space-y-6 lg:col-span-5">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                Double-Entry Ledger Tracking
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Instantly record Credit (Udhaar) and Payments (Jama) transactions. Keep individual customer pages with chronological logs, custom description tags, and live net balances.
              </p>
              <ul className="space-y-3 font-semibold text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Real-time net balance calculation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Filter records by type and custom dates</span>
                </li>
              </ul>
            </div>
            <div className="lg:col-span-7 flex justify-center">
              <img
                src="/ledger_mockup.png"
                alt="Ledger Mockup"
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl max-h-[380px] object-cover"
              />
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:flex-row-reverse">
            <div className="lg:col-span-7 flex justify-center order-last lg:order-first">
              <img
                src="/ledger_mobile.png"
                alt="Mobile App Mockup"
                className="rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl max-h-[380px] object-cover"
              />
            </div>
            <div className="space-y-6 lg:col-span-5">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                <BellRing className="h-6 w-6" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                Automated Payment Reminders
              </h3>
              <p className="text-slate-600 dark:text-slate-400">
                Generate payment reminder cards customized with the customer's exact pending amount and your shop name. Send reminders instantly via WhatsApp with pre-composed links.
              </p>
              <ul className="space-y-3 font-semibold text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Collect outstanding balances 3x faster</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>One-click WhatsApp dispatch simulation</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Interactive Feature Tabs Section */}
        <section className="bg-slate-100 dark:bg-slate-950/40 py-16 lg:py-24 border-y border-slate-200 dark:border-slate-850">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="mx-auto max-w-3xl text-center space-y-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 sm:text-4xl">
                Experience the Advanced UI Features
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Toggle through key features below to see how our digital solution outperforms traditional accounting.
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              {/* Tab Selector Links */}
              <div className="lg:col-span-5">
                <div className="flex flex-col gap-3">
                  {Object.entries(tabs).map(([key, tab]) => {
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setActiveTab(key)}
                        className={`flex items-center justify-between rounded-2xl border p-5 text-left transition-all cursor-pointer ${
                          activeTab === key
                            ? "border-indigo-600 bg-white text-indigo-600 dark:border-indigo-500 dark:bg-slate-900 dark:text-indigo-400 shadow-md"
                            : "border-slate-200/60 bg-transparent text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`rounded-xl p-3 transition-colors ${
                            activeTab === key ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400" : "bg-slate-200/40 text-slate-500 dark:bg-slate-900"
                          }`}>
                            <TabIcon className="h-6 w-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-200">{tab.label}</h4>
                          </div>
                        </div>
                        <ArrowRight className={`h-4 w-4 transition-transform ${activeTab === key ? "translate-x-1" : ""}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tab Content Display */}
              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 sm:p-10 shadow-xl space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-indigo-50 dark:bg-indigo-950/40 p-2.5 text-indigo-600 dark:text-indigo-400">
                      <ActiveTabIcon className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                      {tabs[activeTab].title}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tabs[activeTab].description}
                  </p>
                  <div className="rounded-2xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900 p-2 flex justify-center max-h-[300px] overflow-hidden">
                    <img
                      src={tabs[activeTab].image}
                      alt={tabs[activeTab].label}
                      className="rounded-xl object-contain max-w-full h-auto shadow-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services / Feature Cards Grid */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24 space-y-12">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 sm:text-4xl">
              Ledger Services Built for Growth
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Boost your store recovery rates, manage transactions efficiently, and track ledger logs securely.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-md hover:shadow-lg transition">
              <div className="inline-flex rounded-xl bg-indigo-50 dark:bg-indigo-950/50 p-3 text-indigo-600 dark:text-indigo-400">
                <BookOpen className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-slate-800 dark:text-slate-100">Udhaar Jamaica Ledger</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Easily register credits and payments for customers in an interoperable journal register layout.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-md hover:shadow-lg transition">
              <div className="inline-flex rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-3 text-emerald-600 dark:text-emerald-400">
                <BellRing className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-slate-800 dark:text-slate-100">WhatsApp Alert Reminders</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Send manual click link text alerts detailing exact credits with customized shop details.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-md hover:shadow-lg transition">
              <div className="inline-flex rounded-xl bg-rose-50 dark:bg-rose-950/50 p-3 text-rose-600 dark:text-rose-400">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-slate-800 dark:text-slate-100">Credit Limit Thresholds</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Configure maximum dues limit values. Get alerted when customers exceed limit entries.
              </p>
            </div>

            {/* Card 4 */}
            <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-md hover:shadow-lg transition">
              <div className="inline-flex rounded-xl bg-amber-50 dark:bg-amber-950/50 p-3 text-amber-600 dark:text-amber-400">
                <Wallet className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-slate-800 dark:text-slate-100">Ledger PDF Statements</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Compile transactions into downloadable timelines. Print or share account logs easily.
              </p>
            </div>

            {/* Card 5 */}
            <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-md hover:shadow-lg transition">
              <div className="inline-flex rounded-xl bg-violet-50 dark:bg-violet-950/50 p-3 text-violet-600 dark:text-violet-400">
                <Smartphone className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-slate-800 dark:text-slate-100">Multi-Device Cloud Sync</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Log in from any device. Your records sync automatically and instantly to secure servers.
              </p>
            </div>

            {/* Card 6 */}
            <div className="rounded-3xl border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-md hover:shadow-lg transition">
              <div className="inline-flex rounded-xl bg-teal-50 dark:bg-teal-950/50 p-3 text-teal-600 dark:text-teal-400">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="mt-4 text-lg font-bold text-slate-800 dark:text-slate-100">Admin Control Panel</h4>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Monitor business records, review platform stats, and configure settings controls smoothly.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-slate-100 dark:bg-slate-950/40 py-16 lg:py-24 border-y border-slate-200 dark:border-slate-850">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="mx-auto max-w-3xl text-center space-y-4">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 sm:text-4xl">
                Get Started in 3 Simple Steps
              </h2>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Transitioning to a digital ledger has never been faster. Follow these steps to digitize your accounts.
              </p>
            </div>

            <div className="grid gap-12 md:grid-cols-3">
              {/* Step 1 */}
              <div className="relative text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white font-extrabold text-xl shadow-lg shadow-indigo-600/20">
                  1
                </div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">Create Shop Account</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
                  Register in 2 minutes. Enter your email, shop name, and contact details to get a private ledger.
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white font-extrabold text-xl shadow-lg shadow-indigo-600/20">
                  2
                </div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">Add Your Customers</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
                  Create customer records on your dashboard using their phone number and optional shop addresses.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 text-white font-extrabold text-xl shadow-lg shadow-indigo-600/20">
                  3
                </div>
                <h4 className="text-xl font-bold text-slate-800 dark:text-slate-100">Record Credit & Payments</h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xs mx-auto">
                  Start entering credit (Udhaar) and payment (Jama) transactions. Let the ledger auto-calculate outstanding balances.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Card Section */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-4xl bg-linear-to-br from-indigo-900 to-indigo-950 p-10 sm:p-16 text-center text-white shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.15),transparent)]"></div>
            <div className="relative max-w-3xl mx-auto space-y-8">
              <h2 className="text-3xl font-extrabold sm:text-5xl leading-tight">
                Become a Digital Shopkeeper Today
              </h2>
              <p className="text-indigo-200 text-base sm:text-lg max-w-xl mx-auto">
                Join thousands of merchants managing their credit books securely. Increase collection rates, view analytics, and backup files instantly.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-8 py-4 text-sm font-bold text-indigo-950 shadow-xl transition hover:bg-slate-50 cursor-pointer"
                >
                  <span>Open Free Account</span>
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-2xl border border-indigo-500/50 bg-indigo-900/40 px-8 py-4 text-sm font-bold text-white transition hover:bg-indigo-900/60"
                >
                  <span>Merchant Login</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 py-12 text-slate-500 dark:text-slate-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">MyKhata</h4>
            <p className="text-xs leading-relaxed max-w-xs">
              Simple, premium digital ledger register management system for shopkeepers, wholesalers, and retail merchants.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">For Businesses</h5>
            <ul className="mt-4 space-y-2 text-xs">
              <li><Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400">Retail Shops</Link></li>
              <li><Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400">Wholesale Ledgers</Link></li>
              <li><Link to="/register" className="hover:text-indigo-600 dark:hover:text-indigo-400">Distributors</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">For Individuals</h5>
            <ul className="mt-4 space-y-2 text-xs">
              <li><Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">Track Customer Balances</Link></li>
              <li><Link to="/login" className="hover:text-indigo-600 dark:hover:text-indigo-400">SMS Notifications</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">Legal & Support</h5>
            <ul className="mt-4 space-y-2 text-xs">
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-slate-100 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© 2026 MyKhata. Crafted for modern shop credit ledger bookkeeping.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-200">Facebook</a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-200">Twitter</a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-200">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
