import format from 'date-fns/format';
import pt from 'date-fns/locale/pt';
import utcToZonedTime from 'date-fns-tz/utcToZonedTime';

const timeZone = process.env.SERVER_TIMEZONE;

const formatDate = (date: string | Date, type = 'dd/MM/yyyy - HH:mm'): string => {
  if (!date) return '';
  const zoneDate = utcToZonedTime(date, timeZone);

  return format(zoneDate, type, {
    locale: pt,
  });
};

export default formatDate;
