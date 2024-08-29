sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/UIComponent"
], function(Controller, JSONModel, UIComponent) {
	"use strict";

	return Controller.extend("ControlTower.controller.Payment", {

		onInit: function() {
			var oModel = new sap.ui.model.json.JSONModel({
				previewText: "",
				selectedItem: {}
			});
			this.getView().setModel(oModel);

			var oRouter = UIComponent.getRouterFor(this);
			oRouter.getRoute("Payment").attachPatternMatched(this._onObjectMatched, this);

		},

		_onObjectMatched: function(oEvent) {

			// URL 파라미터에서 데이터를 가져옵니다.
			var sData = oEvent.getParameter("arguments").data;
			console.log("sejin:", sData);
			try {
				// 디코딩 후 JSON 파싱
				var oSelectedItem = JSON.parse(decodeURIComponent(sData));
				
				// 객체를 JSON 문자열로 변환하여 모델에 설정
				var sPreviewText = JSON.stringify(oSelectedItem, null, 2); // JSON 문자열로 변환 (보기 쉽게 들여쓰기 추가)
				console.log("받은 데이터:", sPreviewText);
				// 필요한 정보만 추출하여 초기 문자열 생성
				var sPreviewText = "포지션일자: " + (oSelectedItem.Bdate || "N/A") + "\n";
				sPreviewText += "상품구분: " + (oSelectedItem.ProductGbnTxt || "N/A") + "\n";
				sPreviewText += "운용부서: " + (oSelectedItem.DepartNm || "N/A") + "\n";
				sPreviewText += "종목명: " + (oSelectedItem.Bdate || "N/A") + "\n";
				sPreviewText += "거래번호: " + (oSelectedItem.DealNumber || "N/A") + "\n";
				sPreviewText += "수량: " + (oSelectedItem.LocalAmt || "N/A") + "\n";
				sPreviewText += "종목명: " + (oSelectedItem.RanlTxt || "N/A");

				// 데이터를 모델에 설정합니다.
				this.getView().getModel().setProperty("/previewData", sPreviewText);

				// 미리보기 탭 업데이트
				this.updatePreview();
			} catch (e) {
				console.error("데이터 파싱 오류:", e);
			}
		},

		onTabSelect: function(oEvent) {
			var sSelectedKey = oEvent.getParameter("key");
			if (sSelectedKey === "preview") {
				this.updatePreview();
			}
		},

		updatePreview: function() {
			
			//var sCurrentPreviewText = this.getView().getModel().getProperty("/previewData");
			var sRemark = this.getView().byId("idRemark").getValue();
			this.getView().getModel().setProperty("/information", sRemark);
			
			// if(sRemark){
			// 	sRemark = "기본정보 : " + sRemark;
			// 	sCurrentPreviewText += sRemark;
			// }else
			
			// if (sCurrentPreviewText) {
			// 	var sRemark = this.getView().byId("idRemark").getValue();

			// 	sRemark = "결재리턴Key : " + sRemark;
			// 	sRemark = sCurrentPreviewText + sRemark;
			// } else {
			// 	this.getView().getModel().setProperty("/previewText", sRemark);
			// }
		},

		onPressButton1: function() {
			// 임시기안문 전송 기능 추가
		},

		onApprovalStatusPress: function() {

			// var oModel = this.getView().getModel("ZPJ_PAYMENT_SRV"); // OData 모델 가져오기
			// var sPath = "/ZApprid_numcSet"; // 엔티티 세트의 경로
			// var oModel = this.getOwnerComponent().getModel("ZPJ_PAYMENT_SRV");
			
			var oModel = new sap.ui.model.odata.v2.ODataModel("/sap/opu/odata/sap/ZPJ_PAYMENT_SRV/");
			var sPath = "/ZApprid_numcSet";

			// OData 모델을 통해 데이터를 읽어옴
			oModel.read(sPath, {
				success: function(oData, response) {
					// 성공적으로 데이터를 가져왔을 때 실행되는 로직

					// 가져온 데이터를 원하는 대로 처리
					// 예: 데이터를 로컬 모델에 저장하거나 UI에 바인딩
					var oLocalModel = new sap.ui.model.json.JSONModel(oData.results);
					this.getView().setModel(oLocalModel, "localModel");

					oData.results.forEach(function(item) {
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