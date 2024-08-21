sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/comp/valuehelpdialog/ValueHelpDialog",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller,JSONModel,ValueHelpDialog,Filter,FilterOperator) {
	"use strict";
	
	var MainoModel;
	
	return Controller.extend("ControlTower.controller.View1", {
		
		onInit: function () {
			
    	var sUrl = "/sap/opu/odata/sap/ZPJ_PAYMENT_SRV/";
    	var MainoModel = new sap.ui.model.odata.ODataModel(sUrl, true);
    	this.getView().setModel(MainoModel);
	
		},

        

		
		onVHKontrh: function(oEvent){
			console.log("aaaaaa");
			
	  var oInput = oEvent.getSource().getValue();
      var oValueHelpDialog = new ValueHelpDialog({
        title: "Select Value",
        supportMultiselect: true,
        supportRangesOnly: false,
        ok: function (oEvent) {
          var oSelectedItem = oEvent.getParameter("tokens")[0];
          if (oSelectedItem) {
            var sSelectedKey = oSelectedItem.getKey();
            var sSelectedText = oSelectedItem.getText();
            // 선택된 값을 Input 필드에 설정
            oInput.setValue(sSelectedText);
          }
          oValueHelpDialog.close();
        },
        cancel: function () {
          oValueHelpDialog.close();
        }
      });

      // 데이터 모델 설정
      //var oModel = new JSONModel({
      //  EntitySet: [
      //    { ID: "1", Name: "Item 1" },
      //    { ID: "2", Name: "Item 2" }
      //  ]
      //});
      
      //oValueHelpDialog.setModel(oModel);
      var oModel = this.getView().getModel();
      oValueHelpDialog.setModel(oModel);
	
      // 테이블 설정 및 데이터 바인딩
      var oTable = oValueHelpDialog.getTable();
      if (oTable.bindRows) {
        oTable.bindAggregation("rows", "/TpmShplSecAccGrpSet", new sap.ui.table.Row({
          cells: [
            new sap.m.Text({ text: "{CompanyCode}" }),
            new sap.m.Text({ text: "{SecAcctGrp}" })
          ]
        }));
      }
      
	console.log(oTable);
      // Value Help Dialog 열기
      oValueHelpDialog.open(oInput);		
		
		},
		
		// onSerch: function(oEvent){
		// 	alert("실행");
		// },
		
		onComboBoxChange: function(oEvent){
			var oSmartFilterBar = this.getView().byId("smartFilterBar");
    		var oComboBox = oEvent.getSource();
    		
    		var selectedKey = oComboBox.getSelectedKeys();
			// console.log(selectedKey);
    		
    		// 필터 데이터 업데이트
    		// var oFilterData = oSmartFilterBar.getFilterData();
    		var oFilterData = oSmartFilterBar.getFilterData() || {};
    		// oFilterData.ProductGbn = selectedKey; // 필터 데이터에 선택된 키를 설정
    		
    		if(oComboBox.getId().indexOf("AccountGb") != -1){
    			oFilterData.AccountGb = selectedKey; // 필터 데이터에 선택된 키를 설정
    		}
    		else if(oComboBox.getId().indexOf("ProductGbn") != -1){
    			oFilterData.ProductGbn = selectedKey; // 필터 데이터에 선택된 키를 설정
    		}
    		else if(oComboBox.getId().indexOf("DomesticGb") != -1){
    			oFilterData.DomesticGb = selectedKey; // 필터 데이터에 선택된 키를 설정
    		}
    		
    		// SmartFilterBar에 필터 데이터 설정
    		oSmartFilterBar.setFilterData(oFilterData,true); //true 설정시 강제 업데이트

		},
		
		onComboTest: function(oEvent){
			
		},
		
		onBeforeRebindTable: function (oEvent) {
            var oSmartFilterBar = this.byId("smartFilterBar");
            var oDateValue = this.byId("Bdate").getDateValue(); // DatePicker의 값을 가져옴
			
			// var oFilterData = oSmartFilterBar.getFilterData() || {};
			
   //         if (oDateValue) {
   //             // DatePicker 값을 SmartFilterBar 필터에 설정
   //             // oSmartFilterBar.getFilters()[0].setValue(oDateValue); // 적절한 필터 인덱스 설정 필요
   //             oFilterData.Bdate = oDateValue;
   //             oSmartFilterBar.setFilterData(oFilterData,true); //true 설정시 강제 업데이트
   //             alert("msg");
   //         }
            
            if (oDateValue) {
        		var oBindingParams = oEvent.getParameter("bindingParams");
        		var oFilter = new Filter("Bdate", FilterOperator.EQ, oDateValue);
        		oBindingParams.filters.push(oFilter);
            }
        },
		
		onAddButton: function(oEvent){
			    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

    		    if (oRouter) {
        			oRouter.navTo("Payment");
    			} else {
        			console.error("Router not found.");
    			}
    			
		}
		
	});
});