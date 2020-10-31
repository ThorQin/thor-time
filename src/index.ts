const shortWeeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const weeks = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const months = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

function hasProp(obj: unknown, propName: string): boolean {
	return Object.prototype.hasOwnProperty.call(obj, propName);
}

function paddingNumber(v: number, min: number, max?: number, alignLeft = false): string {
	let result = Math.abs(v) + '';
	while (result.length < min) {
		result = '0' + result;
	}
	if (typeof max === 'number' && result.length > max) {
		if (alignLeft) result = result.substr(0, max);
		else result = result.substr(result.length - max, max);
	}
	if (v < 0) result = '-' + result;
	return result;
}

const UNITS: { [index: string]: number } = {
	s: 0,
	m: 1,
	h: 2,
	d: 3,
};

const DESC = ['day', 'hour', 'minute', 'second'];

type MomentOptions = {
	minUnit?: MomentUnit;
	maxUnit?: MomentUnit;
};

function now(): Date {
	return new Date();
}

/**
 * Input duration in seconds and get a description
 * @param seconds Total time in seconds
 * @param options Convert options
 */
function moment(seconds: number, { maxUnit = 'd', minUnit = 's' }: MomentOptions = {}): string {
	const val = [];
	let beg = '',
		end = '';
	if (UNITS[maxUnit] > 2) {
		const d = Math.floor(seconds / 86400);
		val.push(d);
		seconds = seconds % 86400;
	} else {
		val.push(0);
	}
	if (UNITS[maxUnit] > 1 && UNITS[minUnit] < 3) {
		const h = Math.floor(seconds / 3600);
		val.push(h);
		seconds = seconds % 3600;
	} else {
		val.push(0);
	}
	if (UNITS[maxUnit] > 0 && UNITS[minUnit] < 2) {
		const m = Math.floor(seconds / 60);
		val.push(m);
		seconds = seconds % 60;
	} else {
		val.push(0);
	}
	if (UNITS[minUnit] < 1) {
		val.push(seconds);
	} else {
		val.push(0);
	}
	let i = 0,
		j = 3;
	while (i < 4) {
		if (val[i] > 0) {
			beg.length && (beg += ' ');
			beg += val[i] + ' ' + (val[i] > 1 ? DESC[i] + 's' : DESC[i]);
			break;
		}
		i++;
	}
	while (i < j) {
		if (val[j] > 0) {
			end.length && (end += ' ');
			end += val[j] + ' ' + (val[j] > 1 ? DESC[j] + 's' : DESC[j]);
			break;
		}
		j--;
	}
	i++;
	while (i < j) {
		beg.length && (beg += ' ');
		beg += val[i] + ' ' + (val[i] > 1 ? DESC[i] + 's' : DESC[i]);
		i++;
	}
	return beg + (beg.length ? ' ' : '') + end;
}

type DateTime = string | number | Date;
type TimeUnit = 'y' | 'M' | 'd' | 'h' | 'm' | 's' | 'ms';
type MomentUnit = 'd' | 'h' | 'm' | 's';
type DistanceUnit = 'd' | 'h' | 'm' | 's' | 'ms';

