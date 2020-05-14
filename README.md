# thor-time

### Description
A JavaScript time helper toolkit.

### Installation

```bash
npm i thor-time
```

### How to use

1. Import it
```javascript
import time from 'thor-time;
```

2. time.now()
```javascript
console.log(time.now()); // get current time equal to new Date()
```

3. time.moment()
```javascript
console.log(time.moment(200000)); // get description string of a time duration: xxx days xxx hours xxx minutes xxx seconds
console.log(time.moment(200000), { maxUnit: 'h'}); // biggest unit is hour
console.log(time.moment(200000), { minUnit: 'm'}); // smallest unit is minute
// available unit are 'd', 'h', 'm', 's'
```

4. time.distance()
```javascript
console.log(time.distance('2019-1-1', '2020-2-10', 'd'));
// available unit are 'd', 'h', 'm', 's', 'ms'
```

5. time.add()
```javascript
console.log(time.add('2019-1-1', 30, 'd'));
// available unit are 'd', 'h', 'm', 's', 'ms'
```

6. time.dayOfYear()
```javascript
console.log(time.dayOfYear(new Date()));
```

7. time.daysOfMonth()
```javascript
console.log(time.daysOfMonth(new Date())); // get total days of month
```

8. time.parse()
```javascript
console.log(time.parse('2019-1-12'));
console.log(time.parse('2019-1-12 22:22:00'));
console.log(time.parse('2019-1-12T22:22:00+0800'));
console.log(time.parse('2019-1-12T22:22:00Z'));
console.log(time.parse('1/1/2020'));
console.log(time.parse('Jan 1, 2020'));
......
// if some format cannot be auto detect, you can specify format manually
console.log(time.parse('2019年5月31日 20:08:30', 'yyyy年M月d日 hh:mm:ss'));
```

9. time.format()
```javascript
console.log(time.format(time.now()); // use default format ISO8601 to convert to string
console.log(time.format(time.now(), 'yyyy年MM月dd日'); // use custom format to convert 
......
```

That's all