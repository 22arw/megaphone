const isValidEmail = email => {
  if (typeof email !== 'string') {
    return false;
  }
  if (email.length === 0) {
    return false;
  }

  if (email.split(' ').length > 1) {
    return false;
  }

  email = email.trim().toLowerCase();

  const validDomainsArray = ['mil', 'gov'];
  const validDomains = validDomainsArray.join('|');
  const regex = `[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(${validDomains})$`;
  const pattern = new RegExp(regex, 'gm');

  return pattern.test(email);
};

module.exports = isValidEmail;
