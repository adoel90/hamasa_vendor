
distributionApp.controller('pelunasanPpnSupplierController', function($scope, $myCookies, $rootScope, $paymentService, $modalService, $customerService, $supplierService, $invoiceService){

    var accessToken = $myCookies.get('accessToken');

    $scope.requiredData = {
        selectedSupplier: null,
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

    function getSupplierList(){
        $supplierService.get.allSuppliers().then(response => {
            console.log(response);
            $scope.supplierList = response.result;
            $scope.supplierList.splice(0, 0, {id: "", name: "-- Pilih Supplier --"});
            $scope.requiredData.selectedSupplier = $scope.supplierList[0];
            $scope.$apply();
        })
        .catch(error => {
            console.log(error);
        })
    }

     $scope.changeSupplier = function(data){
        $scope.requiredData.id = data.id;
        $scope.requiredData.supplier = data.id;
        $scope.requiredData.name = data.name;
    }

    setTimeout(() => {
        $scope.init();
    }, 100);

    $scope.init = function(){
        // getCustomerList();
        getSupplierList();
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

    $scope.viewSupplierInvoice = function(){
        console.log($scope.requiredData.id);
        $invoiceService.get.invoiceListBasedOnSupplier($scope.requiredData.id).then(function(response){
            // $scope.invoiceList = response.result.invoice;
            $scope.invoiceList = response.result;
            $scope.$apply();
            console.log($scope.invoiceList);
        })
        .catch(function(error){
            $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
        })
    }

    $scope.saveDataPo = function(invoice){
        
        $scope.requiredData.total = invoice.paid;
        $scope.requiredData.invoice.push({
            id: invoice.id,
            paid: invoice.paid
        })
        $scope.requiredData.keterangan = invoice.keterangan;
        $scope.requiredData.ppn_repayment = 1;

        console.log("$scope.saveDataPo; $scope.requiredData = ")
        console.log($scope.requiredData)
        
        setTimeout(()=> {
            $paymentService.post.createPaymentForPo($scope.requiredData).then(function(response){
                console.log(response);
                $rootScope.triggerModal("PPN telah dilunaskan", "Success", "success", "/finance/pelunasanppnsupplier");
              })
              .catch(function(error){
                $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
              })
        }, 100);
    }

    $scope.exportToExcel = function(){
        location.href = api.url + 'report/finance/payment/ppnsupplier?accessToken=' + accessToken + '&export=' + true + '&supplier_name=' + $scope.requiredData.name;
    }

});