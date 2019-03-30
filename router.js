var app = require('express').Router();
var redirect = require(__dirname+'/middleware/redirect');

module.exports = (function(){
	app.get('/', function(req, res, next){
		console.log(req.cookies);
		if(req.cookies.accessToken){
			res.redirect('/sales');
		}
		else{
			res.redirect('/login');
		}
	});

	//	Login
	app.get('/login', require(__dirname+'/router/login'));

	//Dashboard
	app.get('/dashboard', redirect, require(__dirname+'/router/dashboard/dashboard'));
	//	Sales
	app.get('/sales', redirect, require(__dirname+'/router/sales/sales'));
	app.get('/itemhistory/:id', redirect, require(__dirname + '/router/sales/itemhistory'));
	app.get('/sales/customermaster', redirect, require(__dirname+'/router/sales/customermaster'));
	app.get('/sales/customermaster/createnewcustomer', redirect, require(__dirname + '/router/sales/createnewcustomer'));
	app.get('/sales/customermaster/editcustomer/:id', redirect, require(__dirname + '/router/sales/editcustomer'));
	app.get('/sales/salescontract', redirect, require(__dirname + '/router/sales/salescontract'));
	app.get('/sales/salescontract/amandemensalescontract/:id', redirect, require(__dirname + '/router/sales/amandemensalescontract'));

	app.get('/sales/salescontract/createnewsalescontract', redirect, require(__dirname + '/router/sales/createnewsalescontract'));
	app.get('/sales/quotation', redirect, require(__dirname + '/router/sales/quotation'));
	app.get('/sales/quotation/createnewquotation', redirect, require(__dirname + '/router/sales/createnewquotation'));
	app.get('/sales/salesorder', redirect, require(__dirname + '/router/sales/salesorder'));
	app.get('/sales/salesorder/salesorderinfo/:id', redirect, require(__dirname + '/router/sales/salesorderinfo'));
	app.get('/sales/salesorder/salesorderinfo/:id/createnewdeliveryorder', redirect, require(__dirname + '/router/sales/createnewdeliveryorder'));
	app.get('/sales/salesorder/createnewsalesorder', redirect, require(__dirname + '/router/sales/createnewsalesorder'));

	app.get('/sales/tipo', redirect, require(__dirname + '/router/sales/tipo'));
	app.get('/sales/tipo/tipoinfo/:id', redirect, require(__dirname + '/router/sales/tipoinfo'));
	app.get('/sales/tipo/tipoinfo/:id/createnewdeliveryordertipo', redirect, require(__dirname + '/router/sales/createnewdeliveryordertipo'))
	app.get('/sales/tipo/tipoinfo/:id/createnewsalesorder/:cust_id', redirect, require(__dirname + '/router/sales/createnewsalesorderfortipo'));
	app.get('/sales/tipo/tipoinfo/:id/createnewspk', redirect, require(__dirname + '/router/sales/createnewspk'));

	app.get('/sales/pricemaster', redirect, require(__dirname + '/router/sales/pricemaster'));
	app.get('/sales/pricedelivery', redirect, require(__dirname + '/router/sales/pricedeliverymaster'));
	app.get('/sales/pricedelivery/createnewpricedelivery', redirect, require(__dirname + '/router/sales/createnewpricedelivery'));
	app.get('/sales/pricedelivery/editpricedelivery/:id', redirect, require(__dirname + '/router/sales/editpricedelivery'));


	app.get('/sales/delivery', redirect, require(__dirname + '/router/sales/delivery'));
	app.get('/sales/cuttingcost', redirect, require(__dirname + '/router/sales/itemcuttingcost'));

	//	Purchasing
	app.get('/purchasing', redirect, require(__dirname+'/router/purchasing/purchasing'));
	app.get('/purchasing/purchasingcontract', redirect, require(__dirname+'/router/purchasing/purchasingcontract'));
	app.get('/purchasing/purchasingcontract/createnewpurchasingcontract', redirect, require(__dirname+'/router/purchasing/createnewpurchasingcontract'));
	app.get('/purchasing/purchasingcontract/amandemenpurchasingcontract/:id', redirect, require(__dirname+'/router/purchasing/amandemenpurchasingcontract'));
	app.get('/purchasing/po', redirect, require(__dirname+'/router/purchasing/po'));
	app.get('/purchasing/po/createnewpo', redirect, require(__dirname+'/router/purchasing/createnewpo'));
	app.get('/purchasing/po/createpoforsofactory/:id', redirect, require(__dirname + '/router/purchasing/createpoforsofactory'));

	app.get('/purchasing/supplier', redirect, require(__dirname+'/router/purchasing/supplier'));
	app.get('/purchasing/supplier/createnewsupplier', redirect, require(__dirname+'/router/purchasing/createnewsupplier'));
	app.get('/purchasing/supplier/editsupplier/:id', redirect, require(__dirname+'/router/purchasing/editsupplier'));
	app.get('/purchasing/poinvoice', redirect, require(__dirname+'/router/purchasing/poinvoice'));
	app.get('/purchasing/poinvoice/createpoinvoice', redirect, require(__dirname+'/router/purchasing/createpoinvoice'));
	app.get('/purchasing/poinvoice/editpoinvoice/:id', redirect, require(__dirname+'/router/purchasing/editpoinvoice'));

	//*Bukti Pengambilan Barang
	app.get('/purchasing/bpb', redirect, require(__dirname+'/router/purchasing/purchasingbuktiambilbarang'));
	app.get('/purchasing/bpb/createnewbpb', redirect, require(__dirname+'/router/purchasing/createnewbpb'));


	//	Inventory
	app.get('/inventory', redirect, require(__dirname+'/router/inventory/inventory'));
	app.get('/inventory/itemmaster', redirect, require(__dirname+'/router/inventory/itemmaster'));
	app.get('/inventory/itemmaster/createnewitem', redirect, require(__dirname+'/router/inventory/createnewitem'));
	app.get('/inventory/itemmaster/createnewitem/:id', redirect, require(__dirname+'/router/inventory/copyitemmaster'));
	app.get('/inventory/itemmaster/edititem/:id', redirect, require(__dirname + '/router/inventory/edititem'));
	app.get('/inventory/warehousemaster', redirect, require(__dirname+'/router/inventory/warehousemaster'));
	app.get('/inventory/warehousemaster/createnewwarehouse', redirect, require(__dirname + '/router/inventory/createnewwarehouse'));
	app.get('/inventory/warehousemaster/editwarehouse/:id', redirect, require(__dirname + '/router/inventory/editwarehouse'));
	app.get('/inventory/mutation', redirect, require(__dirname + '/router/inventory/mutation'));
	app.get('/inventory/mutation/createnewmutation', redirect, require(__dirname + '/router/inventory/createnewmutation'));
	app.get('/inventory/conversion', redirect, require(__dirname + '/router/inventory/conversion'));
	app.get('/inventory/conversion/createnewconversion', redirect, require(__dirname + '/router/inventory/createnewconversion'));
	app.get('/inventory/btb', redirect, require(__dirname + '/router/inventory/btb'));
	app.get('/inventory/btb/createnewbtb', redirect, require(__dirname + '/router/inventory/createnewbtb'));
	app.get('/inventory/bkb', redirect, require(__dirname + '/router/inventory/bkb'));
	app.get('/inventory/bkb/createnewbkb', redirect, require(__dirname + '/router/inventory/createnewbkb'));
	app.get('/inventory/warehouseinventory', redirect, require(__dirname + '/router/inventory/warehouseinventory'));
	app.get('/inventory/stockadjustment', redirect, require(__dirname + '/router/inventory/stockadjustment'));
	app.get('/inventory/btbtipo', redirect, require(__dirname + '/router/inventory/btbtipo'));
	app.get('/inventory/btbtipo/createnewbtbtipo', redirect, require(__dirname+'/router/inventory/createnewbtbtipo'));
	app.get('/inventory/bkbtipo', redirect, require(__dirname + '/router/inventory/bkbtipo'));
	app.get('/inventory/bkbtipo/createnewbkbtipo', redirect, require(__dirname+'/router/inventory/createnewbkbtipo'));
	app.get('/inventory/categorymaster', redirect, require(__dirname+'/router/inventory/categorymaster'));
	app.get('/inventory/categorymaster/createnewcategory', redirect, require(__dirname+'/router/inventory/createnewcategorymaster'));
	app.get('/inventory/categorymaster/editcategory/:id', redirect, require(__dirname+'/router/inventory/editcategorymaster'));
	app.get('/inventory/grademaster', redirect, require(__dirname+'/router/inventory/grademaster'));
	app.get('/inventory/grademaster/createnewgrade', redirect, require(__dirname+'/router/inventory/createnewgrademaster'));
	app.get('/inventory/grademaster/editgrade/:id', redirect, require(__dirname+'/router/inventory/editgrademaster'));
	app.get('/inventory/spk', redirect, require(__dirname + '/router/inventory/spk'));
	app.get('/inventory/spk/editspk/:id', redirect, require(__dirname + '/router/inventory/spkreport'));
	//	Finance

	app.get('/finance', redirect, require(__dirname + '/router/finance/finance'));
	app.get('/finance/payment', redirect, require(__dirname+'/router/finance/payment'));
	app.get('/finance/payment/createnewpayment', redirect, require(__dirname+'/router/finance/createnewpayment'));
	app.get('/finance/popayment', redirect, require(__dirname+'/router/finance/popayment'));
	app.get('/finance/popayment/createnewpayment', redirect, require(__dirname+'/router/finance/createnewpaymentforpo'));
	app.get('/finance/bankmaster', redirect, require(__dirname+'/router/finance/bankmaster'));
	app.get('/finance/einvoice', redirect, require(__dirname+ '/router/finance/einvoice'));
	app.get('/finance/bankmaster/createnewbank', redirect, require(__dirname+'/router/finance/createnewbank'));
	app.get('/finance/bankmaster/editbank/:id', redirect, require(__dirname+'/router/finance/editbankmaster'));
	app.get('/finance/bankmutation', redirect, require(__dirname+'/router/finance/mutasiBank'));
	app.get('/finance/pelunasanppn', redirect, require(__dirname+'/router/finance/pelunasanppn'));
	app.get('/finance/pelunasanppnsupplier', redirect, require(__dirname+'/router/finance/pelunasanppnsupplier'));

	app.get('/finance/payment', redirect, require(__dirname + '/router/finance/payment'));
	app.get('/finance/billing', redirect, require(__dirname + '/router/finance/billing'));
	app.get('/finance/printinvoice', redirect, require(__dirname + '/router/finance/printinvoice'));
	app.get('/finance/disbursement', redirect, require(__dirname + '/router/finance/disbursement'));
	app.get('/finance/cashout', redirect, require(__dirname + '/router/finance/cashout'));
	app.get('/finance/cashout/createnewcashout', redirect, require(__dirname + '/router/finance/createnewcashout'))
	app.get('/finance/cashin', redirect, require(__dirname + '/router/finance/cashin'));
	app.get('/finance/cashin/createnewcashin', redirect, require(__dirname + '/router/finance/createnewcashin'));
	app.get('/finance/taxserialmaster', redirect, require(__dirname + '/router/finance/taxserialmaster'));

	//Authorization

	app.get('/authorization', redirect, require(__dirname + '/router/authorization/authorization'));
	app.get('/authorization/salesauth', redirect, require(__dirname + '/router/authorization/sales'));
	app.get('/authorization/salesauth/salesorderauth/:id', redirect, require(__dirname + '/router/authorization/salesorderauthedit'));
	app.get('/authorization/financeauth', redirect, require(__dirname+ '/router/authorization/finance'));
	app.get('/authorization/financeauth/customerauthorization/:id', redirect, require(__dirname+ '/router/authorization/customerauth'));
	app.get('/authorization/purchasingauth', redirect, require(__dirname+ '/router/authorization/purchasing'));
	app.get('/authorization/inventoryauth', redirect, require(__dirname+ '/router/authorization/inventory'));

	//Report
	app.get('/salesreport', redirect, require(__dirname + '/router/report/sales/salesreport'));
	app.get('/salesreport/dooutstanding', redirect, require(__dirname + '/router/report/sales/dooutstandingreport'));
	app.get('/salesreport/so', redirect, require(__dirname + '/router/report/sales/salesorderreport'));
	app.get('/salesreport/creditinvoice', redirect, require(__dirname + '/router/report/sales/creditinvoicereport'));
	app.get('/salesreport/quotation', redirect, require(__dirname + '/router/report/sales/quotationreport'));
	app.get('/salesreport/accountreceivables', redirect, require(__dirname + '/router/report/sales/accountreceivablesreport'));
	app.get('/salesreport/itemsold', redirect, require(__dirname + '/router/report/sales/itemsoldreport'));
	app.get('/salesreport/selling', redirect, require(__dirname + '/router/report/sales/sellingreport'));
	app.get('/salesreport/customersaldo', redirect, require(__dirname + '/router/report/sales/customersaldoreport'));

	app.get('/purchasingreport', redirect, require(__dirname + '/router/report/purchasing/purchasingmodule' ));
	app.get('/purchasingreport/purchasingcontract', redirect, require(__dirname + '/router/report/purchasing/purchasingcontractreport'));
	app.get('/purchasingreport/warehousereorder', redirect, require(__dirname + '/router/report/purchasing/warehousereorderreport'));
	app.get('/purchasingreport/purchaseorder', redirect, require(__dirname + '/router/report/purchasing/purchasingorderreport'));
	app.get('/purchasingreport/purchase', redirect, require(__dirname + '/router/report/purchasing/poreport'));
	app.get('/purchasingreport/purchasecontract', redirect, require(__dirname + '/router/report/purchasing/purchasecontractreport'));
	app.get('/purchasingreport/allpurchasingreport', redirect, require(__dirname + '/router/report/purchasing/allpurchasingreport'));

	app.get('/inventoryreport', redirect, require(__dirname+ '/router/report/inventory/inventorymodule'));
	app.get('/inventoryreport/warehousestockminus', redirect, require(__dirname + '/router/report/inventory/warehousestockminus'));
	app.get('/inventoryreport/warehouseactivity', redirect, require(__dirname + '/router/report/inventory/warehouseactivity'));
	app.get('/inventoryreport/warehousestock', redirect, require(__dirname+ '/router/report/inventory/warehousestock'));
	app.get('/inventoryreport/warehousemutation', redirect, require(__dirname+ '/router/report/inventory/warehousemutation'));

	app.get('/financereport', redirect, require(__dirname+ '/router/report/finance/financemodule'));
	app.get('/financereport/income', redirect, require(__dirname+ '/router/report/finance/incomereport'));
	app.get('/financereport/customercredit', redirect, require(__dirname+ '/router/report/finance/customercreditreport'));
	app.get('/financereport/customercreditanalysis', redirect, require(__dirname+ '/router/report/finance/customercreditanalysisreport'));
	app.get('/financereport/paymentdisbursement', redirect, require(__dirname+ '/router/report/finance/paymentdisbursementreport'));
	app.get('/financereport/piutangcustomer', redirect, require(__dirname + '/router/report/finance/piutangcustomerreport'));
	app.get('/financereport/agingpiutang', redirect, require(__dirname + '/router/report/finance/agingpiutangreport'));
	app.get('/financereport/giroduedate', redirect, require(__dirname+ '/router/report/finance/giroduedatereport'));
	app.get('/financereport/accountreceivablesdailyreport', redirect, require(__dirname+ '/router/report/finance/accountreceivablesdailyreport'));
	app.get('/financereport/debtreport', redirect, require(__dirname+ '/router/report/finance/debtreport'));

	//settings
	app.get('/user/settings', redirect, require(__dirname+'/router/settings'));

	//user management
	app.get('/usermanagement', redirect, require(__dirname+'/router/usermanagement'));
	app.get('/usermanagement/createnewuser', redirect, require(__dirname+'/router/createnewuser'));
	app.get('/usermanagement/updateuserdata/:id', redirect, require(__dirname+'/router/updateuserdata'));

	return app;
})();
