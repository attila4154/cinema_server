import { CinemaScreeningData } from "@/ext/csfd";
import addDays from "date-fns/addDays";
import moment from "moment";
import { DateRangePicker } from "rsuite";
import { RangeType } from "rsuite/esm/DateRangePicker";
const { beforeToday } = DateRangePicker;

export function applyDateSelect(
  screenings: CinemaScreeningData[],
  dateRange: [Date, Date]
): CinemaScreeningData[] {
  const [from, to] = dateRange;
  const fromMoment = moment(from);
  const toMoment = moment(to);

  return screenings.map((data) => ({
    ...data,
    screenings: data.screenings.filter((screenings) => {
      const momentScreeningDate = moment(
        screenings.date,
        "DD.MM.YYYY"
      );
      return (
        momentScreeningDate.isSameOrAfter(
          fromMoment,
          "day"
        ) &&
        momentScreeningDate.isSameOrBefore(toMoment, "day")
      );
    }),
  }));
}

const predefinedRanges = [
  {
    label: "Today",
    value: [new Date(), new Date()],
  },
  {
    label: "Tomorrow",
    value: [addDays(new Date(), 1), addDays(new Date(), 1)],
  },
  {
    label: "Next week",
    value: [new Date(), addDays(new Date(), 7)],
  },
  {
    label: "All time",
    value: [new Date(), addDays(new Date(), 365)],
  },
  {
    label: "Clear",
    value: null,
  },
] as RangeType[];

export function DateFilter({
  selectDateRange,
}: {
  dateRange: [Date, Date];
  selectDateRange: (range: [Date, Date]) => void;
}) {
  return (
    <DateRangePicker
      showOneCalendar
      ranges={predefinedRanges}
      shouldDisableDate={beforeToday()}
      placeholder={"Today"}
      format="dd.MM.yyyy"
      character=" - "
      size="lg"
      isoWeek={true}
      onOk={([from, to]) => selectDateRange([from, to])}
      onShortcutClick={(shortcut) =>
        selectDateRange(shortcut.value as [Date, Date])
      }
      onClean={() =>
        selectDateRange([new Date(), new Date()])
      }
      className="rs-theme-dark"
    />
  );
}
