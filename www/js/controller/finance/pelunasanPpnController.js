
distributionApp.controller('pelunasanPpnController', function($scope, $myCookies, $rootScope, $paymentService, $modalService, $customerService){

    var accessToken = $myCookies.get('accessToken');

    $scope.requiredData = {
        selectedCustomer: null,
        total: 0,
        method: 0,
        bank: null,
        proof: null,
        due_date: null,
        customer_id: "",
        customer_name: "",
        customer_bank: null,
        invoice: [],
        tanda_terima: "",
        ppn_repayment: 0
    }

    function getCustomerList(){
        $customerService.get.customer().then(response => {
            console.log(response);
            $scope.customerList = response.result;
            $scope.customerList.splice(0, 0, {id: "", name: "-- Pilih Customer --"});
            $scope.requiredData.selectedCustomer = $scope.customerList[0];
            $scope.$apply();
        })
        .catch(error => {
            console.log(error);
        })
    }

    $scope.changeCustomer = function(data){
        $scope.requiredData.customer_id = data.id;
        $scope.requiredData.customer_name = data.name;
    }

    setTimeout(() => {
        $scope.init();
    }, 100);

    $scope.init = function(){
        getCustomerList();
    }

    $scope.headings = [
        {name: "Nomor Invoice"},
        {name: "DPP"},
        {name: "PPN"},
        {name: "Total"},
        {name: "Sisa belum dibayar"},
        {name: "PPN yg dilunaskan"},
        {name: "Keterangan"},
        {name: "Action"}
    ];

    $scope.viewCustomerInvoice = function(){
        console.log($scope.requiredData.customer_id);
        $paymentService.get.customerInvoice($scope.requiredData.customer_id).then(function(response){
            console.log(response);
            $scope.invoiceList = response.result.invoice;
            $scope.$apply();
        })
        .catch(function(error){
            $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
        })
    }

    $scope.saveData = function(invoice){
        
        $scope.requiredData.total = invoice.paid;
        $scope.requiredData.invoice.push({
            id: invoice.id,
            paid: invoice.paid,
            stamp: false,
            inv_total: invoice.total,
            tanda_terima: invoice.tanda_terima
        })
        $scope.requiredData.tanda_terima = invoice.tanda_terima;
        $scope.requiredData.ppn_repayment = 1;
        
        setTimeout(()=> {
            $paymentService.post.createPayment($scope.requiredData).then(function(response){
                console.log(response);
                $rootScope.triggerModal("PPN telah dilunaskan", "Success", "success", "/finance/pelunasanppn");
              })
              .catch(function(error){
                $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
              })
        }, 100);
    }

    $scope.exportToExcel = function(){
        location.href = api.url + 'report/finance/payment/ppn?accessToken=' + accessToken + '&export=' + true + '&customer_name=' + $scope.requiredData.customer_name;
    }

});