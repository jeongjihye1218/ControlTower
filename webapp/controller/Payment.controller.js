sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("ControlTower.controller.Payment", {

		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel({
				previewText: ""
			});
			this.getView().setModel(oModel);

		},

		onTabSelect: function(oEvent) {
			var sSelectedKey = oEvent.getParameter("key");
			if (sSelectedKey === "preview") {
				this.updatePreview();
			}
		},

		updatePreview: function() {

			var sRemark = this.getView().byId("idRemark").getValue();
			this.getView().getModel().setProperty("/previewText", sRemark);
		},

		onPressButton1: function() {
			// 임시기안문 전송 기능 추가
		},

		onApprovalStatusPress: function() {

			// var oModel = this.getView().getModel("ZPJ_PAYMENT_SRV"); // OData 모델 가져오기
			// var sPath = "/ZApprid_numcSet"; // 엔티티 세트의 경로
			var oModel = this.getOwnerComponent().getModel("ZPJ_PAYMENT_SRV");
			var sPath = "/ZApprid_numcSet";
	
			// OData 모델을 통해 데이터를 읽어옴
			oModel.read(sPath, {
				success: function(oData, response) {
					// 성공적으로 데이터를 가져왔을 때 실행되는 로직

					// 가져온 데이터를 원하는 대로 처리
					// 예: 데이터를 로컬 모델에 저장하거나 UI에 바인딩
					var oLocalModel = new sap.ui.model.json.JSONModel(oData.results);
					this.getView().setModel(oLocalModel, "localModel");
					
					oData.results.forEach(function(item){
						this.getView().byId("idApprovalKey").setValue(item.AppridNumc);
					}.bind(this));
					
				    // console.log("TEST", oLocalModel.getData("AppridNumc"););
				}.bind(this), // this를 유지하기 위해 bind 사용

				error: function(oError) {
					// 요청이 실패했을 때 실행되는 로직
					console.log("Error:", oError);
				}
			});

			// 결재상태 확인 기능 추가
		}

	});
});