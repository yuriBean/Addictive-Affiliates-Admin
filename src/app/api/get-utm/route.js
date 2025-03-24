let storedUTMs = {};

export default function handler(req, res) {
  if (req.method === "POST") {
    const { utm_content, utm_campaign, utm_product } = req.body;
    storedUTMs = { utm_content, utm_campaign, utm_product };
    return res.status(200).json({ message: "UTMs stored" });
  }

  if (req.method === "GET") {
    return res.status(200).json(storedUTMs);
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
