import { zonedTimeToUtc } from 'date-fns-tz';

const timeZone = process.env.SERVER_TIMEZONE;

const timestamp = (): Date => {
  return zonedTimeToUtc(new Date().toISOString(), timeZone);
};

export default timestamp;
