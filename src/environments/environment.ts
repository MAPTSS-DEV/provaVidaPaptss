// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hmr       : false,
 // apiURL: 'http://localhost:8085/api',
  URLImage: 'https://172.26.42.19:8863/Image/',
  apiURL: 'https://172.26.42.19:8064/api',

  apiUrl: 'https://172.26.42.19:8064',
  apiPath: '/api',

  EmailUrl: 'https://www.cupplus.co.ao/smsapp/apis/smscontact/',
  _IdEmpresa: ''
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
