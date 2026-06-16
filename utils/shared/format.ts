export function formatCurrency(amount: number, currency = "USD"): string {
  const symbol = currencySymbol(currency);
  return `${symbol}${amount.toLocaleString(undefined, {
    minimumFractionDigits: amount < 100 ? 2 : 0,
    maximumFractionDigits: 2,
  })}`;
}

export function currencySymbol(code: string): string {
  switch (code) {
    case "USD":
      return "$";
    case "EUR":
      return "€";
    case "GBP":
      return "£";
    case "MAD":
      return "DH ";
    default:
      return `${code} `;
  }
}

export function formatLifeGained(totalMinutes: number): string {
  const m = Math.max(0, Math.round(totalMinutes));
  if (m < 60) return `${m} min`;

  const totalHours = Math.floor(m / 60);
  const mins = m % 60;

  if (totalHours < 24) {
    return mins ? `${totalHours}h ${mins}m` : `${totalHours}h`;
  }

  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (hours === 0 && mins === 0) {
    return `${days} ${days === 1 ? "day" : "days"}`;
  }
  if (mins === 0) {
    return hours ? `${days}d ${hours}h` : `${days} days`;
  }
  return `${days}d ${hours}h`;
}

export function formatDuration(hours: number): string {
  if (hours < 1) {
    const minutes = Math.max(1, Math.round(hours * 60));
    return `${minutes}m`;
  }
  if (hours < 24) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m ? `${h}h ${m}m` : `${h}h`;
  }
  const days = Math.floor(hours / 24);
  const remH = Math.floor(hours - days * 24);
  return remH ? `${days}d ${remH}h` : `${days}d`;
}

export function formatDisplayName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return trimmed;
  const lower = trimmed.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export function formatNumber(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}k`;
  return Math.round(value).toString();
}

export function pluralize(n: number, singular: string, plural?: string): string {
  return n === 1 ? singular : (plural ?? `${singular}s`);
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(timestamp: number): string {
  const d = new Date(timestamp);
  return `${d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  })}, ${d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}`;
}
