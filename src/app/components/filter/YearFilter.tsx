import { debounce } from "@/app/util/util";
import { CinemaScreeningData } from "@/ext/csfd";
import { useContext, useRef } from "react";
import { FilmDataContext } from "../HomePageClient";

export function applyYearRangeFilter(
  screenings: CinemaScreeningData[],
  years: [number, number] | undefined
): CinemaScreeningData[] {
  if (!years) return screenings;
  return screenings.map((s) => ({
    ...s,
    screenings: s.screenings.map((s) => ({
      ...s,
      screenings: s.screenings.filter((s) => {
        if (!s.year) {
          return true;
        }
        return s.year >= years[0] && s.year <= years[1];
      }),
    })),
  }));
}

// todo: refactor with debounce (similar to search component)
export function YearRangeSelector({
  range,
  setDateFilterRange,
}: {
  range: [number, number];
  setDateFilterRange: (
    range: [a: number, b: number]
  ) => void;
}) {
  // that is bad practice, but I want to update filter range only when the valid range was given
  const inputOneRef = useRef<HTMLInputElement>(null);
  const inputTwoRef = useRef<HTMLInputElement>(null);
  const { minYear, maxYear } = useContext(FilmDataContext);

  const handleInputChange = debounce(
    (index: number, value: number) => {
      if (isNaN(value)) return;
      if (index === 0) {
        const toYear = parseInt(inputTwoRef.current!.value);
        setDateFilterRange([value, toYear]);
      } else {
        const fromYear = parseInt(
          inputOneRef.current!.value
        );
        setDateFilterRange([fromYear, value]);
      }
    },
    200
  );

  const handleSliderChange = (value: number) => {
    inputTwoRef.current!.value = value.toString();
    setDateFilterRange([minYear, value]);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="self-start">Years:</h2>

      {/* Number Inputs */}
      <div className="flex space-x-4 justify-between w-full items-center mb-3">
        <input
          ref={inputOneRef}
          type="number"
          defaultValue={minYear}
          min={minYear}
          max={maxYear}
          onChange={(e) =>
            handleInputChange(
              0,
              parseInt(e.currentTarget.value)
            )
          }
          className="w-20 md:p-2 p-1 border rounded text-center border-[#3c3f43]"
        />
        <span className="font-bold">to</span>
        <input
          ref={inputTwoRef}
          type="number"
          defaultValue={maxYear}
          min={minYear}
          max={maxYear}
          onChange={(e) =>
            handleInputChange(
              1,
              parseInt(e.currentTarget.value)
            )
          }
          className="w-20 md:p-2 p-1 border rounded text-center border-[#3c3f43]"
        />
      </div>

      {/* Custom Dual Slider */}
      <div className="relative min-w-full h-6 md:m-0 mt-2/">
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={range[1]}
          onChange={(e) =>
            handleSliderChange(parseInt(e.target.value))
          }
          className="absolute w-full h-2 cursor-pointer"
          title={range[1].toString()}
        />
      </div>
      <div className="flex flex-row justify-between w-full">
        <span>{minYear}</span>
        <span>{maxYear}</span>
      </div>
    </div>
  );
}
