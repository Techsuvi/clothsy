// pages/support/index.js
"use client";

import Link from "next/link";

const supportOptions = [
  {
    title: "Track Order",
    description: "Find the status of your recent orders.",
    href: "/user/orders"
  },
  {
    title: "Return or Replace Items",
    description: "Start a return or replacement.",
    href: "/support/return"
  },
  {
    title: "Report a Problem",
    description: "Let us know if something went wrong.",
    href: "/support/report-problem"
  },
  {
    title: "Browse FAQs",
    description: "Common questions and answers.",
    href: "/support/faq"
  },
  {
    title: "Contact Us",
    description: "Reach our support team by chat or email.",
    href: "/support/contact"
  },
];

export default function SupportHome() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Help & Support</h1>
      <p className="text-gray-600 mb-8">How can we assist you today?</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supportOptions.map((opt, i) => (
          <Link
            key={i}
            href={opt.href}
            className="block p-6 border rounded-lg shadow-sm hover:shadow-md transition bg-white"
          >
            <h2 className="text-xl font-semibold mb-2">{opt.title}</h2>
            <p className="text-gray-500 text-sm">{opt.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}