distributionApp.controller('poController', function($scope, $purchaseService, $modalService, $rootScope, $myCookies){

  var accessToken = $myCookies.get('accessToken');

   $scope.searchFilters = [
      {by: "id", name: "ID PO", placeholder: "Masukkan ID PO"},
      {by: "date", name: "Tanggal PO", placeholder: "Masukkan Tanggal PO"},
      {by: "supplier", name: "Nama Supplier", placeholder: "Masukkan Nama Supplier"},
      {by: 'range_date', name: 'Range Tanggal'}
   ];

   $scope.headings = [
      {name: "Tanggal PO"},
      {name: "Nomor PO"},
      {name: "Nomor BTB"},
      {name: "Supplier"},
      {name: "Tipe PO"},
      {name: "Status PO"}
   ];

   $scope.selectedFilter = {
      item: $scope.searchFilters[0]
   };

   $scope.requiredData = {
      limit: 10,
      offset: 0,
      id: '',
      date: '',
      supplier_name: '',
      s_date: '',
      e_date: ''
   }

   setTimeout(function(){
      $scope.init();
   },200);

   $scope.init = function(){
      getPoList($scope.requiredData);
   }

   $scope.printPo = function(poId){
     location.href = api.url + 'purchase/order/print?accessToken=' + accessToken + '&id=' + poId;
   }

   $scope.exportToExcel = function(){
     location.href = api.url + "report/original/purchase/order?accessToken=" + accessToken + '&id=' + $scope.requiredData.id + '&date=' + $scope.requiredData.date + '&supplier_name=' + $scope.requiredData.supplier_name + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date + "&export=" + true;
   }
   
   $scope.cancelPo = function(poId){
     var poToDelete = {
       id: poId
     }
     $purchaseService.order.delete.cancelPo(poToDelete).then(response => {
       $rootScope.triggerModal("Po berhasil dibatalkan!", "Success", "success", "/purchasing/po");
     })
     .catch(error => {
       $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
     })
   }

   function getPoList(data){
      $purchaseService.order.get.purchaseOrderList(data).then(function(response){
         console.log(response);
         $scope.poList = response.result.data;
         $scope.totalRows = response.result.row;
         $scope.$apply();
      })
      .catch(function(error){
         console.log(error);
      })
   }

   $scope.doSearchFilter = function(val, type) {
     console.log(val + " "+type);
     console.log('doing searching');
		$scope.requiredData.offset = 0;
		switch(type) {
         case "id":{
            $scope.requiredData.id = val;
            $scope.requiredData.date = "";
            $scope.requiredData.supplier_name = "";
            $scope.requiredData.s_date = "";
            $scope.requiredData.e_date = "";
            break;
         }
         case "date":{
            $scope.requiredData.date = val;
            $scope.requiredData.id = "";
            $scope.requiredData.supplier_name = "";
            $scope.requiredData.s_date = "";
            $scope.requiredData.e_date = "";
            break;
         }
         case "supplier":{
            $scope.requiredData.supplier_name = val;
            $scope.requiredData.id = "";
            $scope.requiredData.date = "";
            $scope.requiredData.s_date = "";
            $scope.requiredData.e_date = "";
            break;
         }
      }
      console.log($scope.requiredData);
      $scope.init();
   }

   $rootScope.$on('requestFetchData', function() {
		$scope.init();
	})

   $scope.openDetailPo = function(id){
      var modalOptions = {
  			scope: $scope,
  			templateUrl: '/dist/view/modal/detailPo.html',
  			size: 'lg'
		  }
      $modalService.open(modalOptions)
			.then(function(response) {
            $scope.detailPo = {
               headings: [
                  {name: "Kategori"},
                  {name: "Nama Barang"},
                  {name: "Satuan"},
                  {name: "Grade"},
                  {name: "Jumlah Pesan"},
                  {name: "Jumlah Outstanding"},
                  {name: "Harga"}
               ],
               data: {}
            }

            $purchaseService.order.get.purchaseOrderDetail(id).then(function(response){
               console.log(response);
               $scope.detailPo.data = response.result;
               $scope.$apply();
            })
            .catch(function(error){
               console.log(error);
            })
         })
         .catch(function(error) {
            console.log(error);
         })
   }

   $rootScope.$on('requestFetchData', function() {
		$scope.init();
	})

});
