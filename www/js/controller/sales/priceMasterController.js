distributionApp.controller('priceMasterController', function($scope, $rootScope, $itemService, $myCookies, $modalService) {
   var accessToken = $myCookies.get('accessToken');

   $scope.requiredData = {
      limit: 10,
      offset: 0,
      name: '',
      category: '',
      id: '',
      supplier: '',
      grade: ''
   }

   $scope.headings = [
      {name: 'KODE BARANG'},
      {name: 'SERIAL'},
      {name: 'KATEGORI'},
      {name: 'NAMA BARANG'},
      {name: 'GRADE'},
      {name: 'CASH PABRIK'},
      {name: 'CASH GUDANG'},
      {name: 'KREDIT PABRIK'},
      {name: 'KREDIT GUDANG'},
      {name: 'ACTION'}
   ];

   $scope.firstSearchFilters = [
     { by: 'code', name: 'Kode Barang', placeholder: 'Masukkan Kode Barang' },
     { by: 'name', name: 'Nama Barang', placeholder: 'Masukkan Nama Barang' },
     { by: 'category', name: 'Kategori Barang', placeholder: 'Masukkan Kategori Barang' }
   ];

   $scope.secondSearchFilters = [
     { by: 'supplier', name: 'Supplier', placeholder: 'Masukkan supplier' },
     { by: 'grade', name: 'Grade', placeholder: 'Masukkan grade' }
   ];

   $scope.firstSelectedFilter = {
     item: $scope.firstSearchFilters[0]
   }
   $scope.secondSelectedFilter = {
     item: $scope.secondSearchFilters[0]
   }

   $scope.init = function(){
      getItemPriceList();
   }

   $scope.$on('requestFetchData', function(event, args) {
		$scope.init();
  });
  
    $scope.exportPriceListDocReport = function(){
      location.href = api.url+'price/list/export?accessToken='+accessToken;
    }

   $scope.exportPriceListDoc = function(){
      location.href = api.url+'price/list/exportbydito?accessToken='+accessToken;
   }

   $("#fileUpload").change(function(e){
      // console.log(e.target.files[0]);
      var file = e.target.files[0];
      $scope.importPriceListDoc(file);
   })

   $scope.importPriceListDoc = function(data){
      $itemService.post.importPriceListDoc(data)
      .then(function(response){
        $rootScope.triggerModal("Import data berhasil", "Success", "success", "/sales/pricemaster");
      })
      .catch(function(error){
        $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
      })
   }


   function getItemPriceList(){
      $itemService.get.priceList($scope.requiredData).then(function(response){
         $scope.totalRows = response.result.row;
         $scope.priceMasterList = response.result.data;
         console.log(response.result);
         $scope.$apply();
      })
      .catch(function(error){
         console.log(error);
      })
   }

   setTimeout(function(){
      $scope.init();
   },100);

   $scope.doSearchFilter = function(firstVal, firstSearchType, secondVal, secondSearchType){
     $scope.requiredData.offset = 0;
     switch(firstSearchType){
       case "code":{
        $scope.requiredData.id = firstVal ? firstVal : "";
        $scope.requiredData.name = "";
        $scope.requiredData.category = "";
        break;
       }
       case "name":{
        $scope.requiredData.id = "";
        $scope.requiredData.name = firstVal ? firstVal : "";
        $scope.requiredData.category = "";
        break;
       }
       case "category":{
        $scope.requiredData.id = "";
        $scope.requiredData.name = "";
        $scope.requiredData.category = firstVal ? firstVal : "";
        break;
       }
     }
     switch(secondSearchType){
       case "supplier":{
         $scope.requiredData.supplier = secondVal ? secondVal : "";
         $scope.requiredData.grade = "";
         break;
       }
       case "grade":{
         $scope.requiredData.supplier = "";
         $scope.requiredData.grade = secondVal ? secondVal : "";
         break;
       }
     }
     setTimeout(()=>{
       $scope.init();
     },200);
   }
   $scope.priceMasterDataValidationSuccessful = function(priceData){
      if(isNaN($rootScope.numberWithNoCommas(priceData.cash_gudang)) || priceData.cash_gudang == "") return false;
      else if(isNaN($rootScope.numberWithNoCommas(priceData.cash_pabrik)) || priceData.cash_pabrik == "" ) return false;
      else if(isNaN($rootScope.numberWithNoCommas(priceData.kredit_gudang)) || priceData.kredit_gudang == "") return false;
      else if(isNaN($rootScope.numberWithNoCommas(priceData.kredit_pabrik)) || priceData.kredit_pabrik == "") return false;
      else return true;
   }

   $scope.editPriceMaster = function(priceMaster){
     var modalOptions = {
       scope: $scope,
       templateUrl: '/dist/view/modal/editPriceMaster.html',
     }
     $modalService.open(modalOptions).then(function(response){
       $scope.priceMasterDetail = {
         ig_id: priceMaster.ig_id,
         name: priceMaster.name,
         price: {
           cash_gudang: $rootScope.numberWithCommas(priceMaster.price.cash_gudang),
           cash_pabrik: $rootScope.numberWithCommas(priceMaster.price.cash_pabrik),
           kredit_gudang: $rootScope.numberWithCommas(priceMaster.price.kredit_gudang),
           kredit_pabrik: $rootScope.numberWithCommas(priceMaster.price.kredit_pabrik)
         }
       }

       $scope.savePriceMaster = function(priceMasterDetail){
         console.log(priceMasterDetail);
         $scope.data = {
            ig_id: priceMasterDetail.ig_id,
            price: priceMasterDetail.price
         }

         if($scope.priceMasterDataValidationSuccessful(priceMasterDetail.price)) updatePriceMaster($scope.data);
         else $rootScope.triggerModal("Harga yang diinput tidak boleh kosong dan harus numerik", "Error", "danger", "");
       }
     })
   }

   function updatePriceMaster(data){

     data.price.cash_gudang = $rootScope.numberWithNoCommas(data.price.cash_gudang);
     data.price.cash_pabrik = $rootScope.numberWithNoCommas(data.price.cash_pabrik);
     data.price.kredit_gudang = $rootScope.numberWithNoCommas(data.price.kredit_gudang);
     data.price.kredit_pabrik = $rootScope.numberWithNoCommas(data.price.kredit_pabrik);

     setTimeout(() => {

       $itemService.put.updatePriceMaster(data)
       .then(function(response){ $rootScope.triggerModal("Update master harga barang sedang menunggu otorisasi atasan", "Success", "success", "/sales/pricemaster"); })
       .catch(function(error){ $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", ""); })
     }, 200);

   }
});
