import { db } from "../src/db";
import { entries } from "../src/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function handler(req: any, res: any): Promise<void> {
  try {
    if (req.method === "GET") {
      const rows = await db.select().from(entries).orderBy(desc(entries.entryDate), desc(entries.id));
      res.status(200).json(rows);
      return;
    }

    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
      const { entryDate, content } = body || {};
      if (!entryDate || !content || !String(content).trim()) {
        res.status(400).json({ error: "entryDate e content sono obbligatori" });
        return;
      }
      const [row] = await db
        .insert(entries)
        .values({ entryDate, content: String(content).trim() })
        .returning();
      res.status(201).json(row);
      return;
    }

    if (req.method === "DELETE") {
      const id = Number(req.query?.id);
      if (!id) {
        res.status(400).json({ error: "id mancante" });
        return;
      }
      await db.delete(entries).where(eq(entries.id, id));
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: "Metodo non consentito" });
  } catch (err: any) {
    res.status(500).json({ error: err?.message || "Errore interno" });
  }
}
