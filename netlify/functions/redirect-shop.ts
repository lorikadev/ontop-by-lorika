import { SHOPIFY_URL } from "../../src/const";
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
    const country = event.headers["x-country"] || "";

    const shopifyCountries = new Set([
        "US", "CA",
        "IT", "FR", "DE", "ES", "NL", "BE", "PT", "AT", "IE", "FI", "SE", "DK",
        "NO", "CH", "PL", "CZ", "SK", "HU", "RO", "BG", "GR", "HR", "SI", "EE",
        "LV", "LT", "LU", "MT", "CY", "IS", "LI", "UA", "GB"
    ]);

    // const amazonUrl = "https://www.amazon.com";

    // const target = shopifyCountries.has(country)
    //     ? SHOPIFY_URL
    //     : amazonUrl;

    // return {
    //     statusCode: 302,
    //     headers: {
    //         Location: target
    //     }
    // };


    const isShopify = shopifyCountries.has(country);

    if (isShopify)
        return {
            statusCode: 302,
            headers: {
                Location: SHOPIFY_URL
            }
        };
    else
        return {
            statusCode: 200,
        };
};