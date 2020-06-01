declare type MomentOptions = {
	minUnit?: MomentUnit;
	maxUnit?: MomentUnit;
};
declare function now(): Date;
/**
 * Input duration in seconds and get a description
 * @param seconds Total time in seconds
 * @param options Convert options
 */
declare function moment(seconds: number, { maxUnit, minUnit }?: MomentOptions): string;
declare type DateTime = string | number | Date;
declare type TimeUnit = 'y' | 'M' | 'd' | 'h' | 'm' | 's' | 'ms';
declare type MomentUnit = 'd' | 'h' | 'm' | 's';
declare type DistanceUnit = 'd' | 'h' | 'm' | 's' | 'ms';
/**
 * Get the distance of dt2 compare to dt1 (dt2 - dt1) return in specified unit (d: day, h: hours, m: minutes, s: seconds, ms: milliseconds)
 */
declare function distance(dt1: DateTime, dt2: DateTime, unit?: DistanceUnit): number;
/**
 * Get new date of dt add specified unit of values.
 * @param dt The day of the target
 * @param val Increased value
 * @param unit "y", "M", "d", "h", "m", "s" or "ms"
 */
declare function add(dt: DateTime, val: number, unit?: TimeUnit): Date | null;
/**
 * Get day in year
 * @param dt The day of the target
 */
declare function dayOfYear(dt: Date): number;
/**
 * Get total days of month
 * @param dt The day of the target
 */
declare function daysOfMonth(dt: Date): number;
/**
 * Parse string get date instance (
 * try to parse format:
 *		yyyy-MM-dd HH:mm:ss，
 *		yyyy-MM-dd,
 *		dd MMM yyyy,
 *		MMM dd, yyyy,
 *		ISO8601 format)
 * @param dtStr Date string
 * @param format Date time format string
 */
declare function parseDate(dtStr: DateTime, format?: string | null): Date | null;
/**
 * Convert date to string and output can be formated to ISO8601, RFC2822, RFC3339 or other customized format
 * @param dt  Date object to be convert
 * @param dateFmt which format should be apply, default use ISO8601 standard format
 */
declare function formatDate(dt: DateTime, dateFmt?: string): string | null;
declare const _default: {
	now: typeof now;
	moment: typeof moment;
	distance: typeof distance;
	add: typeof add;
	dayOfYear: typeof dayOfYear;
	daysOfMonth: typeof daysOfMonth;
	parse: typeof parseDate;
	format: typeof formatDate;
};
export default _default;
