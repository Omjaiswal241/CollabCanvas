import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Users, Zap, Share2, Layers, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import heroImage from "@/assets/hero-illustration.png";
import { useEffect, useState } from "react";

const features = [
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Draw, sketch, and brainstorm together with your team in real time.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Buttery smooth canvas experience with zero lag, even with many collaborators.",
  },
  {
    icon: Share2,
    title: "Easy Sharing",
    description: "Share your boards with a single link. No sign-up required for viewers.",
  },
  {
    icon: Layers,
    title: "Infinite Canvas",
    description: "Never run out of space. Zoom, pan, and organize freely on an infinite board.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 font-heading text-sm font-medium text-primary">
                Collaborative Whiteboarding
              </span>
            </motion.div>

            <motion.h1
              className="mt-4 font-heading text-5xl font-bold leading-tight tracking-tight text-foreground md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Think together.{" "}
              <span className="text-primary">Draw together.</span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              CollabCanvas is the open-source whiteboard for teams who think
              visually. Sketch ideas, map workflows, and collaborate in real
              time.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {isLoggedIn ? (
                <Link to="/dashboard">
                  <Button size="lg" className="gap-2 px-8 text-base">
                    Go to Dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/signup">
                    <Button size="lg" className="gap-2 px-8 text-base">
                      Start Drawing <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/signin">
                    <Button size="lg" variant="outline" className="px-8 text-base">
                      Sign In
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </div>

          {/* Hero Image */}
          <motion.div
            className="mx-auto mt-16 max-w-5xl overflow-hidden rounded-2xl border border-border shadow-2xl shadow-primary/10"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <img
              src={heroImage}
              alt="CollabCanvas collaborative whiteboard interface"
              className="w-full"
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-card py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="mx-auto mb-16 max-w-lg text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Everything you need to collaborate
            </h2>
            <p className="mt-4 text-muted-foreground">
              A powerful canvas with the tools your team actually needs.
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="group rounded-xl border border-border bg-background p-6 transition-shadow hover:shadow-lg hover:shadow-primary/5"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            className="mx-auto max-w-2xl rounded-2xl bg-primary p-12 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
          >
            <h2 className="font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
              Ready to create together?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-primary-foreground/80">
              Join thousands of teams already using CollabCanvas to bring their
              ideas to life.
            </p>
            <Link to="/signup">
              <Button
                size="lg"
                variant="secondary"
                className="mt-8 px-8 text-base font-semibold"
              >
                Get Started — It's Free
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CollabCanvas. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
