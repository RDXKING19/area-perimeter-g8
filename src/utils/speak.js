// Spoken narration pipeline converting mathematical notation into natural speech
// Strictly matches ElevenLabs pedagogical style for Grade 8 Singapore / lower secondary.

const ONES = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen'
];

const TENS = [
  '', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'
];

export function intToWords(n) {
  const num = Math.floor(Math.abs(n));
  if (num === 0) return 'zero';
  if (num < 20) return ONES[num];
  if (num < 100) {
    const rem = num % 10;
    return rem ? `${TENS[Math.floor(num / 10)]}-${ONES[rem]}` : TENS[Math.floor(num / 10)];
  }
  if (num < 1000) {
    const h = Math.floor(num / 100);
    const rem = num % 100;
    return rem ? `${ONES[h]} hundred and ${intToWords(rem)}` : `${ONES[h]} hundred`;
  }
  if (num < 1000000) {
    const k = Math.floor(num / 1000);
    const rem = num % 1000;
    const kWords = intToWords(k);
    if (!rem) return `${kWords} thousand`;
    if (rem < 100) return `${kWords} thousand and ${intToWords(rem)}`;
    return `${kWords} thousand, ${intToWords(rem)}`;
  }
  return String(n);
}

function digitsToWords(digitStr) {
  return digitStr
    .split('')
    .map((d) => (ONES[parseInt(d, 10)] !== undefined ? ONES[parseInt(d, 10)] : d))
    .join(' ');
}

export function numberToWords(val) {
  // Normalize narrow spaces / commas: "10 000" or "1,620" -> "10000" or "1620"
  const clean = String(val).replace(/[\s,]/g, '');
  if (clean.includes('.')) {
    const [intPart, decPart] = clean.split('.');
    const intWords = intToWords(parseInt(intPart || '0', 10));
    const decWords = digitsToWords(decPart);
    return `${intWords} point ${decWords}`;
  }
  return intToWords(parseInt(clean, 10));
}

export function speak(rawText) {
  if (!rawText) return '';
  let s = String(rawText);

  // 1. Replace specialized math variables & symbols
  s = s.replace(/r²/g, 'radius squared');
  s = s.replace(/π/g, 'pi');
  s = s.replace(/22\/7/g, 'twenty-two over seven');
  s = s.replace(/½/g, 'one half');
  s = s.replace(/¼/g, 'one quarter');
  s = s.replace(/¾/g, 'three quarters');

  // 2. Currency: $1 620 or $576
  s = s.replace(/\$\s*(\d+(?:[\s,]\d{3})*(?:\.\d+)?)/g, (_, num) => {
    return `${numberToWords(num)} dollars`;
  });

  // 3. Units with numbers (including decimals or grouped numbers)
  // Square centimetres: cm² or cm^2
  s = s.replace(/(\d+(?:[\s,]\d{3})*(?:\.\d+)?)\s*(?:cm²|cm\^2)/gi, (_, num) => {
    const cleanNum = num.replace(/[\s,]/g, '');
    const unitWord = cleanNum === '1' ? 'square centimetre' : 'square centimetres';
    return `${numberToWords(num)} ${unitWord}`;
  });

  // Square metres: m² or m^2
  s = s.replace(/(\d+(?:[\s,]\d{3})*(?:\.\d+)?)\s*(?:m²|m\^2)/gi, (_, num) => {
    const cleanNum = num.replace(/[\s,]/g, '');
    const unitWord = cleanNum === '1' ? 'square metre' : 'square metres';
    return `${numberToWords(num)} ${unitWord}`;
  });

  // Square millimetres: mm²
  s = s.replace(/(\d+(?:[\s,]\d{3})*(?:\.\d+)?)\s*(?:mm²|mm\^2)/gi, (_, num) => {
    const cleanNum = num.replace(/[\s,]/g, '');
    const unitWord = cleanNum === '1' ? 'square millimetre' : 'square millimetres';
    return `${numberToWords(num)} ${unitWord}`;
  });

  // Linear units: cm
  s = s.replace(/(\d+(?:[\s,]\d{3})*(?:\.\d+)?)\s*cm\b/gi, (_, num) => {
    const cleanNum = num.replace(/[\s,]/g, '');
    const unitWord = cleanNum === '1' ? 'centimetre' : 'centimetres';
    return `${numberToWords(num)} ${unitWord}`;
  });

  // Linear units: m
  s = s.replace(/(\d+(?:[\s,]\d{3})*(?:\.\d+)?)\s*m\b/gi, (_, num) => {
    const cleanNum = num.replace(/[\s,]/g, '');
    const unitWord = cleanNum === '1' ? 'metre' : 'metres';
    return `${numberToWords(num)} ${unitWord}`;
  });

  // Linear units: mm
  s = s.replace(/(\d+(?:[\s,]\d{3})*(?:\.\d+)?)\s*mm\b/gi, (_, num) => {
    const cleanNum = num.replace(/[\s,]/g, '');
    const unitWord = cleanNum === '1' ? 'millimetre' : 'millimetres';
    return `${numberToWords(num)} ${unitWord}`;
  });

  // Degrees: 90° -> ninety degrees
  s = s.replace(/(\d+(?:\.\d+)?)\s*°/g, (_, num) => {
    return `${numberToWords(num)} degrees`;
  });

  // 4. Mathematical operators
  s = s.replace(/×/g, 'times');
  s = s.replace(/÷/g, 'divided by');
  s = s.replace(/\+/g, 'plus');
  s = s.replace(/−/g, 'minus');
  s = s.replace(/=/g, 'equals');

  // 5. Algebraic equations: x = 5 -> x equals five
  s = s.replace(/\bx\s*=\s*(\d+)/gi, (_, num) => {
    return `x equals ${numberToWords(num)}`;
  });

  // 6. Remaining decimals: e.g. "3.14" -> "three point one four"
  s = s.replace(/\b(\d+)\.(\d+)\b/g, (_, intP, decP) => {
    return `${intToWords(parseInt(intP, 10))} point ${digitsToWords(decP)}`;
  });

  // 7. Grouped integers: e.g. "10 000" or "1 620"
  s = s.replace(/\b(\d{1,3}(?:[\s,]\d{3})+)\b/g, (match) => {
    return numberToWords(match);
  });

  // 8. Remaining standalone integers: e.g. "14", "9", "63"
  s = s.replace(/\b(\d+)\b/g, (match) => {
    return intToWords(parseInt(match, 10));
  });

  // Clean extra spaces
  return s.replace(/\s+/g, ' ').trim();
}
