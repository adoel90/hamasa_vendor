distributionApp.controller('deliveryController', function($scope, $rootScope, $doService, $modalService, $deliveryService, $customerService, $myCookies) {
   console.log('deliveryController');

   var accessToken = $myCookies.get("accessToken");
   $scope.customerData = null;
   $scope.itemList = null;

   $scope.deliveryFormData = {
      do_id: '',
      delivery_id: '',
      address: '',
      delivery_price: 0,
      s_date: '',
      e_date: ''
   }

   $scope.searchFilters = [
       { by: 'range_date', name: 'Range Tanggal' }
   ];

   $scope.selectedFilter = {
       item: $scope.searchFilters[0]
   }

   $scope.total_weight = 0;
   $scope.headings = [
      {name: "Kategori"},
      {name: "Nama Barang"},
      {name: "Satuan"},
      {name: "Grade"},
      {name: "Berat"},
      {name: "Jumlah Kirim"}
   ];

   $scope.viewCustomerAndItemByDoDetail = function(id){
      $doService.get.doDetail(id).then(function(response){
         console.log(response);
         $scope.customerData = {
            id: response.result.customer.id,
            name: response.result.customer.name,
            npwp: response.result.customer.npwp,
            address: ''
         }
         $scope.itemList = response.result.item;
         $scope.total_weight = response.result.total_weight;
         $scope.$apply();
      })
      .catch(function(error){
         console.log(error);
      })
   }

   $scope.openDeliveryPriceList = function(){
      var modalOptions = {
        scope: $scope,
  			templateUrl: '/dist/view/modal/addPriceDelivery.html',
  			size: 'lg'
      }
      $modalService.open(modalOptions)
		.then(function(response) {

         $scope.requiredData = {
            limit: 10,
            offset: 0,
            name: '',
            capacity: $scope.total_weight
         }

         $scope.detailHeadings = [
            {name: "Nama Tujuan"},
            {name: "Jenis Kendaraan"},
            {name: "Kapasitas"},
            {name: "Harga"}
         ];
         $scope.searchFilters = [
            {by: "name", name: "Nama Tujuan", placeholder: "Masukkan Nama Tujuan"}
         ]
         $scope.selectedFilter = {
            item: $scope.searchFilters[0]
         }

         $scope.init = function(){
            getPriceDeliveryList($scope.requiredData);
         }

         $scope.doSearchFilter = function(val, type){
            switch(type){
               case "name" : {
                  $scope.requiredData.name = val;
               }
            }
            $scope.init();
         }
         $scope.selectDelivery = function(data){
            $modalService.close();
            $scope.deliveryData = {
               id: data.id,
               name: data.name,
               price: data.price,
               vehicle: data.vehicle,
               capacity: data.capacity
            }
            $scope.deliveryFormData.delivery_id = data.id;
            $scope.deliveryFormData.delivery_price = $rootScope.numberWithCommas(data.price);
         }

         setTimeout(function(){
            $scope.init();
         },200);

      })
      .catch(function(error) {
         console.log(error);
      })
   }

   function getPriceDeliveryList(data){
      $deliveryService.get.listPriceDelivery(data).then(function(response){
         console.log(response);
         $scope.priceDeliveryList = response.result.data;
         $scope.totalRows = response.result.row;
         $scope.$apply();
      })
      .catch(function(error){
         console.log(error);
      })
   }

   $scope.openCustomerAddressList = function(){
      var modalOptions = {
         scope: $scope,
			templateUrl: '/dist/view/modal/addCustomerAddress.html'
      }
      $modalService.open(modalOptions)
		.then(function(response) {
         $scope.customerHeadings = [
            {name: "Kota"},
            {name: "Alamat", size: "lg"}
         ];
         $scope.requiredData = {
            id: $scope.customerData.id,
            limit: 10,
            offset: 0
         }
         $scope.init = function(){
            getCustomerAddressList($scope.requiredData);
         }

         setTimeout(function(){
            $scope.init();
         },200);

         $scope.selectCustAddress = function(data){
            $scope.customerData.address = data.address;
            $modalService.close();
         }
      })
      .catch(function(error){
         console.log(error);
      })
   }
   function getCustomerAddressList(data){
      $customerService.get.listCustomerAddress(data).then(function(response){
         $scope.customerAddressList = response.result;
         $scope.$apply();
      })
      .catch(function(error){
         console.log(error);
      })
   }

   function createDelivery(data){
        $deliveryService.post.createDoDelivery($scope.deliveryFormData).then(function(response){
            console.log(response);
            $rootScope.triggerModal("Delivery untuk DO telah dibuat", "Success", "success", "");
        })
        .catch(function(error){
            $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
        })
   }

   $scope.save = function(){
      $scope.deliveryFormData.address = $scope.customerData.address;
      $scope.deliveryFormData.delivery_price = $rootScope.numberWithNoCommas($scope.deliveryFormData.delivery_price);

      setTimeout(() => { createDelivery($scope.deliveryFormData); }, 90);
   }

   $scope.exportToExcel = function(){
       location.href = api.url + "report/original/delivery?accessToken=" + accessToken + '&s_date=' + $scope.deliveryFormData.s_date + '&e_date=' + $scope.deliveryFormData.e_date + "&export=" + true;
   }
   
});
