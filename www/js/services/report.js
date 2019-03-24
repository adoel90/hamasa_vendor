distributionApp.factory('$reportService', function($myCookies){
  var accessToken = $myCookies.get('accessToken');
  return{
    get: {
      accountReceivablesDailyReport: function(data){
        return $.get(api.url + 'report/accounts/receivable/daily?accessToken=' + accessToken + '&date=' + data.date + '&export=' + data.export);
      },
      customerSaldo: function(data){
        return $.get(api.url + "report/customer/saldo?accessToken=" + accessToken + "&limit=" + data.limit + "&offset=" + data.offset + "&customer=" + data.customer + "&export=" + data.export);
      },
      dailyInvoiceReport: function(data){
        return $.get(api.url + 'report/invoice/daily?accessToken=' + accessToken + '&start_date' + data.start_date + '&end_date=' + data.end_date + '&payment=' + data.method + '&print=' + data.print);
      },
      doOutstandingReport : function(data){
        return $.get(api.url + 'report/delivery/order/outstanding?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&date=' + data.date + '&warehouse_id=' + data.warehouse_id + '&print=' + data.print);
      },
      financeIncome: function(data){
        return $.get(api.url + 'report/finance/income?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&date=' + data.date + '&print=' + data.print);
      },
      soReport: function(data){
        return $.get(api.url + 'report/sales/order?accessToken=' + accessToken + '&start_date=' + data.start_date + '&end_date=' + data.end_date + '&payment=' + data.payment_type + '&print=' + data.print);
      },
      warehouseMutationReport: function(data){
        return $.get(api.url + 'report/mutation/warehouse?accessToken=' + accessToken + '&start_date=' + data.start_date + '&end_date=' + data.end_date + '&mutation_from=' + data.warehouse_id + '&print=' + data.print);
      },
      customerCredit: function(data){
        return $.get(api.url + 'report/customer/credit?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&end_date=' + data.date + '&print=' + data.print);
      },
      creditInvoice: function(data){
        return $.get(api.url + 'report/invoice/credit?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&date=' + data.date + '&print=' + data.print);
      },
      quotationReport: function(data){
        return $.get(api.url + 'report/quotation?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&date=' + data.date + '&print=' + data.print);
      },
      purchaseContractReport: function(id){
        return $.get(api.url + 'purchase/contract/history?accessToken=' + accessToken + '&id=' + id);
      },
      warehouseReorder: function(data){
        return $.get(api.url + 'report/purchase/reorder?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&warehouse_id=' + data.warehouse_id + '&print=' + data.print);
      },
      warehouseStock: function(data){
        return $.get(api.url + 'report/inventory/stock?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&warehouse_id=' + data.warehouse_id + '&print=' + data.print);
      },
      warehouseStockMinus: function(data){
        return $.get(api.url + 'report/inventory/minus?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&print=' + data.print + '&warehouse_id=' + data.warehouse_id);
      },
      warehouseActivity: function(data){
        return $.get(api.url + 'report/inventory/activity?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&date=' + data.date + '&warehouse_id=' + data.warehouse_id + '&print=' + data.print + "&name=" + data.name);
      },
      customerCreditAnalysis: function(data){
        return $.get(api.url + 'report/analysis/credit?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&start_date=' + data.start_date + '&end_date=' + data.end_date + '&print=' + data.print);
      },
      paymentDisbursementReport: function(data){
        return $.get(api.url + 'report/payment/disbursement?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&end_date=' + data.date + '&print=' + data.print);
      },
      incomeReport: function(data){
        return $.get(api.url + 'report/finance/income?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&start_date=' + data.start_date + '&end_date=' + data.end_date + '&print=' + data.print + '&pay_method=' + data.method);
      },
      accountReceivablesReport: function(data){
        return $.get(api.url + 'report/accounts/receivable?accessToken=' + accessToken + '&start_date=' + data.start_date + '&end_date='+ data.end_date + '&print=' + data.print + '&detail=' + data.detail + '&c_name=' + data.c_name + '&pay_method=' + data.method);
      },
      purchaseOrderReport: function(data){
        return $.get(api.url + 'report/purchase/order?accessToken=' + accessToken + '&date=' + data.date + '&print=' + data.print);
      },
      itemSoldReport: function(data){
        return $.get(api.url + 'report/item/sold?accessToken=' + accessToken + '&date=' + data.date + '&print=' + data.print);
      },
      sellingReport: function(data){
        return $.get(api.url + 'report/selling?accessToken=' + accessToken + '&date=' + data.date + '&export=' + data.export);
      },
      piutangCustomer: function(data){
        return $.get(api.url + 'report/customer/piutang?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&start_date=' + data.start_date + '&end_date=' + data.end_date + '&c_name=' + data.c_name + '&print=' + data.print  + '&payment=' + data.payment);
      },
      agingPiutangReport: function(data){
        return $.get(api.url + 'report/aging/piutang?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&start_date=' + data.start_date + '&end_date=' + data.end_date + '&c_name=' + data.c_name + '&export=' + data.export);
      },
      giroDueDate: function(data){
        return $.get(api.url + 'report/payment/duedate?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&end_date=' + data.date + '&print=' + data.print);
      },
      purchasingReport: function(data){
        return $.get(api.url + 'report/purchase/order?accessToken=' + accessToken + '&limit=' + data.limit + '&offset=' + data.offset + '&start_date=' + data.start_date + '&end_date=' + data.end_date + '&category=' +  data.category + '&print=' + data.print + '&export=' + data.export);
      },
      purchaseContractReport: function(data){
        return $.get(api.url + 'report/purchase/contract?accessToken=' + accessToken + '&end_date=' + data.end_date + '&supplier=' + data.supplier + '&pc_id=' + data.pc_id + '&print=' + data.print + '&export=' + data.export);
      }
    }
  }
})
