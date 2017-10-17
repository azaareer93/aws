angular.module('queryService',[])
.service('qService',function($http){
var  queryService = {};
//qService.query('POST',"/api/regUser",RegData)

queryService.query=function(method, url, params, data,headers,transformRequest){
var options={
          method: method,
          url:url,
          params: params,
          data: data,
          headers:headers,
          transformRequest:transformRequest
}
if(!headers){
  delete options.headers;
  delete options.transformRequest;
}
  return $http(options);
};
 return queryService;
});
