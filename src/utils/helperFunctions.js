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

// filters for job post status
export const filters = [
  { id: 1, label: 'Pending Approval', value: 'Pending Approval' },
  { id: 2, label: 'Active', value: 'Active' },
  { id: 3, label: 'Paused', value: 'Paused' },
  { id: 4, label: 'Flagged', value: 'Flagged' },
  { id: 5, label: 'Cancelled', value: 'Cancelled' },
  { id: 6, label: 'Draft', value: 'Draft' },
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

// handle text render case
export const renderText = (value, na) => {
  if (value !== null && value !== undefined) {
    return value;
  }
  return na ? 'Not Available' : '';
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

// this is add candidate form

export const EXPERIENCE_LEVELS = [
  { year: 'Fresher', id: 0 },
  { year: '1', id: 1 },
  { year: '2', id: 2 },
  { year: '3', id: 3 },
  { year: '4', id: 4 },
  { year: '5', id: 5 },
  { year: '6', id: 6 },
  { year: '7', id: 7 },
  { year: '8', id: 8 },
  { year: '9', id: 9 },
  { year: '10', id: 10 },
  { year: '11', id: 11 },
  { year: '12', id: 12 },
  { year: '13', id: 13 },
  { year: '14', id: 14 },
  { year: '15', id: 15 },
  { year: '16', id: 16 },
  { year: '17', id: 17 },
  { year: '18', id: 18 },
  { year: '19', id: 19 },
  { year: '20', id: 20 },
  { year: '21', id: 21 },
  { year: '22', id: 22 },
  { year: '23', id: 23 },
  { year: '24', id: 24 },
  { year: '25', id: 25 },
  { year: '26', id: 26 },
  { year: '27', id: 27 },
  { year: '28', id: 28 },
  { year: '29', id: 29 },
  { year: '30', id: 30 },
  { year: '31', id: 31 },
  { year: '32', id: 32 },
  { year: '33', id: 33 },
  { year: '34', id: 34 },
  { year: '35', id: 35 },
  { year: '36', id: 36 },
  { year: '37', id: 37 },
  { year: '38', id: 38 },
  { year: '39', id: 39 },
  { year: '40', id: 40 },
  { year: '41', id: 41 },
  { year: '42', id: 42 },
  { year: '43', id: 43 },
  { year: '44', id: 44 },
  { year: '45', id: 45 },
  { year: '46', id: 46 },
  { year: '47', id: 47 },
  { year: '48', id: 48 },
  { year: '49', id: 49 },
  { year: '50', id: 50 },
];

export const EXPERIENCE_MONTHS = [
  { month: '0', id: 0 },
  { month: '1', id: 1 },
  { month: '2', id: 2 },
  { month: '3', id: 3 },
  { month: '4', id: 4 },
  { month: '5', id: 5 },
  { month: '6', id: 6 },
  { month: '7', id: 7 },
  { month: '8', id: 8 },
  { month: '9', id: 9 },
  { month: '10', id: 10 },
  { month: '11', id: 11 },
  { month: '12', id: 12 },
];

// parsed data of personal
export function getPersonlDetails(foundData, getState) {
  const { cand_details, cand_data, cand_docs } = foundData;

  const candidateImage = finderFunction('type', 4, cand_docs);
  const candidateResume = finderFunction('type', 1, cand_docs);

  const result = {
    prof_id: candidateImage?.summary || null,
    first_name: cand_data?.first_name || '',
    middle_name: cand_data?.middle_name || '',
    last_name: cand_data?.last_name || '',
    email: cand_data?.email || '',
    phoneNumber: `${cand_data.mobile_code}${cand_data.mobile_no}` || '',
    dob: cand_details?.dob ? cand_details?.dob : null,
    gender: finderFunction('id', cand_details?.gender, getState().general.constants.gender) || null,
    marital_status:
      finderFunction(
        'id',
        cand_details?.marital_status,
        getState().general.constants.marital_status
      ) || null,
    fu_cv_id:
      {
        path: candidateResume?.name,
        updatedAt: candidateResume?.updatedAt,
      } || null,
    idv1Type: finderFunction('id', cand_details?.idv1Type, getState()?.masters?.nationalId) || null,
    idv2Type: finderFunction('id', cand_details?.idv2Type, getState()?.masters?.nationalId) || null,
    idv1: cand_details?.idv1 || '',
    idv2: cand_details?.idv2 || '',
  };

  return result;
}

// parsed data of professional

export function getProfessionalDetails(foundData, getState) {
  const { prof_details, skills } = foundData;

  // location
  const locations = getState().jobpost.locationData;

  const idsToFind = prof_details?.pref_location.split(',');
  const foundPreferredLocations = locations?.filter((item) =>
    idsToFind.includes(item.id.toString())
  );

  const result = {
    prof_summary: prof_details?.prof_summary || '',
    exp_years: finderFunction('id', prof_details?.exp_years, EXPERIENCE_LEVELS) || null,
    exp_months: finderFunction('id', prof_details?.exp_months, EXPERIENCE_MONTHS) || null,
    skills: skills || [],
    cctc: prof_details?.cctc?.toString() || '',
    ectc: prof_details?.ectc?.toString() || '',
    curr_location:
      finderFunction('id', prof_details.curr_location, getState().jobpost.locationData) || null,
    pref_location: foundPreferredLocations || [],
    not_period:
      finderFunction(
        'id',
        prof_details?.not_period,
        getState()?.general?.constants?.notice_period
      ) || null,
    remaining_days: prof_details?.remaining_days?.toString() || '',
  };

  return result;
}

// platform contants
export function convertData(data) {
  // Helper function to convert an object into the desired array format
  function convertToArray(obj) {
    if (!obj) return []; // Return an empty array if obj is undefined or null
    return Object.entries(obj).map(([key, value]) => ({
      variant: key
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase()), // Convert key to title case
      id: value,
    }));
  }

  // Convert each section of the data safely
  const convertedData = {
    gender: convertToArray(data.gender),
    marital_status: convertToArray(data.marital_status),
    notice_period: convertToArray(data.notice_period),
    employment_type: convertToArray(data.employment_type),
    education_type: convertToArray(data.education_type),
    course_type: convertToArray(data.course_type),
    universities_type: convertToArray(data.universities_type),
    courses: convertToArray(data.courses),
  };

  return convertedData;
}
