export default async function POST(req) {
    try {
      const { orderValue } = req.body;
  
      const utmRes = await fetch("https://addictiveaffiliates.com/api/get-utm");
      const { utm_content, utm_campaign, utm_product } = await utmRes.json();
  
      const webhookURL = `https://addictiveaffiliates.com/api/track-conversion?orderValue=${orderValue}&commissionRate=0.10&affiliateId=${utm_content}&productId=${utm_product}&campaignId=${utm_campaign}`;
  
      const response = await fetch(webhookURL, { method: "POST" });
      const data = await response.json();
  
      res.status(200).json({ message: "Webhook forwarded", data });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
  