import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // 1. Fetch latest 5 contact requests
    const latestContacts = await prisma.contact_requests.findMany({
      orderBy: { id: "desc" },
      take: 5,
    });

    // 2. Fetch latest 5 feedbacks
    const latestFeedback = await prisma.feedbacks.findMany({
      orderBy: { id: "desc" },
      take: 5,
    });

    // 3. Fetch latest 5 newsletter subscribers
    const latestNewsletters = await prisma.newsletter_subscribers.findMany({
      orderBy: { id: "desc" },
      take: 5,
    });

    // 4. Map them to a unified format
    const activities = [
      ...latestContacts.map((c) => ({
        id: `contact-${c.id}`,
        type: "contact",
        title: `New Contact Request: ${c.service || "General Inquiry"}`,
        subtitle: `${c.first_name} ${c.last_name} (${c.status})`,
        time: c.created_at.toISOString(),
        href: `/contact-users`,
      })),
      ...latestFeedback.map((f) => ({
        id: `feedback-${f.id}`,
        type: "feedback",
        title: `New Feedback Received (${f.rating} Stars)`,
        subtitle: `${f.first_name} ${f.last_name} - ${f.service}`,
        time: f.created_at.toISOString(),
        href: `/feedback-page`,
      })),
      ...latestNewsletters.map((n) => ({
        id: `newsletter-${n.id}`,
        type: "newsletter",
        title: `New Newsletter Subscriber`,
        subtitle: `${n.first_name} ${n.last_name} (${n.email})`,
        time: n.created_at.toISOString(),
        href: `/newsletter-users`,
      })),
    ];

    // Sort by time descending (most recent first)
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    // Take top 8
    const finalActivities = activities.slice(0, 8);

    return NextResponse.json(finalActivities);
  } catch (err) {
    console.error("Dashboard activities error:", err);
    return NextResponse.json({ detail: "Internal Server Error" }, { status: 500 });
  }
}
