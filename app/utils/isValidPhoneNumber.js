module.exports = phoneNumber => {
  process.stdout.write('Checking if valid phone number... ');
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

  const pattern = new RegExp(/^\+[0-9]{11}$/, 'g');

  const isValid = pattern.test(phoneNumber);

  if (isValid) {
    console.log(`${phoneNumber} is valid!`);
  } else {
    console.log(`${phoneNumber} is invalid!`);
  }

  return isValid;
};
