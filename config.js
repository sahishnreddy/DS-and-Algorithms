const env = process.env.NODE_ENV || "development";

//insert your API Key & Secret for each environment, keep this file local and never push it to a public repo for security purposes.
const config = {
  development: {
    APIKey: "54BsVU9LS02hG0qx16P1aQ",
    APISecret: "pZ92ksNtvnOHmoqS3QoDowtMoSQYDiM8qYY6",
  },
  /*production: {
    APIKey: "",
    APISecret: "",
  },*/
};

module.exports = config[env];
