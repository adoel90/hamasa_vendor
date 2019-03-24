distributionApp.directive('showItemMasterList', showItemMasterList);
function showItemMasterList($rootScope, $modalService, $itemService){
  return{
    restrict: 'EA',
    scope: {
      apiAccessed: '='
    },
    link: function($scope, element, attrs) {

      element.bind('click', function(){

        $scope.$watch('apiAccessed', function (newValue, oldValue, scope) {
          $scope.apiAccessed = newValue;
          console.log($scope.apiAccessed);
        })

        var modalOptions = {
          scope: $scope,
          templateUrl: '/dist/view/modal/addItem.html',
          size: 'lg'
        }

        $modalService.open(modalOptions)
        .then(function(response) {
          $scope.itemList = {
             requiredData: {
                limit: 10,
                offset: '',
                id: '',
                name: '',
                category: '',
                supplier: '',
                grade: ''
             },
             headings: [],
             items: []
          }

          setTimeout(function(){
             $scope.modalInit();
          },100);

          $scope.$on('initDataByFilter', function(){
            $scope.modalInit();
          });

          $scope.$on('requestFetchData', function() {
            if($scope.apiAccessed == 'itemList'){
              getItemList($scope.itemList.requiredData);
            }
            else if($scope.apiAccessed == 'priceList'){
              getPriceList($scope.itemList.requiredData);
            }
  				})

          $scope.modalInit = function(){
            if($scope.apiAccessed == 'itemList'){
              $scope.itemList.headings = [
                {name: 'Kode Barang'},
                {name: 'Serial'},
                {name: 'Kategori'},
                {name: 'Nama Barang'},
                {name: 'Unit'},
                {name: 'Berat'},
                {name: 'Grade'}
              ]
              getItemList($scope.itemList.requiredData);
            }
            else if($scope.apiAccessed == 'priceList'){
              $scope.itemList.headings = [
                {name: 'Kode Barang'},
                {name: 'Serial'},
                {name: 'Kategori'},
                {name: 'Nama Barang'},
                {name: 'Unit'},
                {name: 'Berat'},
                {name: 'Grade'},
                {name: 'Harga'}
              ]
              getPriceList($scope.itemList.requiredData);
            }

          }

          $scope.chooseItem = function(item){
            $modalService.close();
            if($scope.apiAccessed == 'itemList'){
              $rootScope.$broadcast('chooseItemInMasterList', { state: {item} } );
            }
            else if($scope.apiAccessed == 'priceList'){
              $rootScope.$broadcast('chooseItemInPriceList', { state: {item} } );
            }
          }
        })
      });


      function getPriceList(data){
        $itemService.get.priceList(data).then(function(response) {
          $scope.itemList.items = response.result.data;
          $scope.totalRows = response.result.row;
          $scope.$apply();
        })
        .catch(error => {
          $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
        })
      }

      function getItemList(data){
        $itemService.get.itemList(data).then(response => {
          $scope.itemList.items = response.result.data;
          $scope.totalRows = response.result.row;
          $scope.$apply();
        })
        .catch(error => {
          $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
        })
      }
    }
  }
}