function parseDateInternal(dtStr: string, format: string): Date | null {
	if (!dtStr || !format) return null;
	const mapping: { [index: string]: number } = {};
	let gcount = 0;
	let isUTC = false;

	const values: { [index: string]: number | string } = {};
	function matchEnum(v: string, key: string | null, enumArray: string[]): boolean {
		const m = dtStr.match(new RegExp('^' + enumArray.join('|'), 'i'));
		if (m === null) return false;
		v = m[0].toLowerCase();
		v = v.substr(0, 1).toUpperCase() + v.substr(1);
		key && (values[key] = enumArray.indexOf(v));
		dtStr = dtStr.substr(v.length);
		return true;
	}
	function matchNumber(v: string, key: string | null, min?: number, max?: number): boolean {
		const len = v.length;
		if (len == 0) return false;
		const m = dtStr.match('^[0-9]{1,' + len + '}');
		if (m === null) return false;
		v = m[0];
		const num = parseInt(v);
		if ((typeof min === 'number' && num < min) || (typeof max === 'number' && num > max)) return false;
		key && (values[key] = num);
		dtStr = dtStr.substr(v.length);
		return true;
	}
	const rule: { [index: string]: Function } = {
		'y+': function (v: string) {
			if (!matchNumber(v, 'year')) return false;
			if (values['year'] < 100) values['year'] = (values['year'] as number) + 1900;
			return true;
		},
		'M+': function (v: string) {
			const len = v.length;
			if (len < 3) {
				if (!matchNumber(v, 'month', 1, 12)) return false;
				values['month'] = (values['month'] as number) - 1;
				return true;
			} else if (len === 3) {
				return matchEnum(v, 'month', shortMonths);
			} else {
				return matchEnum(v, 'month', months);
			}
		},
		'd+': function (v: string) {
			return matchNumber(v, 'date', 1, 31);
		},
		'D+': matchNumber,
		'h+': function (v: string) {
			return matchNumber(v, '12hour', 1, 12);
		},
		'H+': function (v: string) {
			return matchNumber(v, 'hour', 0, 24);
		},
		'm+': function (v: string) {
			return matchNumber(v, 'minute', 0, 59);
		},
		's+': function (v: string) {
			return matchNumber(v, 'second', 0, 59);
		},
		'[qQ]+': function (v: string) {
			return matchNumber(v, null, 1, 4);
		}, //quarter
		'S+': function (v: string) {
			return matchNumber(v, 'millisecond', 0, 999);
		},
		'E+': function (v: string) {
			const len = v.length;
			if (len < 3) {
				if (!matchNumber(v, null, 0, 6)) return false;
				return true;
			} else if (len === 3) {
				return matchEnum(v, null, shortWeeks);
			} else {
				return matchEnum(v, null, weeks);
			}
		},
		'a|A': function (v: string) {
			// let len = v.length;
			const m = dtStr.match(/^(am|pm)/i);
			if (m === null) return false;
			v = m[0];
			values['ampm'] = v.toLowerCase();
			dtStr = dtStr.substr(v.length);
			return true;
		},
		'z+': function (v: string) {
			const len = v.length;
			let m;
			if (len <= 2) m = dtStr.match(/^([-+][0-9]{2})/i);
			else if (len === 3) m = dtStr.match(/^([-+][0-9]{2})([0-9]{2})/i);
			else m = dtStr.match(/^([-+][0-9]{2}):([0-9]{2})/i);
			if (m === null) return false;
			v = m[0];
			let tz = parseInt(m[1]);
			if (Math.abs(tz) < -11 || Math.abs(tz) > 11) return false;
			tz *= 60;
			if (typeof m[2] !== 'undefined') {
				if (tz > 0) tz += parseInt(m[2]);
				else tz -= parseInt(m[2]);
			}
			values['tz'] = -tz;
			dtStr = dtStr.substr(v.length);
			return true;
		},
		Z: function (/* v */) {
			if (dtStr.substr(0, 1) !== 'Z') return false;
			isUTC = true;
			dtStr = dtStr.substr(1);
			return true;
		},
		'"[^"]*"|\'[^\']*\'': function (v: string) {
			v = v.substr(1, v.length - 2);
			if (dtStr.substr(0, v.length).toLowerCase() !== v.toLowerCase()) return false;
			dtStr = dtStr.substr(v.length);
			return true;
		},
		'[^yMmdDhHsSqEaAzZ\'"]+': function (v: string) {
			v = v.replace(/(.)/g, '\\$1');
			const m = dtStr.match(new RegExp('^' + v));
			if (m === null) return false;
			v = m[0];
			dtStr = dtStr.substr(v.length);
			return true;
		},
	};
	let regex = '';
	for (const k in rule) {
		if (!hasProp(rule, k)) continue;
		if (regex.length > 0) regex += '|';
		regex += '(^' + k + ')';
		mapping[k] = ++gcount;
	}

	let result;
	while ((result = format.match(regex)) !== null) {
		for (const k in mapping) {
			const v = result[mapping[k]];
			if (typeof v == 'string' && v) {
				if (rule[k](v) === false) return null;
				break;
			}
		}
		format = format.substr(result[0].length);
	}
	if (format.length > 0 || dtStr.length > 0) return null;
	let parseCount = 0;
	for (const k in values) {
		if (!hasProp(values, k)) continue;
		parseCount++;
	}
	if (parseCount <= 0) return null;
	const now = new Date();
	const year = hasProp(values, 'year') ? (values['year'] as number) : isUTC ? now.getUTCFullYear() : now.getFullYear();
	const month = hasProp(values, 'month') ? (values['month'] as number) : isUTC ? now.getUTCMonth() : now.getMonth();
	const date = hasProp(values, 'date') ? (values['date'] as number) : isUTC ? now.getUTCDate() : now.getDate();
	const ampm = hasProp(values, 'ampm') ? (values['ampm'] as string) : 'am';
	let hour;
	if (hasProp(values, 'hour')) hour = values['hour'] as number;
	else if (hasProp(values, '12hour')) {
		const h12 = values['12hour'] as number;
		if (ampm === 'am') {
			if (h12 >= 1 && h12 <= 11) {
				hour = h12;
			} else if (h12 === 12) {
				hour = h12 - 12;
			} else return null;
		} else {
			if (h12 === 12) hour = h12;
			else if (h12 >= 1 && h12 <= 11) hour = h12 + 12;
			else return null;
		}
	} else hour = 0;
	const minute = hasProp(values, 'minute') ? (values['minute'] as number) : 0;
	const second = hasProp(values, 'second') ? (values['second'] as number) : 0;
	const millisecond = hasProp(values, 'millisecond') ? (values['millisecond'] as number) : 0;
	const tz = hasProp(values, 'tz') ? (values['tz'] as number) : now.getTimezoneOffset();
	now.setUTCFullYear(year);
	now.setUTCDate(1); // Fix IE bug
	now.setUTCMonth(month);
	now.setUTCDate(date);
	now.setUTCHours(hour);
	now.setUTCMinutes(minute);
	now.setUTCSeconds(second);
	now.setUTCMilliseconds(millisecond);
	if (!isUTC) {
		now.setTime(now.getTime() + tz * 60 * 1000);
	}
	return now;
}

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
function parseDate(dtStr: DateTime, format: string | null = null): Date | null {
	if (dtStr instanceof Date) {
		return dtStr;
	} else if (typeof dtStr === 'number') {
		return new Date(dtStr);
	} else if (typeof format === 'string') return parseDateInternal(dtStr, format);
	else if (typeof format === 'undefined' || format === null) {
		for (const f of [
			'yyyy-MM-dd HH:mm:ss.SSS',
			'yyyy-MM-ddTHH:mm:sszzz',
			'yyyy-MM-dd',
			'yyyy-MM-dd HH:mm:ss',
			'MMM dd, yyyy HH:mm:ss',
			'MMM dd, yyyy',
			'dd MMM yyyy HH:mm:ss',
			'dd MMM yyyy',
			'HH:mm:ss',
		]) {
			const dt = parseDateInternal(dtStr, f);
			if (dt !== null) return dt;
		}
		const dt = new Date(dtStr);
		if (!isNaN(dt.getTime())) return dt;
	}
	return null;
}

