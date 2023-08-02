type Meeting = { start: number; end: number };

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":");
  return +hours * 60 + parseInt(minutes);
}

function toTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
}

function earliestMeeting(schedules: string[][][], duration: number) {
  let merged: Meeting[] = [];
  for (let schedule of schedules) {
    for (let meeting of schedule) {
      merged.push({ start: toMinutes(meeting[0]), end: toMinutes(meeting[1]) });
    }
  }

  merged.sort((a, b) => a.start - b.start);

  let earliest = toMinutes("09:00");
  let latest = toMinutes("19:00");
  for (let meeting of merged) {
    if (meeting.start - earliest >= duration) {
      return toTime(earliest);
    }
    earliest = Math.max(earliest, meeting.end);
  }

  if (latest - earliest >= duration) {
    return toTime(earliest);
  }

  return null;
}

let schedules = [
  [
    ["09:00", "11:30"],
    ["13:30", "16:00"],
    ["16:00", "17:30"],
    ["17:45", "19:00"],
  ],
  [
    ["09:15", "12:00"],
    ["14:00", "16:30"],
    ["17:00", "17:30"],
  ],
  [
    ["11:30", "12:15"],
    ["15:00", "16:30"],
    ["17:45", "19:00"],
  ],
];

// default example
console.log(earliestMeeting(schedules, 60));
