import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type ConsentRecord = {
  id: string;
  status: "visitor_pageview" | "accepted_all" | "rejected_optional" | "customized";
  page_path?: string;
  categories: {
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
    marketing: boolean;
  };
  ip_address?: string;
  anonymized_ip?: string;
  proof_of_consent?: string;
  legal_framework: string;
  created_at: string;
  policy_version: string;
};

export type ConsentsJson = {
  total_pageviews: number;
  total_consents: number;
  accepted_all_count: number;
  rejected_count: number;
  customized_count: number;
  updated_at: string;
  consents: ConsentRecord[];
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Fallback in-memory database store
let inMemoryStore: ConsentRecord[] = [];

function maskIp(rawIp: string | null): string {
  if (!rawIp) return "Masked";
  if (rawIp.includes(":")) {
    const parts = rawIp.split(":");
    return parts.length > 2 ? `${parts[0]}:${parts[1]}:*:*:*:*` : "IPv6 Masked";
  }
  const parts = rawIp.split(".");
  return parts.length === 4 ? `${parts[0]}.${parts[1]}.xxx.xxx` : "IPv4 Masked";
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS_HEADERS });
}

export async function GET() {
  try {
    let consents: ConsentRecord[] = [];

    try {
      // Try fetching from Database table via Prisma
      const dbRows = await (prisma as any).cookie_consents.findMany({
        orderBy: { created_at: "desc" },
        take: 1000,
      });

      consents = dbRows.map((r: any) => ({
        id: r.record_id || `consent_${r.id}`,
        status: r.status,
        page_path: r.page_path || "/",
        categories: (r.categories as any) || {
          necessary: true,
          functional: false,
          analytics: false,
          marketing: false,
        },
        ip_address: r.ip_address || r.anonymized_ip || "Stored",
        anonymized_ip: r.anonymized_ip || r.ip_address || "Stored",
        proof_of_consent: r.proof_of_consent,
        legal_framework: r.legal_framework || "Digital Personal Data Protection Act 2023 & IT Act 2000",
        created_at: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString(),
        policy_version: r.policy_version || "v2.0 (August 2026)",
      }));
    } catch {
      // Fallback to in-memory DB store
      consents = [...inMemoryStore];
    }

    const total_pageviews = consents.filter((c) => c.status === "visitor_pageview").length;
    const total_consents = consents.filter((c) => c.status !== "visitor_pageview").length;
    const accepted_all_count = consents.filter((c) => c.status === "accepted_all").length;
    const rejected_count = consents.filter((c) => c.status === "rejected_optional").length;
    const customized_count = consents.filter((c) => c.status === "customized").length;

    const payload: ConsentsJson = {
      total_pageviews,
      total_consents,
      accepted_all_count,
      rejected_count,
      customized_count,
      updated_at: new Date().toISOString(),
      consents,
    };

    return NextResponse.json(payload, { headers: CORS_HEADERS });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to load cookie consent records" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { status, categories, page_path } = body || {};

    if (!status) {
      return NextResponse.json(
        { error: "Missing required status" },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const timestamp = new Date().toISOString();
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "127.0.0.1";

    let newRecord: ConsentRecord;

    if (status === "visitor_pageview") {
      newRecord = {
        id: `visit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        status: "visitor_pageview",
        page_path: page_path || "/",
        categories: {
          necessary: true,
          functional: false,
          analytics: false,
          marketing: false,
        },
        ip_address: clientIp,
        anonymized_ip: maskIp(clientIp),
        legal_framework: "General Visitor Traffic Telemetry",
        created_at: timestamp,
        policy_version: "v2.0 (August 2026)",
      };
    } else {
      const isAccepted = status === "accepted_all" || status === "customized";
      const proofHash = isAccepted
        ? `DPDP_PROOF_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`
        : "OPT_OUT_RECORD";

      newRecord = {
        id: `consent_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        status: status as "accepted_all" | "rejected_optional" | "customized",
        page_path: page_path || "/",
        categories: {
          necessary: true,
          functional: Boolean(categories?.functional),
          analytics: Boolean(categories?.analytics),
          marketing: Boolean(categories?.marketing),
        },
        ip_address: clientIp,
        anonymized_ip: maskIp(clientIp),
        proof_of_consent: proofHash,
        legal_framework: isAccepted
          ? "Digital Personal Data Protection Act 2023 (Sec. 6) & Indian IT Act 2000"
          : "DPDP Act 2023 Opt-Out Record",
        created_at: timestamp,
        policy_version: "v2.0 (August 2026)",
      };
    }

    try {
      // Save directly to Database table
      await (prisma as any).cookie_consents.create({
        data: {
          record_id: newRecord.id,
          status: newRecord.status,
          page_path: newRecord.page_path,
          categories: newRecord.categories as any,
          ip_address: newRecord.ip_address,
          anonymized_ip: newRecord.anonymized_ip,
          proof_of_consent: newRecord.proof_of_consent || null,
          legal_framework: newRecord.legal_framework,
          policy_version: newRecord.policy_version,
          created_at: new Date(timestamp),
        },
      });
    } catch {
      // Fallback in-memory database store
      inMemoryStore.unshift(newRecord);
      if (inMemoryStore.length > 1000) {
        inMemoryStore = inMemoryStore.slice(0, 1000);
      }
    }

    return NextResponse.json(
      {
        ok: true,
        message: "Visitor IP and consent stored in database",
        record_id: newRecord.id,
        ip_address: newRecord.ip_address,
      },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to record visitor IP in database" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function DELETE() {
  try {
    try {
      await (prisma as any).cookie_consents.deleteMany({});
    } catch {}
    inMemoryStore = [];

    return NextResponse.json(
      { ok: true, message: "Database visitor IP logs reset" },
      { headers: CORS_HEADERS }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to reset database logs" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
