const POPULATION_REGEX = /<(.*?)>/g;
const populateConfigString = (configString, rawConfig) => {
  if (
    !configString ||
    typeof configString !== 'string' ||
    !configString.match(POPULATION_REGEX)
  ) return configString;

  let populatedConfigString = configString;
  const match = configString.match(POPULATION_REGEX);
  for (const matchString of match) {
    const replacementKey = matchString.replace(/<|>/g, '');
    let replacementValue = rawConfig[replacementKey];
    console.log(replacementValue);
    if (
      replacementValue &&
      typeof replacementValue === 'string' &&
      replacementValue.match(POPULATION_REGEX)
    ) replacementValue = populateConfigString(replacementValue, rawConfig);

    console.log(populatedConfigString);
    populatedConfigString = populatedConfigString.replace(POPULATION_REGEX, replacementValue)
  }

  console.log(populatedConfigString);

  return populatedConfigString;
};

const parseConfig = (rawConfig) => {
  const parsedConfig = {};
  for (const key of Object.keys(rawConfig)) {
    const configString = rawConfig[key];
    parsedConfig[key] = populateConfigString(configString, rawConfig);
  }
  return parsedConfig;
};

module.exports = {
  parseConfig,
};
