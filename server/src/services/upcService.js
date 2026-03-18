import { pool } from "../config/db.js"
import dotenv from "dotenv"
dotenv.config()

export const fetchUPCData = async (upc) => {
  try {
    const apiKey = process.env.GO_UPC
    const response = await fetch(`https://go-upc.com/api/v1/code/${upc}?key=${apiKey}`)

    if(!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log(data)
    return data.product
  } catch (error) {
    console.error("Fetch error:", error.message)
    return null
  }
}

// services/titleCleaner.js

export const extractFormat = (rawTitle) => {
  const lower = rawTitle.toLowerCase();

  if (/\bblu[\s-]?ray\b/.test(lower)) return "blu_ray";
  if (/\b4k\b|\bultra[\s-]?hd\b|\buhd\b/.test(lower)) return "4k";
  if (/\bdvd\b/.test(lower)) return "dvd";

  return null;
};

export const lightCleanTitle = (rawTitle) => {
  if (!rawTitle) return "";

  let cleaned = rawTitle.toLowerCase().trim();

  cleaned = cleaned.replace(/\bblu[\s-]?ray\b/g, " ");
  cleaned = cleaned.replace(/\b4k\b/g, " ");
  cleaned = cleaned.replace(/\bultra[\s-]?hd\b/g, " ");
  cleaned = cleaned.replace(/\buhd\b/g, " ");
  cleaned = cleaned.replace(/\bdvd\b/g, " ");
  cleaned = cleaned.replace(/\bdigital(\s+copy|\s+code)?\b/g, " ");

  cleaned = cleaned.replace(/\s*[+|/-]\s*/g, " ");
  cleaned = cleaned.replace(/\s+/g, " ").trim();

  // quick title-case pass
  cleaned = cleaned
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return cleaned;
};

export const insertTitle = async ({
    title, 
    raw_upc_title, 
    barcode, 
    format,
    metadata_status, 
    rip_status, 
}) => {
    const query = `
    INSERT INTO titles (
    title, 
    raw_upc_title,
    barcode, 
    format, 
    metadata_status, 
    rip_status
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
    `

    const values = [
        title, 
        raw_upc_title,
        barcode,
        format, 
        metadata_status, 
        rip_status,
    ]

    const result = await pool.query(query, values)
    return result.rows[0]

}