/**
 * Get the distance of dt2 compare to dt1 (dt2 - dt1) return in specified unit (d: day, h: hours, m: minutes, s: seconds, ms: milliseconds)
 */
function distance(dt1: DateTime, dt2: DateTime, unit: DistanceUnit = 'd'): number {
	const d1 = parseDate(dt1);
	const d2 = parseDate(dt2);
	if (d1 === null || d2 === null) {
		return NaN;
	}
	let diff = d2.getTime() - d1.getTime();
	const symbol = diff < 0 ? -1 : 1;
	diff = Math.abs(diff);
	if (unit === 'd') {
		return Math.floor(diff / 86400000) * symbol;
	} else if (unit === 'h') {
		return Math.floor(diff / 3600000) * symbol;
	} else if (unit === 'm') {
		return Math.floor(diff / 60000) * symbol;
	} else if (unit === 's') {
		return Math.floor(diff / 1000) * symbol;
	} else if (unit === 'ms') {
		return diff * symbol;
	} else return NaN;
}

/**
 * Get total days of month
 * @param dt The day of the target
 */
function daysOfMonth(dt: Date): number {
	let y = dt.getFullYear();
	let m = dt.getMonth();
	const d1 = new Date(y, m, 1);
	if (m === 11) {
		y++;
		m = 0;
	} else {
		m++;
	}
	const d2 = new Date(y, m, 1);
	return distance(d1, d2, 'd');
}

