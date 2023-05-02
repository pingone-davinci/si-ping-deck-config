
/**
 *
 * dvlogin
 * Login to DaVinci
 *
 */
const dvlogin = async function (envId, region, username, password) {
  console.log(`${envId} ${region} ${username} ${password}`)
  let result = {};

  if (!envId || !region || !username || !password) {
    redAlert("Missing DaVinci Preferences");
  } else {
    try {
      const response = await fetch("/api/dvlogin",
        {
          method: "POST",
          body: JSON.stringify({
            env: envId,
            username,
            password
          }),
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "x-p1-region": region
          }
        });

      let resp = await response.json();

      result.accessToken = resp?.access_token;
      result.companies = resp?.companies;
      if (result.accessToken && result.companies) {
        greenAlert("PingOne/Davinci Login Successful")
      } else if (resp?.message) {
        redAlert(resp.message);
      } else {
        redAlert("Unable to Login");
      }
    } catch (err) {
      console.log("Unable to login")
    }
  }


  return result;
}