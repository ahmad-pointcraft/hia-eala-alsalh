export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  let i = 0;

  while (i < text.length) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        } else {
          inQuotes = false;
          i++;
          continue;
        }
      } else {
        field += char;
        i++;
        continue;
      }
    }

    if (char === '"') {
      inQuotes = true;
      i++;
      continue;
    }

    if (char === ',') {
      row.push(field.trim());
      field = '';
      i++;
      continue;
    }

    if (char === '\r') {
      if (i + 1 < text.length && text[i + 1] === '\n') {
        i++;
      }
      row.push(field.trim());
      field = '';
      if (row.length > 0 && row.some((c) => c.length > 0)) {
        rows.push(row);
      }
      row = [];
      i++;
      continue;
    }

    if (char === '\n') {
      row.push(field.trim());
      field = '';
      if (row.length > 0 && row.some((c) => c.length > 0)) {
        rows.push(row);
      }
      row = [];
      i++;
      continue;
    }

    field += char;
    i++;
  }

  row.push(field.trim());
  if (row.length > 0 && row.some((c) => c.length > 0)) {
    rows.push(row);
  }

  return rows;
}
