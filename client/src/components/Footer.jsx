import React from 'react';
import Image from 'next/image';
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";
import { cn } from "@/lib/utils";
import Link from 'next/link';
import { LinkPreview } from "@/components/ui/link-preview";
import FareedImage from "../../public/Fareed.jpg";
import { Github, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';

function Footer() {
  const people = [
    {
      id: 1,
      name: "Nitin Gupta",
      designation: "UI/UX Designer & Frontend Developer",
      image: "https://avatars.githubusercontent.com/u/140688515?s=400&u=2c964b96bb84104da1515a863e6425e70063d854&v=4",
      github: "https://github.com/nitin14gupta",
    },
    {
      id: 2,
      name: "Fareed Sayyed",
      designation: "ML and Backend Developer",
      image: FareedImage,
      github: "https://github.com/Fareed95",
    },
    {
      id: 3,
      name: "Rehbar Khan",
      designation: "Frontend Developer",
      image: "https://avatars.githubusercontent.com/u/136853370?v=4",
      github: "https://github.com/thisisarsh1",
    }
  ];

  const services = [
    { name: "Learning Paths", href: "/" },
    { name: "AI Interview", href: "/" },
    { name: "Portfolio Builder", href: "/" },
    { name: "Career Guidance", href: "/" },
    { name: "Skill Assessment", href: "/" },
  ];

  const resources = [
    { name: "Documentation", href: "/" },
    { name: "Blog", href: "/" },
    { name: "Case Studies", href: "/" },
    { name: "Help Center", href: "/" },
    { name: "API Reference", href: "/" },
  ];

  const company = [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/" },
    { name: "Press Kit", href: "/" },
    { name: "Contact", href: "/" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/" },
    { name: "GDPR", href: "/" },
  ];

  return (
    <footer className="bg-gradient-to-b from-neutral-900/50 to-neutral-950/90 backdrop-blur-xl border-t border-neutral-800/50 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="Ape Logo"
                width={40}
                height={40}
              />
              <span className="text-xl font-bold bg-gradient-to-r from-neutral-200 to-neutral-400 bg-clip-text text-transparent">
                Ape
              </span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              Empowering learners worldwide through innovative AI-driven education solutions. Transform your learning journey with personalized paths and expert guidance.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">Services</h3>
            <ul className="space-y-3">
              {services.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-neutral-400 hover:text-white text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">Resources</h3>
            <ul className="space-y-3">
              {resources.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-neutral-400 hover:text-white text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {company.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-neutral-400 hover:text-white text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:contact@Ape.ai" className="text-neutral-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  contact@Ape.ai
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="text-neutral-400 hover:text-white text-sm transition-colors flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +1 (234) 567-890
                </a>
              </li>
              <li>
                <span className="text-neutral-400 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Mumbai, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* <div className="py-8 border-t border-b border-neutral-800/50 flex flex-wrap items-center justify-between gap-6"> */}
          {/* Our Team Section */}
          {/* <div className="flex-1 flex flex-col items-center text-center">
            <h3 className="text-sm font-semibold text-neutral-200 uppercase tracking-wider mb-6">Our Team</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <AnimatedTooltip
                items={people.map(member => ({
                  ...member,
                  className: cn("border-white bg-neutral-900"),
                  content: (
                    <div className="text-center p-2">
                      <p className="text-white font-semibold">{member.name}</p>
                      <p className="text-neutral-400 text-sm">{member.designation}</p>
                      <LinkPreview href={member.github} className="text-blue-400 text-xs hover:underline mt-1">
                        GitHub Profile
                      </LinkPreview>
                    </div>
                  ),
                }))}
              />
            </div>
          </div> */}

          {/* Company Info Section */}
          {/* <div className="flex-1 text-center sm:text-left space-y-4">
            <h2 className="text-2xl font-bold text-neutral-200">Ape.Ai</h2>
            <p className="text-neutral-400">
              Empowering learners worldwide through innovative AI-driven education solutions. Transform your learning journey with personalized paths and expert guidance.
            </p>
          </div> */}

          {/* OUr sectiion */}
          {/* <div className="flex-1 text-center sm:text-left space-y-4">
            <h2 className="text-2xl font-bold text-neutral-200">Our Team</h2>
            <p className="text-neutral-400">
              Meet the passionate team behind Ape.Ai, driving innovation in education.
            </p>
          </div> */}
        {/* </div> */}


        {/* Bottom Bar */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-neutral-400 text-sm">
              © {new Date().getFullYear()} Ape. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {legal.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-neutral-400 hover:text-white text-sm transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;