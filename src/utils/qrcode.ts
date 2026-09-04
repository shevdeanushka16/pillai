import QRCode from 'qrcode';

/**
 * Generates an SVG string representation of a QR code
 */
export async function generateQrSvg(text: string): Promise<string> {
  try {
    const svg = await QRCode.toString(text, {
      type: 'svg',
      margin: 1,
      color: {
        dark: '#171717',
        light: '#FFFFFF',
      },
    });
    return svg;
  } catch (err) {
    console.error('Failed to generate QR SVG:', err);
    return '';
  }
}

/**
 * Generates a base64 Data URL for embedding in an <img src="..." />
 */
export async function generateQrDataUrl(text: string): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text, {
      margin: 1,
      width: 280,
      color: {
        dark: '#171717',
        light: '#FFFFFF',
      },
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR DataURL:', err);
    return '';
  }
}
