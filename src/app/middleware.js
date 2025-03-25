import { NextResponse } from 'next/server';
import { getAffiliateLink, getProduct } from '@/app/firebase/firestoreService';

export async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname.startsWith('/track')) {
    const linkId = url.searchParams.get('linkId');
    if (!linkId) return NextResponse.next();

    try {
      const linkData = await getAffiliateLink(linkId);
      if (!linkData) return NextResponse.next();

      const productData = await getProduct(linkData.productId, linkData.campaignId);
      if (!productData) return NextResponse.next();

      const metaTags = `
        <meta property="og:title" content="${productData.name || 'Track, optimize, and scale your campaigns with ease.'}" />
        <meta property="og:url" content="${productData.productUrl || url.toString()}" />
        <meta property="og:image" content="${productData.image || 'https://addictiveaffiliates.com/logo.png'}" />
      `;

      return new NextResponse(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          ${metaTags}
          <title>${productData.name || "Redirecting..."}</title>
          <script>
            setTimeout(() => {
              window.location.href = "${linkData.productUrl}";
            }, 2000);
          </script>
        </head>
        <body>
          <p>Redirecting to <a href="${linkData.productUrl}">${productData.name}</a>...</p>
        </body>
        </html>
      `, { headers: { 'Content-Type': 'text/html' } });
      
    } catch (error) {
      console.error("Error generating link preview:", error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}