const isValidEmail = email => {
  process.stdout.write('Checking if valid email... ');
  if (typeof email !== 'string') {
    return false;
  }
  if (email.length === 0) {
    return false;
  }

  email = email.trim().toLowerCase();

  if (email.split(' ').length > 1) {
    return false;
  }

  const validDomainsArray = ['mil', 'gov'];
  const validDomains = validDomainsArray.join('|');

  // regex that does not allow the valid domains.
  const regex = `[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?!(${validDomains})).*$`;

  // const regex = `[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(${validDomains})$`;
  const pattern = new RegExp(regex, 'gm');

  const isValid = pattern.test(email);

  switch (isValid) {
    case true:
      console.log(`${email} is valid!`);
      break;
    default:
      console.log(`${email} is invalid!`);
  }

  return isValid;
};

module.exports = isValidEmail;
