distributionApp.controller('salesIncomeController', function($scope, $rootScope, $dashboardService){
  
  $dashboardService.get.salesIncome().then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  })
});
