import "dotenv/config";

import { Pool, neonConfig } from "@neondatabase/serverless";

const userId = "user_3Bp1CPbi2tReU3xhs4X7is1tb0P";

const seedLinks = [
  {
    originalUrl: "https://example.com/product-launch",
    shortCode: "launch-2026",
  },
  {
    originalUrl: "https://example.com/docs/getting-started",
    shortCode: "docs-home",
  },
  {
    originalUrl: "https://example.com/blog/how-to-scale",
    shortCode: "scale-guide",
  },
  {
    originalUrl: "https://example.com/pricing",
    shortCode: "pricing-page",
  },
  {
    originalUrl: "https://example.com/about",
    shortCode: "about-us",
  },
  {
    originalUrl: "https://example.com/case-studies/saas-growth",
    shortCode: "case-saas",
  },
  {
    originalUrl: "https://example.com/newsletter",
    shortCode: "weekly-updates",
  },
  {
    originalUrl: "https://example.com/community",
    shortCode: "community-hub",
  },
  {
    originalUrl: "https://example.com/support",
    shortCode: "help-center",
  },
  {
    originalUrl: "https://example.com/contact",
    shortCode: "contact-us",
  },
];

neonConfig.webSocketConstructor = WebSocket;

async function main(): Promise<void> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  const params: Array<string> = [];
  const placeholders = seedLinks
    .map((link) => {
      params.push(userId, link.originalUrl, link.shortCode);
      const index = params.length;
      return `(default, $${index - 2}, $${index - 1}, $${index}, default, default)`;
    })
    .join(", ");

  const result = await pool.query(
    `
      insert into "links" ("id", "user_id", "original_url", "short_code", "created_at", "updated_at")
      values ${placeholders}
      on conflict ("short_code") do nothing
      returning "id", "short_code"
    `,
    params,
  );

  console.log(
    `Seed complete. Inserted ${result.rows.length} link(s) for ${userId}.`,
  );
  console.log(result.rows);

  await pool.end();
}

main().catch((error: unknown) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
