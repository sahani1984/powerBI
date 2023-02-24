// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl:"https://countifi-webapp-dev-2094667571.us-east-1.elb.amazonaws.com:3001/v1/reports/",  
  loginAUrl:"https://m97vyvor6e.execute-api.us-east-1.amazonaws.com/"
};

/*
  baseUrl:"https://app.countifi.com/api/v2/reports/",
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
