import deburr from 'lodash.deburr';
import widthsMap from './widthsMap';

const settingsDefaults = { font: 'Arial', size: 100 };

// East Asian Wide and Fullwidth code point ranges, which occupy a full em
const fullWidthRanges = [
  [0x1100, 0x115F], [0x2E80, 0x303E], [0x3041, 0x33FF], [0x3400, 0x4DBF],
  [0x4E00, 0x9FFF], [0xA000, 0xA4CF], [0xAC00, 0xD7A3], [0xF900, 0xFAFF],
  [0xFE30, 0xFE6B], [0xFF01, 0xFF60], [0xFFE0, 0xFFE6]
];
const fullWidths = [100, 100, 100, 100];

const isFullWidth = (char) => {
  const code = char.charCodeAt(0);
  return fullWidthRanges.some((range) => code >= range[0] && code <= range[1]);
};

const getWidth = (string, settings) => {
  const sett = { ...settingsDefaults, ...settings };
  const font = sett.font.toLowerCase();
  const size = sett.size;
  const variant = 0 + (sett.bold ? 1 : 0) + (sett.italic ? 2 : 0);
  const available = Object.keys(widthsMap);
  if (available.indexOf(font) === -1) {
    throw new Error(`This font is not supported. Supported fonts are: ${available.join(', ')}`);
  }
  let totalWidth = 0;
  deburr(string).split('').forEach((char) => {
    if (/[\x00-\x1F]/.test(char)) { // non-printable character
      return true;
    }
    // full width chars are one em, otherwise use the width of 'x' as fallback for unregistered char
    const fallback = isFullWidth(char) ? fullWidths : widthsMap[font].x;
    const widths = widthsMap[font][char] || fallback;
    const width = widths[variant];
    totalWidth += width;
    return true;
  });
  return totalWidth * (size / 100);
};

export default getWidth;