/**
 * Get new date of dt add specified unit of values.
 * @param dt The day of the target
 * @param val Increased value
 * @param unit "y", "M", "d", "h", "m", "s" or "ms"
 */
function add(dt: DateTime, val: number, unit: TimeUnit = 'd'): Date | null {
	if (!(dt instanceof Date)) {
		const d = parseDate(dt);
		if (d) {
			dt = d;
		} else {
			return null;
		}
	}
	const tm = dt.getTime();
	if (isNaN(tm)) {
		return dt;
	}
	if (unit === 'y') {
		let y = dt.getFullYear(),
			m = dt.getMonth(),
			d = dt.getDate();
		const h = dt.getHours(),
			mi = dt.getMinutes(),
			s = dt.getSeconds(),
			ms = dt.getMilliseconds();
		const totalMonth = y * 12 + m + val * 12;
		y = Math.floor(totalMonth / 12);
		m = totalMonth % 12;
		const newDate = new Date(y, m, 1);
		if (d > daysOfMonth(newDate)) d = daysOfMonth(newDate);
		return new Date(y, m, d, h, mi, s, ms);
	} else if (unit === 'M') {
		let y = dt.getFullYear(),
			m = dt.getMonth(),
			d = dt.getDate();
		const h = dt.getHours(),
			mi = dt.getMinutes(),
			s = dt.getSeconds(),
			ms = dt.getMilliseconds();
		const totalMonth = y * 12 + m + val;
		y = Math.floor(totalMonth / 12);
		m = totalMonth % 12;
		const newDate = new Date(y, m, 1);
		if (d > daysOfMonth(newDate)) d = daysOfMonth(newDate);
		return new Date(y, m, d, h, mi, s, ms);
	} else if (unit === 'd') {
		return new Date(tm + val * 86400000);
	} else if (unit === 'h') {
		return new Date(tm + val * 3600000);
	} else if (unit === 'm') {
		return new Date(tm + val * 60000);
	} else if (unit === 's') {
		return new Date(tm + val * 1000);
	} else if (unit === 'ms') {
		return new Date(tm + val);
	} else return null;
}

/**
 * Get day in year
 * @param dt The day of the target
 */
function dayOfYear(dt: Date): number {
	const y = dt.getFullYear();
	const d1 = new Date(y, 0, 1);
	return distance(d1, dt, 'd');
}

/**
 * Convert date to string and output can be formated to ISO8601, RFC2822, RFC3339 or other customized format
 * @param dt  Date object to be convert
 * @param dateFmt which format should be apply, default use ISO8601 standard format
 */
