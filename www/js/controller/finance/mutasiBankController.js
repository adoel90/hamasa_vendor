
distributionApp.controller('mutasiBankController', function($scope, $myCookies, $rootScope, $paymentService, $modalService, $customerService, $bankService, $invoiceService){

    var accessToken = $myCookies.get('accessToken');

    $scope.requiredData = {
        selectedSupplier: null,
        selectedBank: null,
        total: 0,
        method: 0,
        bank: null,
        proof: null,
        due_date: null,
        name : "",
        invoice: [],
        keterangan: "",
        ppn_repayment: 0
    }

    function getBankList(){
        $bankService.get.allBank().then(response => {
            console.log(response);
            $scope.bankList = response.result;
            $scope.bankList.splice(0, 0, {account: "", bank: "-- Pilih Bank --"});
            $scope.requiredData.selectedBank = $scope.bankList[0];
            $scope.$apply();
        })
        .catch(error => {
            console.log(error);
        })
    }

    $scope.changeBank = function(data){
        $scope.requiredData.account = data.account;
        $scope.requiredData.bank = data.bank;
    }

    setTimeout(() => {
        $scope.init();
    }, 100);

    $scope.init = function(){
        getBankList();
    }

    $scope.headings = [
        {name: "Nomor Invoice"},
        {name: "DPP"},
        {name: "PPN"},
        {name: "Total"},
        {name: "Sisa belum dibayar"},
        {name: "PPN/PPH yg dilunaskan"},
        {name: "Keterangan"},
        {name: "Action"}
    ];

    $scope.exportToExcel = function(){
        location.href = api.url + 'report/finance/bank/mutation?accessToken=' + accessToken + '&export=' + true + '&bank=' + $scope.requiredData.account;
    }

});