import { TimestampWithPreparsedParts } from './types';

export function timestampToObject(timestampStr: string): TimestampWithPreparsedParts {
  const [hours, minutes, seconds] = timestampStr.split(":")
  return {
    string: timestampStr,
    numericParts: {
      hoursPart: parseInt(hours, 10),
      minutesPart: parseInt(minutes, 10),
      secondsPart: parseFloat(seconds),
    },
  }
}
