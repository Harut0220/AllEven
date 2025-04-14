function isCompanyOpen(startHour, closeHour, currentTime) {
    const parseTime = (time) => {
      const [hour, minute] = time.split(":").map(Number);
      return { hour, minute };
    };

    const toMinutes = ({ hour, minute }) => hour * 60 + minute;

    const start = parseTime(startHour);
    const close = parseTime(closeHour);
    const current = parseTime(currentTime);

    const startMinutes = toMinutes(start);
    const closeMinutes =
      toMinutes(close) + (close.hour < start.hour ? 24 * 60 : 0); // Handle next-day close
    const currentMinutes = toMinutes(current);

    return (
      currentMinutes >= startMinutes && currentMinutes < closeMinutes
    );
  }

  export default isCompanyOpen