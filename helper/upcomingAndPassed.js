import moment from "moment-timezone";
export const separateUpcomingAndPassedMeetings = (events) => {
  const upcoming = [];
  const passed = [];

  events.forEach((event) => {
    if (event.date > moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm")) {
      upcoming.push(event);
    } else {
      passed.push(event);
    }
  });

  return { upcoming, passed };
};

export const separateUpcomingAndPassedEvents = (events) => {
  const upcoming = [];
  const passed = [];

  events.forEach((event) => {
    if (event.date > moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm")) {
      upcoming.push(event);
    } else {
      passed.push(event);
    }
  });

  return { upcoming, passed };
};

export const separateUpcomingAndPassedCompany = (events) => {
  const upcoming = [];
  const passed = [];

  events.forEach((event) => {
    const dateNow = moment.tz(process.env.TZ).format("YYYY-MM-DD HH:mm");

    if (event.date > dateNow) {
      upcoming.push(event);
    } else {
      passed.push(event);
    }
  });

  return { upcoming, passed };
};
