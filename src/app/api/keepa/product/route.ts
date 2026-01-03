import { NextRequest, NextResponse } from 'next/server';
import { getProductByIsbn, calculateFees, makeDecision } from '@/services/keepaApi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { isbn, ebayPrice } = body;

    if (!isbn) {
      return NextResponse.json({ error: 'ISBN is required' }, { status: 400 });
    }

    const product = await getProductByIsbn(isbn);

    if (!product) {
      return NextResponse.json({ error: 'Product not found on Amazon' }, { status: 404 });
    }

    // Calculate fees and profit if eBay price provided
    let analysis = null;
    if (ebayPrice && product.buyBoxPrice) {
      const fees = calculateFees(ebayPrice, product.buyBoxPrice);
      const decision = makeDecision(
        Math.max(fees.fbaProfit, fees.fbmProfit),
        Math.max(fees.fbaRoi, fees.fbmRoi),
        product.salesRank,
        product.salesRankDrops30,
        product.fbaOfferCount,
        product.isAmazon
      );

      analysis = {
        ...fees,
        ...decision,
        sellPrice: product.buyBoxPrice,
      };
    }

    return NextResponse.json({
      product,
      analysis,
    });
  } catch (error) {
    console.error('Keepa API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
