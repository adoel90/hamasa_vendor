distributionApp.controller('cashinController', function($scope, $rootScope, $modalService, $cashService, $myCookies){
  $scope.btnCreateNewCash = "Buat Kas Masuk";

  var accessToken = $myCookies.get('accessToken');

  $scope.requiredData = {
    limit: 10,
    offset: 0,
    id: '',
    date: '',
    s_date: '',
    e_date: ''
  }

  $scope.searchFilters = [
    { by: 'id', name: 'Nomor Kas Masuk', placeholder: 'Masukkan nomor kas masuk' },
    { by: 'date', name: 'Tanggal Kas Masuk', placeholder: 'Masukkan tanggal kas masuk' },
    { by: 'range_date', name: 'Range Tanggal' }
  ];

  $scope.selectedFilter = {
    item: $scope.searchFilters[0]
  }

  $scope.headings = [
    { name: 'No. Kas Masuk'},
    { name: 'Tanggal' },
    { name: 'Asal Pembayaran' },
    { name: 'Keterangan Pembayaran'}
  ];

  $scope.cols = ['id', 'date', 'from', 'note'];
  $scope.btnName = "Buat Kas Masuk";
  $scope.tableType = 'non-edited-table';

  $scope.redirectToCreateNewData = function(){
		location.href = "/finance/cashin/createnewcashin";
	}

  $scope.doSearchFilter = function(val, type) {
		$scope.requiredData.offset = 0;
		switch(type) {
			case 'id': {
				$scope.requiredData.id = val;
				$scope.requiredData.date = '';
				break;
			}
			case 'date': {
				$scope.requiredData.id = '';
				$scope.requiredData.date = val;
				break;
			}
		}
		getCashinList($scope.requiredData);
	}

  $scope.$on("openDetailDataInTable", function(event, args){
    $scope.modalName = "Detail Kas Masuk";

    var cashinDetail = args.state.data.id;
    var modalOptions = {
			scope: $scope,
			templateUrl: '/dist/view/modal/cashoutDetail.html',
			size: 'lg'
		}
    $modalService.open(modalOptions)
		.then(function(response) {
      setTimeout(() => { $scope.modalInit(); }, 90);

      $scope.modalInit = function(){
        getCashinDetail(cashinDetail);
      }
    })

  });

  function definePaymentMethodName(method){
    if(method == 0){ return 'Tunai'; }
    else if(method == 1){ return 'Transfer'; }
    else if(method == 2){ return 'Cek'; }
    else if(method == 3){ return 'Giro'; }
  }

  function getCashinDetail(cashinDetail){
    $cashService.get.cashinDetail(cashinDetail).then(response => {
      console.log(response);
      $scope.listFieldsInTheLeft = [
        { name: "Nomor Kas Masuk", value: response.result.id, type: "text" },
        { name: "Tanggal Kas Masuk", value: response.result.date, type: "text" },
        { name: "Asal Pembayaran", value: response.result.from, type: "text" },
        { name: "Catatan", value: response.result.note, type: "textarea" }
      ];
      $scope.listFieldsInTheRight = [
        { name: "Jumlah Kas Masuk", value: $rootScope.numberWithCommas(response.result.total), type: "text" },
        { name: "Metode Pembayaran", value: definePaymentMethodName(response.result.method), type: "text" },
        { name: "Bank Tujuan Kas Masuk", value: response.result.bank, type: "text", hide: response.result.method == 0 ? true : false },
        { name: "Nomor Bukti Pembayaran", value: response.result.proof, type: "text", hide: response.result.method == 0 ? true : false },
        { name: "Tanggal Jatuh Tempo", value: response.result.due_date, type: "text", hide: (response.result.method == 0 || response.result.method == 1) ? true : false }
      ];
      $scope.$apply();
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

  $scope.init = function(){
    getCashinList($scope.requiredData);
  }

  setTimeout(() => { $scope.init(); }, 100);

  $scope.exportToExcel = function(){
    location.href = api.url + 'report/finance/cash/in?accessToken=' + accessToken + '&export=' + true + '&s_date=' + $scope.requiredData.s_date + '&e_date=' + $scope.requiredData.e_date;
  }

  function getCashinList(data){
    $cashService.get.cashinList(data).then(response => {
      $scope.listData = response.result.data;
      $scope.totalRows = response.result.row;
      $scope.$apply();
    })
    .catch(error => {
      $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
    })
  }

})
