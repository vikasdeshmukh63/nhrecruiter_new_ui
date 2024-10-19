import { format } from 'date-fns';

// evaluation type options
export const EvalType = [
  {
    id: 1,
    name: 'Verbal',
  },
  {
    id: 2,
    name: 'Coding',
  },
];

// video speed
export const SPEED_DURATION = [
  { id: 1, speed: 0.25 },
  { id: 2, speed: 0.5 },
  { id: 3, speed: 1 }, // Normal speed
  { id: 4, speed: 1.5 },
  { id: 5, speed: 2 }, // Double speed
];

// eslint-disable-next-line eqeqeq
export const finderFunction = (key, value, data) => {
  if (!data || !Array.isArray(data)) return null;
  return data.find((item) => {
    const itemValue = item[key];
    if (Array.isArray(itemValue)) {
      return itemValue.includes(value);
    }
    // eslint-disable-next-line eqeqeq
    return itemValue === value || itemValue == value;
  });
};

// function to format date
export function DateFormat(date, dateFormat) {
  const storedDate = new Date(date);
  return format(storedDate, dateFormat);
}

// function to find the status
export function findStatus(status, data) {
  return data?.find((item) => item.statusValue === status);
}

export const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];
export const monthsOfYear = [
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
export const weekArray = ['W1', 'W2', 'W3', 'W4', 'W5'];

export function graphDataExtractor(rawData, constants, duration) {
  const finalResultObj = {
    extractedInterviewData: {
      labels: [],
      series: [],
    },
    extractedJobPostData: {
      labels: [],
      series: [],
    },
    extractedInterviewScores: {
      labels: ['Score 1-4', 'Score 5-7', 'Score 8-10'],
      series: [],
    },
  };

  // for extractedInterviewData
  if (rawData && constants && constants?.IV_Status && rawData?.interviewsData) {
    rawData?.interviewsData?.forEach((item) => {
      Object?.keys(constants?.IV_Status)?.forEach((key) => {
        if (constants?.IV_Status[key] === Number(item?.name)) {
          const dataObj = {
            name: key.replaceAll('_', ' '),
            data: item.data,
          };

          finalResultObj.extractedInterviewData.series.push(dataObj);
        }
      });
    });
  }

  if (duration === 1) {
    rawData?.interviewsData[0]?.periods?.forEach((dateString) => {
      const date = new Date(dateString);
      const day = daysOfWeek[date.getDay()];
      finalResultObj.extractedInterviewData.labels.push(day);
    });
  }
  if (duration === 2) {
    rawData?.interviewsData[0]?.periods?.forEach((dateString) => {
      const component = dateString.split('-');
      const week = component[2];
      finalResultObj.extractedInterviewData.labels.push(week);
    });
  }
  if (duration === 3) {
    rawData?.interviewsData[0]?.periods?.forEach((dateString) => {
      const component = dateString.split('-');
      const month = monthsOfYear[parseInt(component[1], 10) - 1];
      finalResultObj.extractedInterviewData.labels.push(month);
    });
  }

  // initializing array to hold series data filled with zeros
  const zeroData = Array(daysOfWeek.length).fill(0);

  // updaing the series data to include zeros for missing days
  finalResultObj.extractedInterviewData.series.forEach((series) => {
    // creating copyof zerodata
    const newData = [...zeroData];
    series.data.forEach((value, index) => {
      let labelIndex;

      if (duration === 1) {
        labelIndex = daysOfWeek.indexOf(finalResultObj.extractedInterviewData.labels[index]);
      }
      if (duration === 2) {
        labelIndex = weekArray.indexOf(finalResultObj.extractedInterviewData.labels[index]);
      }
      if (duration === 3) {
        labelIndex = monthsOfYear.indexOf(finalResultObj.extractedInterviewData.labels[index]);
      }

      if (labelIndex !== -1) {
        newData[labelIndex] = value;
      }
    });
    series.data = newData;
  });

  if (duration === 1) {
    finalResultObj.extractedInterviewData.labels = daysOfWeek;
  }
  if (duration === 2) {
    finalResultObj.extractedInterviewData.labels = weekArray;
  }
  if (duration === 3) {
    finalResultObj.extractedInterviewData.labels = monthsOfYear;
  }

  // for extractedJobPostData
  if (rawData && constants && constants?.JP_Status && rawData?.jobPostsData) {
    rawData?.jobPostsData?.forEach((item) => {
      Object.keys(constants?.JP_Status)?.forEach((key) => {
        if (constants?.JP_Status[key] === Number(item?.status)) {
          const customKey = key.replaceAll('_', ' ');
          finalResultObj.extractedJobPostData.labels.push(customKey);
          finalResultObj.extractedJobPostData.series.push(item.JobPosts);
        }
      });
    });
  }

  // for extractedInterviewScores
  if (rawData && rawData?.interviewScores?.length !== 0) {
    rawData?.interviewScores?.forEach((item) => {
      const seriesObj = {
        name: '',
        data: [],
      };
      const { year_months } = item;
      if (year_months) {
        const [year, month] = year_months.split('-');
        const monthName = monthsOfYear[parseInt(month, 10) - 1];
        seriesObj.name = monthName;
        Object?.keys(item)?.forEach((key) => {
          if (key.includes('score')) {
            seriesObj.data.push(Number(item[key]));
          }
        });
      }
      finalResultObj.extractedInterviewScores.series.push(seriesObj);
    });
  }

  return finalResultObj;
}

// function to capitalize first letter of each word
export const capitalizeFirstLetter = (string) => {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

// error handling cases
export function getValidationError(error, name) {
  if (error.status === 'VALIDATION_ERROR' || (error.statusCode >= 400 && error.statusCode < 500)) {
    if (error.message.includes('Only unique name are allowed')) {
      return `${name} Name already Exists`;
    }
    if (error.message.includes('Only unique email are allowed')) {
      return `${name} Email already Exists`;
    }
    return error.message;
  }
  if (error.status === 'SERVER_ERROR' || (error.statusCode >= 500 && error.statusCode < 600))
    return 'An unexpected error occurred. Please try again later.';
  return 'Something went wrong';
}
