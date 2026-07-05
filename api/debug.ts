// ============================================================
// /api/debug — 诊断 KV/Redis 配置状态（不暴露敏感信息）
// GET /api/debug → 返回环境变量是否存在 + KV 连接测试
// ============================================================

import { kv } from "@vercel/kv";

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const envStatus = {
    KV_REST_API_URL: !!process.env.KV_REST_API_URL,
    KV_REST_API_TOKEN: !!process.env.KV_REST_API_TOKEN,
    REDIS_URL: !!process.env.REDIS_URL,
    KV_URL: !!process.env.KV_URL,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
  };

  const anyKvConfigured =
    (envStatus.KV_REST_API_URL && envStatus.KV_REST_API_TOKEN) ||
    envStatus.REDIS_URL ||
    envStatus.KV_URL;

  let kvTest: string;
  if (!anyKvConfigured) {
    kvTest = "NOT_CONFIGURED";
  } else {
    try {
      await kv.set("__debug_ping__", "ok");
      const val = await kv.get("__debug_ping__");
      await kv.del("__debug_ping__");
      kvTest = val === "ok" ? "OK" : "READ_FAILED";
    } catch (e: any) {
      kvTest = `ERROR: ${e?.message || String(e)}`;
    }
  }

  return res.status(200).json({
    env: envStatus,
    kvTest,
    anyKvConfigured: !!anyKvConfigured,
    timestamp: new Date().toISOString(),
  });
}
