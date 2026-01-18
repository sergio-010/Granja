export type DatePeriod =
  | "today"
  | "week"
  | "biweekly"
  | "month"
  | "semester"
  | "year";

export interface DateRange {
  from: Date;
  to: Date;
}

export function getDateRange(
  period: DatePeriod,
  weekStartsOnMonday = true,
): DateRange {
  const now = new Date();
  const to = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999,
  );
  let from: Date;

  switch (period) {
    case "today":
      from = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0,
      );
      break;

    case "week": {
      const currentDay = now.getDay();
      const diff = weekStartsOnMonday
        ? currentDay === 0
          ? 6
          : currentDay - 1 // Lunes = 0
        : currentDay; // Domingo = 0
      from = new Date(now);
      from.setDate(now.getDate() - diff);
      from.setHours(0, 0, 0, 0);
      break;
    }

    case "biweekly": {
      const dayOfMonth = now.getDate();
      if (dayOfMonth <= 15) {
        from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      } else {
        from = new Date(now.getFullYear(), now.getMonth(), 16, 0, 0, 0, 0);
      }
      break;
    }

    case "month":
      from = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      break;

    case "semester": {
      const currentMonth = now.getMonth();
      const semesterStart = currentMonth < 6 ? 0 : 6;
      from = new Date(now.getFullYear(), semesterStart, 1, 0, 0, 0, 0);
      break;
    }

    case "year":
      from = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
      break;

    default:
      from = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        0,
        0,
        0,
        0,
      );
  }

  return { from, to };
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}
