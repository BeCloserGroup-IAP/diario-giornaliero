export default async function handler(req: any, res: any): Promise<void> {
  res.status(200).json({ ok: true, time: Date.now() });
}
