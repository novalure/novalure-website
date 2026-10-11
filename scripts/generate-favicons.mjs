import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const publicDir = path.join(root, "public");
const variantDir = path.join(publicDir, "favicons");
const previewDir = path.join(root, "docs");

// Every division uses the same mark. Only the accent color changes.
const accents = {
  blue: "#5B83FF",
  teal: "#30BFA6",
  coral: "#E97876",
  violet: "#AD8BF2",
  gold: "#D6A44E"
};

function icon(accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" role="img" aria-label="NovaLure">
  <rect x="1.5" y="1.5" width="61" height="61" rx="15" fill="#101A33" stroke="${accent}" stroke-width="3"/>
  <path d="M12.5 48V18.5h9.3v4.3c2.8-3.3 6.5-5 11.1-5 9.1 0 13.8 6 13.8 15.5V48h-9.5V34.4c0-5.4-2.1-8-6.4-8-5 0-8.8 3.9-8.8 10V48h-9.5Z" fill="#FFFFFF"/>
  <circle cx="52.5" cy="43" r="5.5" fill="${accent}"/>
</svg>`;
}

function ico(images) {
  const count = images.length;
  const header = Buffer.alloc(6 + count * 16);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);
  let offset = header.length;
  images.forEach(({ size, data }, index) => {
    const entry = 6 + index * 16;
    header.writeUInt8(size === 256 ? 0 : size, entry);
    header.writeUInt8(size === 256 ? 0 : size, entry + 1);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });
  return Buffer.concat([header, ...images.map(({ data }) => data)]);
}

await mkdir(variantDir, { recursive: true });
await mkdir(previewDir, { recursive: true });

for (const [name, accent] of Object.entries(accents)) {
  await writeFile(path.join(variantDir, `${name}.svg`), icon(accent));
}

const primary = Buffer.from(icon(accents.blue));
await writeFile(path.join(publicDir, "favicon.svg"), primary);
const raster = async (size) => sharp(primary).resize(size, size).png().toBuffer();
const [png16, png32, png48, apple] = await Promise.all([16, 32, 48, 180].map(raster));
await writeFile(path.join(publicDir, "favicon-16x16.png"), png16);
await writeFile(path.join(publicDir, "favicon-32x32.png"), png32);
await writeFile(path.join(publicDir, "apple-touch-icon.png"), apple);
await writeFile(path.join(publicDir, "favicon.ico"), ico([
  { size: 16, data: png16 },
  { size: 32, data: png32 },
  { size: 48, data: png48 }
]));

const labels = Object.keys(accents);
const previewWidth = 920;
const previewHeight = 232;
const backdrop = `<svg xmlns="http://www.w3.org/2000/svg" width="${previewWidth}" height="${previewHeight}" viewBox="0 0 ${previewWidth} ${previewHeight}">
  <rect width="100%" height="100%" rx="22" fill="#F4F6FA"/>
  <text x="30" y="34" font-family="Arial, sans-serif" font-size="18" font-weight="700" fill="#101A33">NovaLure favicon system</text>
  ${labels.map((label, i) => `<text x="${42 + i * 180}" y="202" font-family="Arial, sans-serif" font-size="16" fill="#34425D">${label}</text>`).join("")}
</svg>`;
const overlays = await Promise.all(labels.map(async (label, index) => ({
  input: await sharp(Buffer.from(icon(accents[label]))).resize(104, 104).png().toBuffer(),
  top: 66,
  left: 30 + index * 180
})));
await sharp(Buffer.from(backdrop)).composite(overlays).png().toFile(path.join(previewDir, "favicon-variants.png"));
