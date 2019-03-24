distributionApp.controller('createPoForSoFactoryController', function($scope, $rootScope, $supplierService, $salesService, $purchaseService, $modalService, $moment){
    console.log(routeParams.id);

    $scope.requiredData = {
        date: $moment(new Date()).format('YYYY-MM-DD'),
        supplier_id: null,
        so_id: routeParams.id,
        sc_id: null,
        item: [],
        selectedSupplier: null
    }

    $scope.customerData = {
        name: "",
        npwp: "",
        address: "",
    }

    $scope.headings = [
        {name: "Nama Barang"},
        {name: "Grade"},
        {name: "Jumlah"},
        {name: "Harga"}
    ];

    $scope.cols = [
        { name: "name", type: "text"}, 
        { name: "grade", type: "text"}, 
        {name: "quantity", type: "number"}, 
        {name: "price", type: "number"} 
    ];

    function getAllSupplier(){
        $supplierService.get.allSuppliers().then(response => {
            console.log(response);
            $scope.supplierList = response.result;
            $scope.supplierList.splice(0, 0, {id: null, name: "-- Pilih Supplier --"});

            $scope.requiredData.selectedSupplier = $scope.supplierList[0];
            $scope.requiredData.supplier_id = $scope.supplierList[0].id;
            $scope.$apply();
        })
        .catch(error => {
            console.log(error);
        })
    }

    $scope.changeSupplier = function(data){
        $scope.requiredData.supplier_id = data.id;
    }

    function getSalesOrderDetail(soId){
        $salesService.get.salesOrderDetail(soId).then(response => {
            console.log(response);
            $scope.customerData.name = response.result.customer.name_on_so;
            $scope.customerData.address = response.result.customer.address_on_so;
            $scope.customerData.npwp = response.result.customer.npwp;
            $scope.requiredData.sc_id = response.result.sc_id;
            
            for(var i=0; i < response.result.item.length ; i++){
                var currentItem = response.result.item[i];
                $scope.requiredData.item.push({
                    ig_id: currentItem.ig_id,
                    name: currentItem.name,
                    grade: currentItem.grade,
                    quantity: currentItem.quantity,
                    price: currentItem.sell_price
                })
            }
            console.log($scope.requiredData);
            $scope.$apply();

        })
        .catch(error => {
            console.log(error);
        })
    }

    $scope.init = function(){
        getAllSupplier();
        getSalesOrderDetail(routeParams.id);
    }

    setTimeout(() => { $scope.init(); }, 70); 

    $scope.save = function(){
        if(!$scope.requiredData.supplier_id){
            $rootScope.triggerModal("Supplier harus dipilih", "Error", "danger", "");
        }
        else{
            console.log($scope.requiredData);
            $purchaseService.order.post.createPoForSoFactory($scope.requiredData).then(response => {
                console.log(response);
                $rootScope.triggerModal("PO berhasil dibuat", "Success", "success", "/purchasing/po");
            })
            .catch(error => {
                console.log(error);
                $rootScope.triggerModal(error.responseJSON.message, "Error", "danger", "");
            })
        }
    }
    
});