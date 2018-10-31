module.exports = phoneNumber => {
  if (typeof phoneNumber !== 'string') {
    return false;
  }
  if (phoneNumber.length === 0) {
    return false;
  }

  phoneNumber = phoneNumber.trim();

  if (phoneNumber.split(' ').length > 1) {
    return false;
  }

  // const regex = ;
  const pattern = new RegExp(/^\+[0-9]{11}$/, 'g');

  return pattern.test(phoneNumber);
};
