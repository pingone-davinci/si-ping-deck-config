// Example switch/case statements

const region = "EU";

switch (region) {
  case "EU":
    regionName = "Europe";
    break;
  case "NA":
    regionName = "NorthAmerica";
    break;
  case "CA":
    regionName = "Canada";
    break;
  case "AP":
    regionName = "AsiaPacific";
    break;
  default:
    regionName = undefined;
}

console.log(`${region} - ${regionName}`);