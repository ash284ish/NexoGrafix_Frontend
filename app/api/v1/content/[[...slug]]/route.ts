import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "testimonials");

const PAGE_MAP: Record<string, string> = {
  "home": "home.json",
  "about": "about.json",
  "contact": "contact.json",
  "faqs": "faqs.json",
  "feedback": "feedback.json",
  "blog": "blog.json",
  "blog-details": "blogdetail.json",
  "dashboard-preview": "dashboardpreview.json",
  "arohio/main-feature": "arohio-main-feature.json",
  "header": "header.json",
  "footer": "footer.json",
  "terms": "terms.json",
  "refund-policy": "refunds.json",
  "privacy-policy": "privacy-policy.json",
  "book-publishing": "book-publishing.json",
  "publishing-digital": "publishing_digital.json",
  "accessibilty-feature": "accessibilty-feature.json",
  "it-developement": "it-developement.json",
  "data-labelling": "data-labelling.json",
  "localization": "localization.json",
  "elearning": "elearning.json",
  "samples": "samples.json",
  "blog-post-map": "blog_post_map.json"
};

async function loadJson(fileName: string): Promise<any> {
  const filePath = path.join(CONTENT_DIR, fileName);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    return { error: `Missing or invalid file: ${fileName}` };
  }
}

async function saveJson(fileName: string, data: any): Promise<any> {
  const filePath = path.join(CONTENT_DIR, fileName);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const payload = JSON.stringify(data, null, 2);
  
  // Write to temporary file first, then rename (atomic write)
  const tempPath = `${filePath}.${Date.now()}.tmp`;
  await fs.writeFile(tempPath, payload, "utf-8");
  await fs.rename(tempPath, filePath);
  
  return { ok: true, file: fileName, path: filePath };
}

