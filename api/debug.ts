// ============================================================
// /api/debug — 诊断 KV/Redis 配置状态（不暴露敏感信息）
// GET /api/debug → 返回环境变量是否存在 + KV 连接测试
// ============================================================

import { createClient } from "@vercel/kv";

function findKvConfig(): { url: string; token: string; varName: string } | null {
  // 1. 标准名
  const stdUrl = process.env.KV_REST_API_URL;
  const stdToken = process.env.KV_REST_API_TOKEN;
  if (stdUrl && stdToken) {
    return { url: stdUrl, token: stdToken, varName: "KV_REST_API_URL" };
  }

  // 2. 通配扫描
  for (const [key, value] of Object.entries(process.env)) {
    if (key.endsWith("_REST_API_URL") && value && key !== "KV_REST_API_URL") {
      const tokenKey = key.replace("_URL", "_TOKEN");
      const token = process.env[tokenKey];
      if (token) {
        return { url: value, token, varName: key };
      }
    }
  }

  return null;
}

export default async function handler(req: any, res: any) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 收集所有 REST_API 相关环境变量（只显示名称，不显示值）
  const kvEnvVars: string[] = [];
  for (const key of Object.keys(process.env)) {
    if (key.endsWith("_REST_API_URL") || key.endsWith("_REST_API_TOKEN")) {
      kvEnvVars.push(key);
    }
  }

  const config = findKvConfig();

  const envStatus = {
    foundVars: kvEnvVars,
    configSource: config?.varName || null,
    ADMIN_PASSWORD: !!process.env.ADMIN_PASSWORD,
    REDIS_URL: !!process.env.REDIS_URL,
    KV_URL: !!process.env.KV_URL,
  };

  let kvTest: string;
  if (!config) {
    kvTest = "NOT_CONFIGURED";
  } else {
    try {
      const client = createClient({ url: config.url, token: config.token });
      await client.set("__debug_ping__", "ok");
      const val = await client.get("__debug_ping__");
      await client.del("__debug_ping__");
      kvTest = val === "ok" ? "OK" : "READ_FAILED";
    } catch (e: any) {
      kvTest = `ERROR: ${e?.message || String(e)}`;
    }
  }

  return res.status(200).json({
    env: envStatus,
    kvTest,
    anyKvConfigured: !!config,
    timestamp: new Date().toISOString(),
  });
}
