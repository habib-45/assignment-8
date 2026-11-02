/**
 * Dependency-free PDF booking invoice.
 *
 * Generates a real, single-page A4 PDF (Catalog → Pages → Page → Contents →
 * Fonts, with a correct xref table) straight from a Booking, then hands it to
 * the browser as a download. No pdf library needed, which keeps the bundle
 * small and the invoice working offline.
 *
 * Everything written to the file is ASCII after sanitising, so byte offsets
 * in the xref table are exact.
 */

import type { Booking } from "@/lib/types";

const PAGE_WIDTH = 595; // A4 @ 72dpi
const PAGE_HEIGHT = 842;
const MARGIN = 50;
const RIGHT = PAGE_WIDTH - MARGIN;

/** Keeps every glyph inside WinAnsi and ASCII so offsets stay predictable. */
function sanitize(value: string): string {
  return value
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[–—]/g, "-")
    .replace(/…/g, "...")
    .replace(/·/g, "-")
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

/** Rough Helvetica advance width, good enough for right-aligned totals. */
function textWidth(text: string, size: number): number {
  return text.length * size * 0.5;
}

interface Line {
  text: string;
  size?: number;
  bold?: boolean;
  gray?: boolean;
  y: number;
  x?: number;
  align?: "left" | "right";
}

function escapePdfString(value: string): string {
  return sanitize(value);
}

/** Builds the page's content stream from an ordered list of lines. */
function buildContent(lines: Line[], rules: number[]): string {
  const ops: string[] = [];

  for (const y of rules) {
    // Thin separator rule.
    ops.push(`0.85 0.85 0.85 rg ${MARGIN} ${y} ${RIGHT - MARGIN} 1 re f`);
  }

  for (const line of lines) {
    const size = line.size ?? 10;
    const font = line.bold ? "/F2" : "/F1";
    const color = line.gray ? "0.45 0.45 0.45 rg" : "0.1 0.1 0.1 rg";
    const text = escapePdfString(line.text);
    const x =
      line.align === "right"
        ? (line.x ?? RIGHT) - textWidth(text, size)
        : (line.x ?? MARGIN);

    ops.push("BT", `${color}`, `${font} ${size} Tf`, `1 0 0 1 ${x} ${line.y} Tm`, `(${text}) Tj`, "ET");
  }

  return ops.join("\n");
}

/** Assembles a complete, valid PDF-1.4 file for one booking. */
export function buildBookingInvoicePdf(booking: Booking): string {
  const issued = new Date().toISOString().slice(0, 10);
  const invoiceNo = `SS-${booking._id.slice(-8).toUpperCase()}`;

  const lines: Line[] = [
    { text: "STUDIOSPACE", y: 780, size: 22, bold: true },
    { text: "Peer-to-peer creative workspace & production studio sharing", y: 762, size: 9, gray: true },
    { text: "BOOKING INVOICE", y: 726, size: 14, bold: true },
    { text: `Invoice no. ${invoiceNo}`, y: 708, size: 10, align: "right" },
    { text: `Issued ${issued}`, y: 694, size: 10, align: "right", gray: true },

    { text: "BILLED TO", y: 656, size: 9, bold: true, gray: true },
    { text: booking.clientName, y: 640, size: 11, bold: true },
    { text: booking.clientEmail, y: 626, size: 9, gray: true },

    { text: "HOSTED BY", y: 656, size: 9, bold: true, gray: true, x: 300 },
    { text: booking.hostEmail || "StudioSpace Host", y: 640, size: 11, bold: true, x: 300 },
    { text: `Status: ${booking.status}`, y: 626, size: 9, gray: true, x: 300 },

    { text: "STUDIO", y: 588, size: 9, bold: true, gray: true },
    { text: booking.studioTitle, y: 572, size: 13, bold: true },
    { text: `Session date: ${booking.date}`, y: 554, size: 10 },
    {
      text: `Hours: ${booking.startTime}:00 - ${booking.endTime}:00 (${booking.hours}h)`,
      y: 538,
      size: 10,
    },

    { text: "BREAKDOWN", y: 500, size: 9, bold: true, gray: true },
    {
      text: `${booking.hours} x $${booking.hourlyRate} hourly rate`,
      y: 482,
      size: 10,
    },
    { text: `$${booking.totalCost.toFixed(2)}`, y: 482, size: 10, align: "right" },
    { text: "Security deposit (refundable)", y: 464, size: 10 },
    { text: "Quoted separately by the host", y: 464, size: 10, align: "right", gray: true },

    { text: "TOTAL DUE", y: 430, size: 12, bold: true },
    { text: `$${booking.totalCost.toFixed(2)}`, y: 430, size: 14, bold: true, align: "right" },

    { text: "NOTES", y: 392, size: 9, bold: true, gray: true },
    { text: "This invoice confirms a reservation on StudioSpace. Present it to your host", y: 376, size: 9, gray: true },
    { text: "on the session date. The refundable deposit is settled directly with the host.", y: 362, size: 9, gray: true },
    { text: "Reservations marked Pending are not yet confirmed by the host.", y: 348, size: 9, gray: true },

    { text: "studiospace - book the room, keep the vision", y: MARGIN, size: 8, gray: true },
    { text: invoiceNo, y: MARGIN, size: 8, gray: true, align: "right" },
  ];

  const rules = [714, 610, 516, 448, 408, 62];
  const content = buildContent(lines, rules);

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT}] ` +
      "/Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\n`;
  pdf += `startxref\n${xrefOffset}\n%%EOF`;

  return pdf;
}

/** Triggers a browser download of the invoice for one booking. */
export function downloadBookingInvoice(booking: Booking): void {
  const pdf = buildBookingInvoicePdf(booking);
  const bytes = new Uint8Array(pdf.length);
  for (let index = 0; index < pdf.length; index += 1) {
    bytes[index] = pdf.charCodeAt(index) & 0xff;
  }

  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `studiospace-invoice-${booking._id.slice(-8)}.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
}
