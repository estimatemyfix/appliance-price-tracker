import puppeteer, { Browser, Page } from 'puppeteer';
import { ScrapingResult } from '@/types';

export class AmazonScraper {
  private browser: Browser | null = null;
  private readonly userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
  ];

  async init(): Promise<void> {
    try {
      this.browser = await puppeteer.launch({
        headless: process.env.PUPPETEER_HEADLESS !== 'false',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu',
          '--window-size=1920x1080'
        ]
      });
    } catch (error) {
      console.error('Failed to initialize Amazon scraper:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }

  private async setupPage(): Promise<Page> {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call init() first.');
    }

    const page = await this.browser.newPage();
    
    // Set random user agent
    await page.setUserAgent(this.getRandomUserAgent());
    
    // Set viewport
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set extra HTTP headers
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
    });

    // Block images and other resources to speed up scraping
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const resourceType = request.resourceType();
      if (['image', 'stylesheet', 'font', 'media'].includes(resourceType)) {
        request.abort();
      } else {
        request.continue();
      }
    });

    return page;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async scrapeProduct(url: string, productListingId: number): Promise<ScrapingResult> {
    let page: Page | null = null;
    
    try {
      page = await this.setupPage();
      
      console.log(`Scraping Amazon product: ${url}`);
      
      // Navigate to product page
      await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: parseInt(process.env.SCRAPER_TIMEOUT || '30000')
      });

      // Wait for page to load
      await this.delay(2000);

      // Check if we hit a CAPTCHA or robot check
      const captchaPresent = await page.$('#captchacharacters') !== null;
      if (captchaPresent) {
        console.warn('Amazon CAPTCHA detected');
        return {
          success: false,
          error: 'CAPTCHA detected',
          is_available: false,
          product_listing_id: productListingId
        };
      }

      // Check if product is available
      const unavailableSelectors = [
        '[data-feature-name="availability"] .a-color-price',
        '.a-alert-content:contains("Currently unavailable")',
        '#availability .a-color-price'
      ];
      
      let isUnavailable = false;
      for (const selector of unavailableSelectors) {
        const element = await page.$(selector);
        if (element) {
          const text = await element.evaluate(el => el.textContent?.toLowerCase() || '');
          if (text.includes('unavailable') || text.includes('out of stock')) {
            isUnavailable = true;
            break;
          }
        }
      }

      if (isUnavailable) {
        console.log('Product unavailable on Amazon');
        return {
          success: true,
          is_available: false,
          product_listing_id: productListingId
        };
      }

      // Extract price information
      const priceSelectors = [
        '.a-price .a-offscreen',
        '#priceblock_pospromoprice',
        '#priceblock_dealprice',
        '#corePrice_feature_div .a-price .a-offscreen',
        '.a-price.a-text-price.a-size-medium.apexPriceToPay .a-offscreen'
      ];

      let price: number | undefined;
      let originalPrice: number | undefined;

      // Try to find current price
      for (const selector of priceSelectors) {
        try {
          const priceElement = await page.$(selector);
          if (priceElement) {
            const priceText = await priceElement.evaluate(el => el.textContent || '');
            const priceMatch = priceText.match(/[\d,]+\.?\d*/);
            if (priceMatch) {
              price = parseFloat(priceMatch[0].replace(/,/g, ''));
              break;
            }
          }
        } catch (error) {
          // Continue to next selector
        }
      }

      // Try to find original/list price
      const originalPriceSelectors = [
        '.a-price.a-text-price .a-offscreen',
        '#priceblock_listprice',
        '.a-price.a-text-price[data-a-color="secondary"] .a-offscreen'
      ];

      for (const selector of originalPriceSelectors) {
        try {
          const originalPriceElement = await page.$(selector);
          if (originalPriceElement) {
            const originalPriceText = await originalPriceElement.evaluate(el => el.textContent || '');
            const originalPriceMatch = originalPriceText.match(/[\d,]+\.?\d*/);
            if (originalPriceMatch) {
              originalPrice = parseFloat(originalPriceMatch[0].replace(/,/g, ''));
              break;
            }
          }
        } catch (error) {
          // Continue to next selector
        }
      }

      // Verify we found a valid price
      if (!price || price <= 0) {
        console.warn('No valid price found on Amazon page');
        return {
          success: false,
          error: 'Could not extract price',
          is_available: true,
          product_listing_id: productListingId
        };
      }

      console.log(`Amazon price scraped: $${price} (original: $${originalPrice || 'N/A'})`);

      return {
        success: true,
        price,
        original_price: originalPrice,
        is_available: true,
        product_listing_id: productListingId
      };

    } catch (error) {
      console.error('Amazon scraping error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown scraping error',
        is_available: false,
        product_listing_id: productListingId
      };
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  async scrapeMultipleProducts(urls: { url: string; productListingId: number }[]): Promise<ScrapingResult[]> {
    const results: ScrapingResult[] = [];
    const delayMs = parseInt(process.env.SCRAPER_DELAY || '2000');

    for (const { url, productListingId } of urls) {
      const result = await this.scrapeProduct(url, productListingId);
      results.push(result);
      
      // Add delay between requests to avoid being blocked
      if (urls.indexOf({ url, productListingId }) < urls.length - 1) {
        await this.delay(delayMs);
      }
    }

    return results;
  }
}

// Utility function for external usage
export const scrapeAmazonProduct = async (url: string, productListingId: number): Promise<ScrapingResult> => {
  const scraper = new AmazonScraper();
  
  try {
    await scraper.init();
    return await scraper.scrapeProduct(url, productListingId);
  } finally {
    await scraper.close();
  }
}; 