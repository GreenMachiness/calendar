function getMonthName(monthNumber) {
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  if (monthNumber >= 0 && monthNumber <= 11) {
    return monthNames[monthNumber]
  } else {
    return 'Invalid month number. Please provide a number between 0 and 11.'
  }
}

function getDayOfWeek(dayNumber) {
  const dayNames = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

  if (dayNumber >= 0 && dayNumber <= 6) {
    return dayNames[dayNumber]
  } else {
    return "Invalid day number. Please provide a number between 0 and 6."
  }
}

const addNumSuffix = (num) => {
  const lastNum = num.toString().slice(-1)
  const lastTwoNums = num.toString().slice(-2);

  // console.log(lastNum)
  if (lastTwoNums === '11' || lastTwoNums === '12' || lastTwoNums === '13') {
    return `${num}th`;
  } else if (lastNum === '1') {
    return `${num}st`;
  } else if (lastNum === '2') {
    return `${num}nd`;
  } else if (lastNum === '3') {
    return `${num}rd`;
  } else {
    return `${num}th`;
  }
};

const getDateFormat = (timestamp) => {
  // console.log(timestamp)
  const date = new Date(timestamp)
  return `${getDayOfWeek(date.getDay())}, ${getMonthName(date.getMonth())} ${addNumSuffix(date.getDate())}`
}

module.exports = {getMonthName, getDayOfWeek, addNumSuffix, getDateFormat}