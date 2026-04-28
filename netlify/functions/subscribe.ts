import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { email, first_name, last_name } = JSON.parse(event.body || "{}");

    if (!email) {
      return { statusCode: 400, body: "Email required" };
    }

    const DC = process.env.MAILCHIMP_DC!;
    const LIST_ID = process.env.MAILCHIMP_LIST_ID!;
    const API_KEY = process.env.MAILCHIMP_API_KEY!;

    const url = `https://${DC}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + Buffer.from("any:" + API_KEY).toString("base64"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        merge_fields: {
          first_name: first_name || "",
          last_name: last_name || "",
        },
      }),
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal error" }),
    };
  }
};