namespace time {

	/**
	 * Get current datetime, equal to new Date()
	 */
	function now(): Date;

	type MomentUnit = 'd' | 'h' | 'm' | 's';

	type MomentOptions = {
		minUnit?: MomentUnit,
		maxUnit?: MomentUnit
	};

	type DateTime = string | number | Date;



	/**
	 * Input duration in seconds and get a description
	 * @param {number} seconds Total time in seconds
	 * @param {MomentOptions} options Convert options
	 */
	function moment(seconds: number, options?: MomentOptions): string;


	type DistanceUnit = 'd' | 'h' | 'm' | 's' | 'ms';

	/**
	 * Get the distance of dt2 compare to dt1 (dt2 - dt1) return in specified unit (d: day, h: hours, m: minutes, s: seconds, ms: milliseconds)
	 * @param {DateTime} dt1
	 * @param {DateTime} dt2
	 * @param {DistanceUnit} unit Default unit is 'd'
	 */
	function distance(dt1: DateTime, dt2: DateTime, unit?: DistanceUnit): number;


	type TimeAddUnit = 'y' | 'M' | 'd' | 'h' | 'm' | 's' | 'ms';
	/**
	 * Get new date of dt add specified unit of values.
	 * @param {DateTime} dt The day of the target
	 * @param {number} val Increased value
	 * @param unit "y", "M", "d", "h", "m", "s" or "ms", Default is 'd'
	 */
	function add(dt: DateTime, val: number, unit?: TimeAddUnit): DateTime;


	/**
	 * Get day in year
	 * @param {Date} dt The day of the target
	 */
	function dayOfYear(dt: Date): number;

	/**
	 * Get total days of month
	 * @param {Date} dt The day of the target
	 */
	function daysOfMonth(dt: Date): number;

	/**
	 * Parse string get date instance (
	 * try to parse format:
	 *		yyyy-MM-dd HH:mm:ss，
	 *		yyyy-MM-dd,
	 *		dd MMM yyyy,
	 *		MMM dd, yyyy,
	 *		ISO8601 format)
	 * @param {DateTime} dtStr Date string
	 * @param {string} format Date time format string. Function will try to auto detect date string format by itself if you not specify this parameter.
	 */
	function parse(dtStr: DateTime, format?: string): Date;

	/**
	 * Convert date to string and output can be formated to ISO8601, RFC2822, RFC3339 or other customized format
	 * @param {DateTime} dt  Date object to be convert
	 * @param {string} dateFmt which format should be apply, default use ISO8601 standard format('yyyy-MM-ddTHH:mm:sszzz')
	 */
	function format(dt: DateTime, dateFmt?: string): string;
}

export default time;
