distributionApp.directive('showSalesPrice', showSalesPrice);

function showSalesPrice($rootScope, $modalService, $timeout, $salesService){
  return{
    restrict: 'EA',
    scope: {
      payMethod: '=',
      pickup: '=',
      contractId: '='
    },
    link: function($scope, element, attrs) {


      element.bind('click', function(){
        $scope.$watch('payMethod', function (newValue, oldValue, scope) {
          $scope.payMethod = newValue;
          console.log('Pay METHOD', newValue);
        })
        $scope.$watch('pickup', function(newValue, oldValue, scope){
          $scope.pickup = newValue;
          console.log('pickup ', newValue);
        })
        $scope.$watch('contractId', function(newValue, oldValue, scope){
          $scope.contractId = newValue ? newValue: '';
          console.log('contract id ', newValue);
        })

        var modalOptions = {
    			scope: $scope,
    			templateUrl: '/dist/view/modal/addItemPrice.html',
    			size: 'lg'
    		}

        setTimeout(() => {$(".form-input:eq(2)").focus();}, 90);
        
    		$modalService.open(modalOptions)
    		.then(function(response) {
          $scope.itemPriceList = {
  					requiredData: {
  						limit: 10,
  						offset: 0,
  						pay_method: $scope.payMethod,
  						pickup: $scope.pickup,
  						contract_id: $scope.contractId,
  						id: '',
  						name: '',
  						category: '',
  						supplier: '',
  						grade: ''
  					},
  					items: [],
  					totalRows: 0
  				}

          if($scope.pickup == 2){
            $scope.itemPriceList.headings = [
              { name: 'Kode Barang', width: '20%'},
              { name: 'Nama Barang', width: '30%'},
              { name: 'Unit', width: '5%' },
              { name: 'Berat', width: '5%' },
              { name: 'Grade', width: '5%' },
              { name: 'Harga', width: 'auto' }
            ]
            $scope.itemPriceList.cols = [
              {name: 'id', width: '20%'},
              {name: 'name', width: '30%'},
              {name: 'unit', width: '5%'},
              {name: 'weight', width: '5%'},
              {name: 'grade', width: '5%'},
              {name: 'unitPrice', width: 'auto'},
            ]
          }
          else if($scope.pickup == 1){
            $scope.itemPriceList.headings = [
              { name: 'Kode Barang', width: '20%'},
              { name: 'Nama Barang', width: '30%'},
              { name: 'Unit', width: 'auto' },
              { name: 'Berat', width: 'auto' },
              { name: 'Grade', width: 'auto' },
              { name: 'Harga', width: 'auto' }
            ]
            $scope.itemPriceList.cols = [
              {name: 'id', width: '20%'},
              {name: 'name', width: '30%'},
              {name: 'unit', width: 'auto'},
              {name: 'weight', width: 'auto'},
              {name: 'grade', width: 'auto'},
              {name: 'unitPrice', width: 'auto'}
            ]
          }
          $scope.modalInit = function() {
            getItemPriceList();
            setTimeout(() => {
              if($scope.pickup == 2){
                var warehouses = $scope.itemPriceList.items[0].warehouse;
                for(var i=0; i < warehouses.length; i++){
                  console.log(warehouses[i].code);
                  $scope.itemPriceList.headings.push({
                    name: warehouses[i].code,
                    width: 'auto'
                  })
                }
                $scope.$apply();
              }
            }, 700);
  				}

          $scope.showHistory = function(colName, itemId){
            if(colName == 'name'){
              var url = "/itemhistory/" + itemId;
              window.open(url, '_blank');
            }
          }
          $scope.$on('initDataByFilter', function(event, args) {
        		$scope.itemPriceList.requiredData.offset = 0;
        		getItemPriceList();
        	});

          $rootScope.$on('requestFetchData', function() {
            console.log('do fetching data');
  					getItemPriceList();
  				})

          $scope.chooseItem = function(item, warehouse) {
            $rootScope.$broadcast('chooseItemInSalesPrice', { state: {item, warehouse} } );
          }

          $scope.chooseItemForFactory = function(item){
            $rootScope.$broadcast('chooseItemInSalesPriceForFactory', { state: {item} } );
          }

          function getItemPriceList() {
  					if($scope.contractId) {
  						$scope.itemPriceList.requiredData.contract_id = $scope.contractId;
  					}
            console.log($scope.itemPriceList.requiredData);
  					$salesService.get.priceList($scope.itemPriceList.requiredData)
  						.then(function(response) {
                console.log(response);
  							$scope.itemPriceList.items = response.result.data;
                for(var i=0; i < $scope.itemPriceList.items.length; i++){
                  $scope.itemPriceList.items[i].id = $scope.itemPriceList.items[i].id ? $scope.itemPriceList.items[i].id : '-';
                  $scope.itemPriceList.items[i].unitPrice = $scope.itemPriceList.items[i].price ? $rootScope.numberWithCommas($scope.itemPriceList.items[i].price.unit) : '-';
                }
  							$scope.totalRows = response.result.row;
                $scope.$apply();
  						})
  						.catch(function(error) {
  							$rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
  						})
  				}

          setTimeout(() => { $scope.modalInit(); }, 700);

        })
      })
    }
  }
}
