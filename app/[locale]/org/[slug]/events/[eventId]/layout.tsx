"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import type { PropsWithChildren } from "react";

const TABS = [
  { segment: "dashboard", label: "Vue d'ensemble" },
  { segment: "attendees", label: "Participants" },
  { segment: "zones", label: "Zones d'accès" },
  { segment: "exhibitors", label: "Exposants" },
  { segment: "scanner", label: "Scanner" }
] as const;

type EventLayoutProps = PropsWithChildren<{
  params: {
    locale: string;
    slug: string;
    eventId: string;
  };
}>;

export default function EventLayout({ children, params }: EventLayoutProps) {
  const pathname = usePathname();
  const basePath = `/${params.locale}/org/${params.slug}/events/${params.eventId}`;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="container mx-auto flex flex-wrap gap-2 px-6 py-4">
          {TABS.map((tab) => {
            const href = `${basePath}/${tab.segment}`;
            const isActive =
              pathname === href ||
              pathname.startsWith(`${href}/`) ||
              (tab.segment === "dashboard" && pathname === basePath);

            return (
              <Link
                key={tab.segment}
                href={href}
                className={clsx(
                  "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-orange-500 text-white shadow"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="container mx-auto px-6 py-8">{children}</div>
    </div>
  );
}

