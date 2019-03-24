distributionApp.controller('createNewBtbTipoController', function($scope, $rootScope, $tipoService, $customerService, $modalService, $myCookies){
   console.log('create new tipo controller');
   $scope.tipoData = {
      surat_jalan: '',
      driver: '',
      transport_number: '',
      customer_id: '',
      customer_name: '',
      item: [
        {
          serial: "",
          category: "",
          name: "",
          weight: "",
          quantity: "",
          note: ""
        }
      ]
   }

   $scope.headings = [
      {name: "NO SERI"},
      {name: "KATEGORI"},
      {name: "NAMA BARANG"},
      {name: "BERAT"},
      {name: "JUMLAH BARANG"},
      {name: "KETERANGAN", size: "lg"},
      {name: "ACTION"}
   ];


   $scope.save = function(){
      $tipoService.post.createBtbTipo($scope.tipoData).then(function(response){
        console.log(response);
        var redirectPrintBtb = api.url + "tipo/print?accessToken=" + $myCookies.get("accessToken") + "&id=" + response.result;
        $rootScope.triggerModal("Tipo berhasil dibuat.", "Success", "success", redirectPrintBtb);
      })
      .catch(function(error){
         console.log(error);
         $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
   }

   $scope.addItem = function(){
      $scope.tipoData.item.push({
         serial: "",
         category: "",
         name: "",
         weight: "",
         quantity: "",
         note: ""
      })
   }
   $scope.addCustomer = function(){
      var modalOptions = {
         scope: $scope,
			templateUrl: '/dist/view/modal/addCustomer.html',
			size: 'lg'
      }
      $modalService.open(modalOptions)
		.then(function(response) {
         $scope.customerData = {
            requiredData: {
               limit: 10,
               offset: 0,
               id: '',
               name: ''
            },
            headings: [
               {name: 'ID Customer'},
               {name: 'Nama Customer', size: 'lg'},
               {name: 'NPWP'}
            ]
         }

         $scope.searchFilters = [
            { by: 'id', name: 'ID Customer', placeholder: "Masukkan ID Customer"},
            { by: 'name', name: 'Nama Customer', placeholder: "Masukkan Nama Customer"}
         ];

         $scope.selectedFilter = {
            item: $scope.searchFilters[0]
         }

         $scope.init = function(){
            getCustomerList($scope.customerData.requiredData);
         }

         setTimeout(function(){
            $scope.init();
         },200);

         $scope.doSearchFilter = function(val, type) {
            switch(type) {
               case 'id': {
                  $scope.customerData.requiredData.id = val;
                  $scope.customerData.requiredData.name = '';

                  break;
               }
               case 'name': {
                  $scope.customerData.requiredData.name = val;
                  $scope.customerData.requiredData.id = '';

                  break;
               }
            }
            $scope.init();
         }

         $scope.chooseItem = function(customer){
            $scope.tipoData.customer_id = customer.id;
            $scope.tipoData.customer_name = customer.name;

            $modalService.close();
            $scope.$apply();
         }
      })
      .catch(function(error){

      })
   }

   function getCustomerList(data){
      $customerService.get.customerList(data)
      .then(function(response){
         $scope.customerList = response.result.data;
         $scope.totalRows = response.result.row;
         $scope.$apply();
         console.log(response);
      })
      .catch(function(error){
         console.log(error);
      })
   }

   $scope.removeItem = function(index){
      if($scope.tipoData.item.length > 1){
         $scope.tipoData.item.splice(index,1);
      }

   }

});
