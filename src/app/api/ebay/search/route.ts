import { NextRequest, NextResponse } from 'next/server';
import { searchEbayBooks, convertToDeal, getEbayItem, extractISBN, type BookCondition } from '@/services/ebayApi';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      query,
      sellers,
      conditions,
      minPrice,
      maxPrice,
      limit = 20,
      fetchDetails = false
    } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const results = await searchEbayBooks(query, {
      limit,
      minPrice,
      maxPrice,
      conditions: conditions as BookCondition[],
      sellers,
    });

    // Convert to deals and optionally fetch full details for ISBN
    let deals = (results.itemSummaries || []).map(item => convertToDeal(item));

    // If fetchDetails is true, get full item details for ISBN extraction
    if (fetchDetails) {
      const dealsWithDetails = await Promise.all(
        deals.slice(0, 10).map(async (deal) => {
          if (!deal.isbn) {
            try {
              const fullItem = await getEbayItem(deal.ebayItemId);
              if (fullItem) {
                const isbn = extractISBN(fullItem);
                return { ...deal, isbn };
              }
            } catch (e) {
              console.error('Error fetching item details:', e);
            }
          }
          return deal;
        })
      );
      deals = [...dealsWithDetails, ...deals.slice(10)];
    }

    return NextResponse.json({
      total: results.total,
      deals,
    });
  } catch (error) {
    console.error('eBay search error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Search failed' },
      { status: 500 }
    );
  }
}
