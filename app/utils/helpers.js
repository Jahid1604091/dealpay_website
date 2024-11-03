export function isEmail(str) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(str);
}

export function isBangladeshiPhoneNumber(str) {
    const bdPhonePattern = /^(?:\+88|88)?(01[2-9]\d{8})$/;
    return bdPhonePattern.test(str);
}

export function formatDays(days) {
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);
    const weeks = Math.floor(((days % 365) % 30) / 7);
    const remainingDays = ((days % 365) % 30) % 7;
  
    let result = [];
    if (years > 0) result.push(`${years} year${years > 1 ? 's' : ''}`);
    if (months > 0) result.push(`${months} month${months > 1 ? 's' : ''}`);
    // if (weeks > 0) result.push(`${weeks} week${weeks > 1 ? 's' : ''}`);
    if (remainingDays > 0) result.push(`${remainingDays} day${remainingDays > 1 ? 's' : ''}`);
  
    return result.join(', ');
  }
  
  