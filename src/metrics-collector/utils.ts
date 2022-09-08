const sanitizeValue = (v: unknown) => {
  if (typeof v === 'boolean') {
    // converts true/false to 1/0
    return v ? 1 : 0;
  } else {
    return v;
  }
};

export const jsonToPrometheus = (
  metrics: Record<string, unknown>,
  prefix = '',
): string => {
  let output = '';
  for (const [key, value] of Object.entries(metrics)) {
    const normalizedKey = key.replace('-', '_');
    if (typeof value === 'object' && value !== null) {
      const newPrefix = prefix ? `${prefix}_${normalizedKey}` : normalizedKey;
      output += jsonToPrometheus(value as Record<string, unknown>, newPrefix);
    } else {
      const sanitizedValue = sanitizeValue(value);
      output += `${
        prefix ? `${prefix}_` : ''
      }${normalizedKey} ${sanitizedValue}\n`;
    }
  }
  return output;
};