function updateJsonPath(obj: any, pathStr: string, value: string) {
  const keys = pathStr.split(".");
  let ref = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i];
    const nextKey = keys[i + 1];
    
    // Determine type of the next reference (array or object)
    const isNextNumeric = !isNaN(Number(nextKey));
    const parsedKey = !isNaN(Number(k)) ? Number(k) : k;

    if (ref[parsedKey] === undefined) {
      ref[parsedKey] = isNextNumeric ? [] : {};
    }
    ref = ref[parsedKey];
  }
  const lastKey = keys[keys.length - 1];
  const parsedLastKey = !isNaN(Number(lastKey)) ? Number(lastKey) : lastKey;
  ref[parsedLastKey] = value;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const slugPath = slug.join("/");

  // 1. Get latest blogs endpoint
  if (slugPath === "blog/latest") {
    const limitParam = request.nextUrl.searchParams.get("limit");
    const limit = limitParam ? Math.max(1, Math.min(parseInt(limitParam, 10) || 3, 50)) : 3;

    const data = await loadJson("blog.json");
    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 404 });
    }

    const posts = data.posts || [];
    const sorted = [...posts].sort((a: any, b: any) => {
      const dateA = new Date(a.dateISO || 0).getTime();
      const dateB = new Date(b.dateISO || 0).getTime();
      return dateB - dateA;
    });

    const latest = sorted.slice(0, limit).map((p: any) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      dateISO: p.dateISO,
      readTime: p.readTime,
      cover: p.cover || data.assets?.fallback_cover,
      excerpt: p.excerpt,
      slug: p.slug,
      href: `/blog/${p.slug}`,
    }));

    return NextResponse.json({ items: latest });
  }

  // 2. Read standard content page
  const fileName = PAGE_MAP[slugPath];
  if (!fileName) {
    return NextResponse.json({ error: `Not Found: ${slugPath}` }, { status: 404 });
  }

  const content = await loadJson(fileName);
  if (content.error) {
    return NextResponse.json({ error: content.error }, { status: 404 });
  }

  return NextResponse.json(content);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const slugPath = slug.join("/");

  const fileName = PAGE_MAP[slugPath];
  if (!fileName) {
    return NextResponse.json({ error: `Not Found: ${slugPath}` }, { status: 404 });
  }

  try {
    const body = await request.json();
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Body must be a non-empty JSON object" }, { status: 400 });
    }

    const result = await saveJson(fileName, body);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || [];
  const slugPath = slug.join("/");

  // 1. Add Testimonial endpoint
  if (slugPath === "testimonials") {
    try {
      const body = await request.json();
      const required = ["first_name", "last_name", "service", "rating", "message"];
      for (const field of required) {
        if (!body[field]) {
          return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 });
        }
      }

      const data = await loadJson("testimonials.json");
      const testimonials = data.testimonials || [];
      const newTestimonial = {
        id: `t${testimonials.length + 1}`,
        first_name: body.first_name.trim(),
        last_name: body.last_name.trim(),
        role: (body.role || "").trim(),
        service: body.service,
        rating: parseInt(body.rating, 10),
        message: body.message.trim(),
        avatar_url: body.avatar_url || "https://i.pravatar.cc/120",
        published: !!body.publish_permission,
        created_at: new Date().toISOString(),
      };

      testimonials.push(newTestimonial);
      data.testimonials = testimonials;
      await saveJson("testimonials.json", data);

      return NextResponse.json(
        {
          ok: true,
          message: "Testimonial submitted successfully",
          testimonial_id: newTestimonial.id,
        },
        { status: 201 }
      );
    } catch (err) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
  }

  // 2. Testimonial Avatar Upload (multipart/form-data)
  if (slugPath === "testimonial-avatar") {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      const testimonialId = formData.get("testimonial_id") as string;

      if (!file || !testimonialId) {
        return NextResponse.json({ error: "Missing file or testimonial_id" }, { status: 400 });
      }

      if (!file.type || !file.type.startsWith("image/")) {
        return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
      }

      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      const ext = path.extname(file.name).toLowerCase() || ".jpg";
      const stem = path.parse(file.name).name;
      const safeName = `${stem}${ext}`;
      const filePath = path.join(UPLOAD_DIR, safeName);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      const origin = new URL(request.url).origin;
      const publicUrl = `${origin}/api/uploads/testimonials/${safeName}`;

      const data = await loadJson("feedback.json");
      const testimonials = data.testimonials || [];
      let updated = false;

      for (const t of testimonials) {
        if (t && String(t.id) === String(testimonialId)) {
          t.avatar_url = publicUrl;
          updated = true;
          break;
        }
      }

      if (!updated) {
        return NextResponse.json({ error: `Testimonial id not found: ${testimonialId}` }, { status: 404 });
      }

      data.testimonials = testimonials;
      await saveJson("feedback.json", data);

      return NextResponse.json({
        ok: true,
        url: publicUrl,
        testimonial_id: testimonialId,
        updated_json: true,
      });
    } catch (err) {
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
  }

  // 3. Footer upload certificate
  if (slugPath === "footer/upload-certificate") {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      const jsonPath = formData.get("json_path") as string;

      if (!file || !jsonPath) {
        return NextResponse.json({ error: "Missing file or json_path" }, { status: 400 });
      }

      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      const ext = path.extname(file.name).toLowerCase() || ".jpg";
      const safeName = `${path.parse(file.name).name}${ext}`;
      const filePath = path.join(UPLOAD_DIR, safeName);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      const origin = new URL(request.url).origin;
      const publicUrl = `${origin}/api/uploads/testimonials/${safeName}`;

      const data = await loadJson("footer.json");
      updateJsonPath(data, jsonPath, publicUrl);
      await saveJson("footer.json", data);

      return NextResponse.json({
        ok: true,
        url: publicUrl,
        json_path: jsonPath,
        updated_json: true,
      });
    } catch (err) {
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
  }

  // 4. Other pages upload-image endpoints: [page]/upload-image
  if (slugPath.endsWith("/upload-image")) {
    const pageKey = slugPath.substring(0, slugPath.length - 13);
    const fileName = PAGE_MAP[pageKey];

    if (!fileName) {
      return NextResponse.json({ error: `Not Found: ${slugPath}` }, { status: 404 });
    }

    try {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      const jsonPath = formData.get("json_path") as string;

      if (!file || !jsonPath) {
        return NextResponse.json({ error: "Missing file or json_path" }, { status: 400 });
      }

      await fs.mkdir(UPLOAD_DIR, { recursive: true });
      const ext = path.extname(file.name).toLowerCase() || ".jpg";
      const safeName = `${path.parse(file.name).name}${ext}`;
      const filePath = path.join(UPLOAD_DIR, safeName);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      const origin = new URL(request.url).origin;
      const publicUrl = `${origin}/api/uploads/testimonials/${safeName}`;

      const data = await loadJson(fileName);
      updateJsonPath(data, jsonPath, publicUrl);
      await saveJson(fileName, data);

      return NextResponse.json({
        ok: true,
        url: publicUrl,
        json_path: jsonPath,
        updated_json: true,
      });
    } catch (err) {
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: `Not Found: ${slugPath}` }, { status: 404 });
}
