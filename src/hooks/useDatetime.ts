import { useCallback } from "react";
import { DateTime, Duration } from "luxon";
import { zones } from "tzdata";

export const useDatetime = () => {
  const getDefaultTimezone = useCallback(() => {
    return DateTime.local().zoneName;
  }, []);
  const getDefaultStartDate = useCallback(() => {
    return DateTime.now().plus({ days: 3 }).toFormat("yyyy-MM-dd");
  }, []);
  const getDefaultStartTime = useCallback(() => {
    return "08:00";
  }, []);
  const getDefaultEndDate = useCallback(() => {
    return DateTime.now().plus({ days: 6 }).toFormat("yyyy-MM-dd");
  }, []);
  const getDefaultEndTime = useCallback(() => {
    return "22:00";
  }, []);
  const parseDateInput = useCallback(
    (date: string, time: string, timezone: string) => {
      return DateTime.fromFormat(`${date} ${time}`, "yyyy-MM-dd HH:mm", {
        zone: timezone,
      })
        .toUTC()
        .toJSDate();
    },
    []
  );
  const getTimezones = useCallback(() => {
    return Object.entries(zones)
      .map(([zoneName, v]) => zoneName)
      .filter((tz) => DateTime.local().setZone(tz).isValid)
      .sort();
  }, []);
  const getTimezoneOffsets = useCallback(() => {
    return getTimezones().map((zone) => {
      const offsetMinutes = DateTime.local({ zone }).offset;

      if (0 <= offsetMinutes) {
        const offset = Duration.fromObject({ minute: offsetMinutes }).toFormat(
          "h:mm"
        );
        return {
          name: zone,
          offset: `+${offset}`,
        };
      } else {
        const offset = Duration.fromObject({ minute: -offsetMinutes }).toFormat(
          "h:mm"
        );
        return {
          name: zone,
          offset: `-${offset}`,
        };
      }
    });
  }, [getTimezones]);

  return {
    getDefaultTimezone,
    getDefaultStartDate,
    getDefaultStartTime,
    getDefaultEndDate,
    getDefaultEndTime,
    parseDateInput,
    getTimezones,
    getTimezoneOffsets,
  };
};
