distributionApp.directive('jasaPotong', jasaPotong);

function jasaPotong($rootScope, $modalService, $timeout, $salesService){
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
        })
        $scope.$watch('pickup', function(newValue, oldValue, scope){
          $scope.pickup = newValue;
        })
        $scope.$watch('contractId', function(newValue, oldValue, scope){
          $scope.contractId = newValue ? newValue: '';
        })

        var modalOptions = {
    			scope: $scope,
    			templateUrl: '/dist/view/modal/addItemPrice.html',
    			size: 'lg'
    		}

    		$modalService.open(modalOptions)
    		.then(function(response) {
          // $scope.itemPriceList = {
  				// 	requiredData: {
  				// 		limit: 10,
  				// 		offset: 0,
  				// 		pay_method: $scope.payMethod,
  				// 		pickup: $scope.pickup,
  				// 		contract_id: $scope.contractId,
  				// 		id: '',
  				// 		name: 'jasa potong',
  				// 		category: '',
  				// 		supplier: '',
  				// 		grade: ''
  				// 	},
  				// 	headings: [
          //     { name: 'Kategori', width: ''},
          //     { name: 'Nama Barang', size: 'lg'},
          //     { name: 'Unit'},
          //     { name: 'Berat' },
          //     { name: 'Grade' },
          //     { name: 'Harga' }
          //   ],
  				// 	items: [],
  				// 	totalRows: 0
  				// }
          $scope.itemPriceList = {
  					requiredData: {
  						limit: 10,
  						offset: 0,
  						pay_method: $scope.payMethod,
  						pickup: $scope.pickup,
  						contract_id: $scope.contractId,
  						id: '',
  						name: '',
  						category: 'jasa',
  						supplier: '',
  						grade: ''
  					},
  					items: [],
            totalRows: 0,
            headings: [
              { name: 'Kategori', width: '20%'},
              { name: 'Nama Barang', width: '30%'},
              { name: 'Unit', width: '5%' },
              { name: 'Berat', width: '5%' },
              { name: 'Grade', width: '5%' },
              { name: 'Harga', width: 'auto' }
            ],
            cols: [
              {name: 'categoryName', width: '20%'},
              {name: 'name', width: '30%'},
              {name: 'unit', width: '5%'},
              {name: 'weight', width: '5%'},
              {name: 'grade', width: '5%'},
              {name: 'unitPrice', width: 'auto'}
            ]
          }
          
          $scope.modalInit = function() {
            getItemPriceList();
            setTimeout(() => {
              if($scope.pickup == 2){
                console.log($scope.itemPriceList.items);
                // var warehouses = $scope.itemPriceList.items[0].warehouse;
                // console.log(warehouses);
                // for(var i=0; i < warehouses.length; i++){
                //   $scope.itemPriceList.headings.push({
                //     name: warehouses[i].code,
                //     width: 'auto'
                //   })
                // }
                // $scope.$apply();
              }
            }, 300);
  				}

          $scope.$on('initDataByFilter', function(event, args) {
        		$scope.itemPriceList.requiredData.offset = 0;
        		getItemPriceList();
        	});

          $rootScope.$on('requestFetchData', function() {
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
            console.log($scope.itemPriceList);
  					$salesService.get.priceList($scope.itemPriceList.requiredData)
  						.then(function(response) {
  							console.log(response);
                $scope.itemPriceList.items = response.result.data;
                for(var i=0; i < $scope.itemPriceList.items.length; i++){
                  $scope.itemPriceList.items[i].categoryName = $scope.itemPriceList.items[i].category ? $scope.itemPriceList.items[i].category.name : '-';
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
