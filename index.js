const moment = require('moment');

function calculateTotalTarget(startDate, endDate, totalAnnualTarget) {
  // Convert input dates to moment objects
  const start = moment(startDate, 'YYYY-MM-DD');
  const end = moment(endDate, 'YYYY-MM-DD');

  const daysExcludingFridays = [];
  const daysWorkedExcludingFridays = [];
  const monthlyTargets = [];

  // Loop through each month within the date range
  let currentDate = start.clone().startOf('month');
  while (currentDate.isBefore(end, 'month') || currentDate.isSame(end, 'month')) {
    const monthStart = moment.max(currentDate, start).startOf('day');
    const monthEnd = moment.min(currentDate.clone().endOf('month'), end).startOf('day');

    // Total working days in the month excluding Fridays
    let totalWorkingDays = 0;
    let workedDays = 0;

    for (let date = monthStart.clone(); date.isSameOrBefore(monthEnd); date.add(1, 'days')) {
      if (date.isoWeekday() !== 5) { // Exclude Fridays (Friday = 5 in ISO week)
        totalWorkingDays++;
        if (date.isSameOrAfter(start) && date.isSameOrBefore(end)) {
          workedDays++;
        }
      }
    }

    daysExcludingFridays.push(totalWorkingDays);
    daysWorkedExcludingFridays.push(workedDays);

    // Move to the next month
    currentDate.add(1, 'month');
  }

  // Calculate the total valid working days in the period
  const totalWorkingDaysInRange = daysWorkedExcludingFridays.reduce((acc, days) => acc + days, 0);

  // Proportionally distribute the totalAnnualTarget across the worked days
  daysWorkedExcludingFridays.forEach((workedDays) => {
    const monthlyTarget = (workedDays / totalWorkingDaysInRange) * totalAnnualTarget;
    monthlyTargets.push(monthlyTarget.toFixed(12)); // To match the example's precision
  });

  // Total target over the worked days
  const totalTarget = monthlyTargets.reduce((acc, target) => acc + parseFloat(target), 0);

  return {
    daysExcludingFridays,
    daysWorkedExcludingFridays,
    monthlyTargets: monthlyTargets.map(target => parseFloat(target)), // Parsing to match example output
    totalTarget: totalTarget.toFixed(2)
  };
}

// Example usage:
const result = calculateTotalTarget('2024-01-01', '2024-03-31', 5220);
console.log(result);