distributionApp.controller('salesOrderReportController', function($scope, $rootScope, $reportService, $moment, $myCookies){
  var accessToken = $myCookies.get("accessToken");
  $scope.requiredData = {
    start_date: $moment(new Date()).format('YYYY-MM-DD'),
    end_date: $moment(new Date()).format('YYYY-MM-DD'),
    export: false
  }

  $scope.exportToExcel = function(){
    location.href = api.url + "report/penjualan?accessToken=" + accessToken + "&start_date=" + $scope.requiredData.start_date + "&end_date=" + $scope.requiredData.end_date + "&export=true";
  }
//   $scope.headings = [
//     {name: "Tanggal SO"},
//     {name: "Nomor SO"},
//     {name: "Nama Customer"},
//     {name: "Sales"},
//     {name: "Pelunasan"},
//     {name: "Nama Barang"},
//     {name: "Qty"},
//     {name: "Harga"},
//     {name: "Subtotal"},
//     {name: "Total"},
//     {name: "Status"}
//   ];

//   $scope.paymentTypeList = [
//     {id: "", name: "-- Pilih Jenis Pembayaran --"},
//     { id: 1, name: 'CASH' },
// 		{ id: 2, name: 'CREDIT' }
//   ];

//   $scope.changePaymentType = function(item){
//     $scope.requiredData.payment_type = item.id;
//   }

//  $scope.requiredData = {
//     limit: 10,
//     offset: 0,
//     start_date: $moment(new Date()).format('YYYY-MM-DD'),
//     end_date: $moment(new Date()).format('YYYY-MM-DD'),
//     print: false,
//     payment_type: "",
//     selectedPaymentType: $scope.paymentTypeList[0]
//   }

//   setTimeout(()=>{ $scope.init(); },120);

//   $scope.init = function(){
//     var today = new Date();
//     var tomorrow = new Date();
//     tomorrow.setDate(today.getDate()+1);

//     setTimeout(()=>{
//       $scope.requiredData.end_date = $moment(tomorrow).format('YYYY-MM-DD');
//       getSoReport($scope.requiredData);
//     },100);
//   }

//   function getSoReport(data){
//     $reportService.get.soReport(data).then(response => {
//       console.log(response);
      
//       $scope.listReportData = response.result.data;
//       $scope.totalRows = response.result.row;
//       $scope.totalSales = response.result.total;
//       $scope.$apply();
//     })
//     .catch(error => {
//       $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
//     })
//   }

//   $scope.viewReport = function(){
//     $scope.requiredData.offset = 0;
//     getSoReport($scope.requiredData);
//   }

//   $scope.printReport = function(){
//     location.href = api.url + 'report/sales/order?accessToken=' + accessToken + '&start_date=' + $scope.requiredData.start_date + '&end_date=' + $scope.requiredData.end_date + '&payment=' + $scope.requiredData.payment_type +'&print=true';
//   }

//   $rootScope.$on('requestFetchData', function() {
//    $scope.init();
//   })

});