function formatDate(dt: DateTime, dateFmt = 'yyyy-MM-ddTHH:mm:sszzz'): string | null {
	const d = parseDate(dt);
	if (d instanceof Date && !isNaN(d.getTime())) {
		dt = d as Date;
	} else {
		return null;
	}
	const isUTC = dateFmt.indexOf('Z') >= 0 ? true : false;
	const fullYear = isUTC ? dt.getUTCFullYear() : dt.getFullYear();
	const month = isUTC ? dt.getUTCMonth() : dt.getMonth();
	const date = isUTC ? dt.getUTCDate() : dt.getDate();
	const hours = isUTC ? dt.getUTCHours() : dt.getHours();
	const minutes = isUTC ? dt.getUTCMinutes() : dt.getMinutes();
	const seconds = isUTC ? dt.getUTCSeconds() : dt.getSeconds();
	const milliseconds = isUTC ? dt.getUTCMilliseconds() : dt.getMilliseconds();
	const day = isUTC ? dt.getUTCDay() : dt.getDay();

	const rule: { [index: string]: number | string } = {
		'y+': fullYear,
		'M+': month + 1,
		'd+': date,
		'D+': dayOfYear(dt) + 1,
		'h+': (function (h): number {
			if (h >= 1 && h <= 12) return h;
			else if (h >= 13 && h <= 23) return h - 12;
			// h === 0
			else return h + 12;
		})(hours),
		'H+': hours,
		'm+': minutes,
		's+': seconds,
		'q+': Math.floor((month + 3) / 3), //quarter
		'S+': milliseconds,
		'E+': day,
		a: (function (h): string {
			if (h >= 0 && h <= 11) return 'am';
			else return 'pm';
		})(isUTC ? dt.getUTCHours() : dt.getHours()),
		A: (function (h): string {
			if (h >= 0 && h <= 11) return 'AM';
			else return 'PM';
		})(hours),
		'z+': dt.getTimezoneOffset(),
	};
	let regex = '';
	for (const k in rule) {
		if (!hasProp(rule, k)) continue;
		if (regex.length > 0) regex += '|';
		regex += k;
	}
	const regexp = new RegExp(regex, 'g');
	return dateFmt.replace(regexp, function (str: string /*, pos, source*/): string {
		for (const k in rule) {
			if (str.match(k) !== null) {
				if (k === 'y+') {
					return paddingNumber(rule[k] as number, str.length, str.length);
				} else if (k === 'a' || k === 'A') {
					return rule[k] as string;
				} else if (k === 'z+') {
					let z = '';
					if (rule[k] >= 0) {
						z += '-';
					} else {
						z += '+';
					}
					if (str.length < 2) z += Math.abs(Math.floor((rule[k] as number) / 60));
					else z += paddingNumber(Math.abs(Math.floor((rule[k] as number) / 60)), 2);
					if (str.length === 3) z += paddingNumber(Math.abs(Math.floor((rule[k] as number) % 60)), 2);
					else if (str.length > 3) z += ':' + paddingNumber(Math.abs(Math.floor((rule[k] as number) % 60)), 2);
					return z;
				} else if (k === 'E+') {
					if (str.length < 3) return paddingNumber(rule[k] as number, str.length);
					else if (str.length === 3) return shortWeeks[rule[k] as number];
					else return weeks[rule[k] as number];
				} else if (k === 'M+') {
					if (str.length < 3) return paddingNumber(rule[k] as number, str.length);
					else if (str.length === 3) return shortMonths[(rule[k] as number) - 1];
					else return months[(rule[k] as number) - 1];
				} else if (k === 'S+') {
					return paddingNumber(rule[k] as number, str.length, str.length, true);
				} else {
					return paddingNumber(rule[k] as number, str.length);
				}
			}
		}
		return str;
	});
}

export default {
	now,
	moment,
	distance,
	add,
	dayOfYear,
	daysOfMonth,
	parse: parseDate,
	format: formatDate,
};
