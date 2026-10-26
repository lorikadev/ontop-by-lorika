import { SHOPIFY_URL } from "../../src/const";
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
    const country = event.headers["x-country"] || "";

    const amazonCountries = new Set(["US"]);
    const amazonUrl = "https://amzn.eu/d/03PUeqIZ";

    const target = amazonCountries.has(country)
        ? amazonUrl
        : SHOPIFY_URL;

    return {
        statusCode: 302,
        headers: {
            Location: target
        }
    };
};