distributionApp.controller('dashboardController', function($scope, $rootScope, $timeout, $dashboardService, $moment, $userService){
  'use strict';

  $scope.salesIncome = 0;
  $scope.salesOrder = 0;
  $scope.salesQuotation = 0;
  $scope.salesQuotationRealization = 0;
  $scope.purchase = 0;
  $scope.revenue = 0;

  $scope.headings = [
    {name: "Tanggal"},
    {name: "Nominal"}
  ];

  function getCashout(){
    $dashboardService.get.cashout().then(response => {
      console.log(response);
      $scope.cashoutList = response.result;
      $scope.$apply();
    })
    .catch(error => {
      console.log(error);
    })
  }

  function getSalesIncome(){
    $dashboardService.get.salesIncome().then(response => {
      $scope.salesIncome = response.result;
    })
    .catch(error => {
      console.log(error);
    })
  }

  function getSalesOrder(){
    $dashboardService.get.salesOrder().then(response => {
      $scope.salesOrder = response.result;
    })
    .catch(error => {
      console.log(error);
    })
  }

  function getSalesQuotation(){
    $dashboardService.get.salesQuotation().then(response => {
      $scope.salesQuotation = response.result;
    })
    .catch(error => {
      console.log(error);
    })
  }

  function getSalesQuotationRealization(){
    $dashboardService.get.salesQuotationRealization().then(response => {
      $scope.salesQuotationRealization = response.result;
    })
    .catch(error => {
      console.log(error);
    })
  }

  function getPurchase(){
    $dashboardService.get.purchase().then(response => {
      console.log(response);
      $scope.listPurchase = response.result;

    })
    .catch(error => {
      console.log(error);
    })
  }

  function getRevenue(){
    $dashboardService.get.revenue().then(response => {
      $scope.listRevenue = response.result;
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    })
  }

  $userService.get.listAccess().then(response => {
    console.log(response);
  })
  .catch(error => {
    console.log(error);
  })
  $scope.init = function() {
    if($rootScope.userProfile.access.id == 2){
      getSalesIncome();
      getSalesOrder();
      getSalesQuotation();
      getSalesQuotationRealization();

      setTimeout(()=>{
        $scope.tileList = [
          { name: 'Sales Income', value: $scope.salesIncome },
          { name: 'Sales Order', value: $scope.salesOrder },
          { name: 'Sales Quotation', value: $scope.salesQuotation },
          { name: 'Sales Quotation Realization', value: $scope.salesQuotationRealization }
        ];
        $scope.$apply();
      }, 300);
    }
    else if($rootScope.userProfile.access.id == 1 || $rootScope.userProfile.access.id == 8){
      getCashout();
      getRevenue();
      getPurchase();
      getSalesIncome();
      getSalesOrder();
      getSalesQuotation();
      getSalesQuotationRealization();
      setTimeout(()=>{
        $scope.tileList = [
          { name: 'Sales Income', value: $scope.salesIncome },
          { name: 'Sales Order', value: $scope.salesOrder },
          { name: 'Sales Quotation', value: $scope.salesQuotation },
          { name: 'Sales Quotation Realization', value: $scope.salesQuotationRealization }
        ];
        $scope.$apply();
      }, 300);
    }
  }

  $timeout($scope.init(), 400);

  setTimeout(function() {
    $rootScope.$broadcast('requestToggleMenu');
  });

  var today = new Date();
  var monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  $scope.currentMonth = monthNames[today.getMonth()];


})
