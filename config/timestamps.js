import moment from 'moment-timezone';
import dotenv from 'dotenv';
dotenv.config()

export const dateNow = moment.tz(Date.now(), process.env.TZ);


