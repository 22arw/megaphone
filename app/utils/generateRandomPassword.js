module.exports = () => {
  console.log('Generating a random password... Done!');
  return Math.random()
    .toString(36)
    .slice(-8);
};
