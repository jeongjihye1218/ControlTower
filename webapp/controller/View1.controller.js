sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/comp/valuehelpdialog/ValueHelpDialog",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/core/UIComponent",
	"sap/ui/core/Fragment",
	"sap/m/MessageBox"
], function(Controller,JSONModel,ValueHelpDialog,Filter,FilterOperator,UIComponent,Fragment,MessageBox) {
	"use strict";

	var MainoModel;

	return Controller.extend("ControlTower.controller.View1", {

		onInit: function() {

			var sUrl = "/sap/opu/odata/sap/ZPJ_PAYMENT_SRV/";
			MainoModel = new sap.ui.model.odata.ODataModel(sUrl, true);
			this.getView().setModel(MainoModel);

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
    		oRouter.getRoute("View1").attachMatched(this.onRouteMatched, this);
		},
		
		onRouteMatched: function(oEvent){
			  // Smart Table의 ID를 사용하여 테이블 객체를 가져옵니다.
			  var oSmartTable = this.byId("smartTable01");

			  if (oSmartTable) {
			      // Smart Table을 새로고침합니다.
			      oSmartTable.rebindTable();
			  }			
		},

		onVHKontrh: function(oEvent) {
			console.log("aaaaaa");

			var oInput = oEvent.getSource().getValue();
			var oValueHelpDialog = new ValueHelpDialog({
				title: "Select Value",
				supportMultiselect: true,
				supportRangesOnly: false,
				ok: function(oEvent) {
					var oSelectedItem = oEvent.getParameter("tokens")[0];
					if (oSelectedItem) {
						var sSelectedKey = oSelectedItem.getKey();
						var sSelectedText = oSelectedItem.getText();
						// 선택된 값을 Input 필드에 설정
						oInput.setValue(sSelectedText);
					}
					oValueHelpDialog.close();
				},
				cancel: function() {
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
						new sap.m.Text({
							text: "{CompanyCode}"
						}),
						new sap.m.Text({
							text: "{SecAcctGrp}"
						})
					]
				}));
			}

			console.log(oTable);
			// Value Help Dialog 열기
			oValueHelpDialog.open(oInput);

		},

		// onSerch: function(oEvent){
		// 	// alert("실행");
		// },

		// onComboBoxChange: function(oEvent) {
		// 	var oSmartFilterBar = this.getView().byId("smartFilterBar");
		// 	var oComboBox = oEvent.getSource();

		// 	var selectedKey = oComboBox.getSelectedKeys();
		// 	// console.log(selectedKey);

		// 	// 필터 데이터 업데이트
		// 	// var oFilterData = oSmartFilterBar.getFilterData();
		// 	var oFilterData = oSmartFilterBar.getFilterData() || {};
		// 	// oFilterData.ProductGbn = selectedKey; // 필터 데이터에 선택된 키를 설정

		// 	if (oComboBox.getId().indexOf("AccountGb") != -1) {
		// 		oFilterData.AccountGb = selectedKey; // 필터 데이터에 선택된 키를 설정
		// 	} else if (oComboBox.getId().indexOf("ProductGbn") != -1) {
		// 		oFilterData.ProductGbn = selectedKey; // 필터 데이터에 선택된 키를 설정
		// 	} else if (oComboBox.getId().indexOf("DomesticGb") != -1) {
		// 		oFilterData.DomesticGb = selectedKey; // 필터 데이터에 선택된 키를 설정
		// 	}

		// 	// SmartFilterBar에 필터 데이터 설정
		// 	oSmartFilterBar.setFilterData(oFilterData, true); //true 설정시 강제 업데이트

		// },


		// onAfterRendering: function() {
		// 	var oSmartTable = this.getView().byId("smartTable01");
		// 	var oTable = oSmartTable.getTable(); // SmartTable 내부의 Table 객체 가져오기

		// 	if (oTable) {
		// 		// sap.ui.table.Table에서 단일 선택 모드 설정
		// 		oTable.setMode("MultiSelect");
		// 		// 이벤트 핸들러가 중복 등록되지 않도록 기존 핸들러를 먼저 제거한 후 다시 추가
		// 		oTable.detachSelectionChange(this.onSelectionChange, this);
		// 		oTable.attachSelectionChange(this.onSelectionChange, this);
		// 	}
		// },

		onSelectionChange: function(oEvent) {

			var oTable = oEvent.getSource(); // 이벤트 소스에서 테이블을 가져옴
			var aSelectedItems = oTable.getSelectedItems(); // 선택된 항목 배열 가져오기

			if (aSelectedItems.length > 0) {
				// 첫 번째 선택된 항목의 바인딩 컨텍스트 가져오기
				var oSelectedItemContext = aSelectedItems[0].getBindingContext();
				console.log("oSelectedItemContext: ", oSelectedItemContext);

				if (oSelectedItemContext) {
					this._selectedItem = oSelectedItemContext.getObject(); // 바인딩된 데이터 객체 가져오기
				} else {
					console.warn("선택된 항목의 바인딩 컨텍스트를 가져올 수 없습니다.");
					this._selectedItem = null;
				}
			} else {
				this._selectedItem = null; // 선택된 항목이 없으면 null로 설정
				console.log("선택된 항목이 없습니다.");
			}
		},

		onBeforeRebindTable: function(oEvent) {
			var oSmartFilterBar = this.byId("smartFilterBar");
			// var oDateValue = this.byId("Bdate").getDateValue(); // DatePicker의 값을 가져옴
			var oDateValue = this.byId("Bdate").getValue();

			if (oDateValue) {

				var oBindingParams = oEvent.getParameter("bindingParams");
				var oFilter = new Filter("Bdate", FilterOperator.EQ, oDateValue);
				oBindingParams.filters.push(oFilter);
			}
			
			this.onMultiComboBox("AccountGb", oEvent);
			this.onMultiComboBox("ProductGbn", oEvent);
			this.onMultiComboBox("DomesticGb", oEvent);
		},
		
		onMultiComboBox: function(id,oEvent){
			var oMultiComboBox = this.byId(id);
			var aSelectedItems = oMultiComboBox.getSelectedItems(); 
			
			if(aSelectedItems) {
				aSelectedItems.forEach(function(oItem) {
  
    			var oBindingParams = oEvent.getParameter("bindingParams");
    			var oFilter = new Filter(id, FilterOperator.EQ, oItem.getKey());
    			oBindingParams.filters.push(oFilter);
				});
			}
		},

		onAddButton: function(oEvent) {
			// var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			// if (oRouter) {
			// 	oRouter.navTo("Payment");
			// } else {
			// 	console.error("Router not found.");
			// }
			// console.log("this._selectedItem : " + this._selectedItem);
			if (this._selectedItem) {
				// 선택된 데이터를 전역 모델에 설정

				var oRouter = UIComponent.getRouterFor(this);
				// JSON 데이터를 문자열로 변환 후 URI 인코딩
				var sData = encodeURIComponent(JSON.stringify(this._selectedItem));
				// console.log("kim : " + sData);
				oRouter.navTo("Payment", {
					data: sData
				});
			} else {
				sap.m.MessageToast.show("먼저 하나의 행을 선택하세요.");
			}

    		    if (oRouter) {
        			oRouter.navTo("Payment");
    			} else {
        			console.error("Router not found.");
    			}
    			
		},
		
		onPressLink: function(oEvent){
			// 클릭된 링크의 컨텍스트 얻기
    		var oSource = oEvent.getSource(); // 클릭된 Link 컨트롤
    		var oContext = oSource.getBindingContext(); // 클릭된 행의 바인딩 컨텍스트

    		// 선택한 링크의 필드 값 얻기
    		var sSelectedValue = oContext.getProperty("DealNumber");

			console.log("Dealnumber:", sSelectedValue);

    		// 비동기 서비스 호출
    		sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function(oService) {
        		// URL 생성
        		var sHref = oService.hrefForExternal({
            	target: {
                	semanticObject: "Z_BDTRAN",
                	action: "display"
            	},
            	params: {
                	"DealNumber": sSelectedValue
            	}
        		});

        		// URL을 사용하여 네비게이션	
        		if (sHref) {
            		// 예: 브라우저에서 URL 열기
            		window.open(sHref, "_blank");
        		}
    		}).catch(function(oError) {
        		// 오류 처리
        		console.error("Failed to generate URL:", oError);
    		});

		},
		
		onDocButton: function(oEvent){
			
			// SmartTable 객체 가져오기
			var oSmartTable = this.getView().byId("smartTable01");
			// 내부 테이블 객체 가져오기
			var oTable = oSmartTable.getTable();
			
			var dealNumber; // 거래번호
			
			var bdate; // 전기일
			var securityId; // 유가증권 클래스
			var securityAccount; //유가증권 계정
			var rportb; //포트폴리오
			var accountGroup; // 유가증권 계정그룹			
			
			var P_BD; //채권
			var P_ST; //주식
			var P_OS; //수익증권
			var P_MM; //현금자산
			var P_SW; //SWAP
			var P_FX; //FX
			var P_DERI; //기타파생상품
			var P_LO; //대출
			var P_SA; //발행사채
			
			
			if (oTable instanceof sap.m.Table) {
			    // 선택된 항목 가져오기
			    var aSelectedItems = oTable.getSelectedItems();
				
				
				
			    if (aSelectedItems.length > 0) {
			        // 선택된 각 항목을 반복 처리
			        aSelectedItems.forEach(function(oSelectedItem) {
			            // 컨텍스트 경로 가져오기
			            var oContext = oSelectedItem.getBindingContext(); 
			            // 특정 컬럼 데이터 가져오기
    					 dealNumber = oContext.getProperty("DealNumber");			
						 bdate = oContext.getProperty("Bdate");
						 securityId = oContext.getProperty("SecurityId");
						 securityAccount = oContext.getProperty("SecurityAccount");
						 rportb = oContext.getProperty("Rportb");
						 accountGroup = oContext.getProperty("AccountGroup");
						var productGbnTxt =  oContext.getProperty("ProductGbnTxt");
						 
						 switch(productGbnTxt){
						 	case "채권": P_BD = "X"; break;
							case "주식": P_ST = "X"; break;
							case "수익증권": P_OS = "X"; break;										
							case "현금자산": P_MM = "X"; break;		
							case "SWAP": P_SW = "X"; break;		
							case "FX": P_FX = "X"; break;		
							case "대출": P_LO = "X"; break;
							case "발행사채": P_SA = "X"; break;		
							case "장내파생": P_DERI = "X"; break;
						 }
						 
						 //if(productGbnTxt === "채권"){
						 //	P_BD = "X";
						 //} else if(productGbnTxt === "주식"){
						 //	P_ST = "X";
						 //} else if(productGbnTxt === "수익증권"){
						 //	P_OS = "X";
						 //} else if((productGbnTxt === "수익증권"){
						 	
						 //}
			        });
			    }
			    
			    bdate = this.onDateFomat(bdate);

    			sap.ushell.Container.getServiceAsync("CrossApplicationNavigation").then(function(oService) {
        			// URL 생성
        		var sHref = oService.hrefForExternal({
            		target: {
                		semanticObject: "Z_DOCUMENT",
                		action: "create"
            		},
            		params: {
            			"P_BD": P_BD,
            			"P_ST": P_ST,
            			"P_OS": P_OS,
            			"P_DERI": P_DERI,
            			"P_MM": P_MM,
            			"P_SW": P_SW,
            			"P_FX": P_FX,
            			"P_LO": P_LO,
            			"P_SA": P_SA,
            			
            			"SO_ADATE-LOW": bdate ,
            			"SO_DEAL-LOW": dealNumber,
            			"SO_SECID-LOW": securityId, //종목ID(유가증권클래스 ID)
                		// "DealNumber": dealNumberValue
                		// "Bdate": bdateValue,
                		// "SecurityId": securityIdValue
                		
                		"SO_SECAC-LOW": securityAccount, // 유가증권 계정
                		"SO_RPORT-LOW": rportb, // 계정구분(포트폴리오)
                		"SO_ACGRP-LOW": accountGroup //운용펀드(유가증권 계정그룹)
            		},
            		bAsync: true 
        		});

        		// URL을 사용하여 네비게이션	
        		if (sHref) {
            		// 예: 브라우저에서 URL 열기
            		window.open(sHref, "_blank");
        		}
    		});
			}

		},
		
		onDateFomat: function(date){
			var oDate = new Date(date); 


			var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "yyyy.MM.dd"});
			var sFormattedDate = oDateFormat.format(oDate); 
			
			return sFormattedDate;
		},
		
		onDialogOpen: function(oId) {
			var oView = this.getView();
			var oDialog = oView.byId(oId);

			oDialog.open();
		},		
		
		onConfButton: function(oEvent){
			if (this._selectedItem) {
				if (this._selectedItem.ProcessTxt == "확정") {
					sap.m.MessageToast.show("거래 상태를 확인하세요.");
				}
				else {
					 this.onDialogOpen("ConfnDialogId");
				}
			} else {
				sap.m.MessageToast.show("확정할 행을 선택하세요.");
			}			
		},
		
        onConfirmOk: function (oEvent) {
            // 확인 버튼 로직 추가
            var DealNumber = this._selectedItem.DealNumber;
           
			var Bdate = new Date(this._selectedItem.Bdate); 
			Bdate = Bdate.toISOString().slice(0, 19);  // ISO 8601 형식으로 변환 & 밀리초와 'Z' 제거 >> '2008-01-30T00:00:00'

			var oEntry = {};
			var sPath = "/ZPaymentSelSet(Bdate=datetime'"+Bdate+"',DealNumber='" + DealNumber + "')";

			MainoModel.read(sPath, {
				success: function(oData, response) {
					oEntry = {
						Prdgrp: oData.Prdgrp,
						ConfirmCode: "C"
					};
				},
				error: function(oError) {
					var lvErrTxt = oError.message;
					sap.m.MessageToast.show(lvErrTxt);
				},
				async: false
			});
			
			if(Object.keys(oEntry).length > 0){
				MainoModel.update(sPath, oEntry,{
					success: function(oData, response) {
						MessageBox.success("확정되었습니다.");
					},
					error: function(oError) {
						var lvErrTxt = oError.message;
						sap.m.MessageToast.show(lvErrTxt);
					},
					
					async: false
				});
			}

			var oDialog = oEvent.getSource().getParent();  // Dialog를 가져옵니다.
			oDialog.close();  // Dialog를 닫습니다.
			
        },

        onConfirmCanc: function (oEvent) {
            var oDialog = oEvent.getSource().getParent(); 
            oDialog.close(); 
        },
        
        onConfCancButton: function(oEvent){
			if (this._selectedItem) {
				if (this._selectedItem.ProcessTxt == "생성") {
					sap.m.MessageToast.show("거래 상태를 확인하세요.");
				}
				else {
					 this.onDialogOpen("ConfCancDialogId");
				}
			} else {
				sap.m.MessageToast.show("취소할 행을 선택하세요.");
			}
        },
        
        onConfCancOk: function(oEvent){
        	var DealNumber = this._selectedItem.DealNumber;
        	var Bdate = new Date(this._selectedItem.Bdate);
        	Bdate = Bdate.toISOString().slice(0, 19); 
        	
        	var oEntry = {};
        	var sPath = "/ZPaymentSelSet(Bdate=datetime'"+Bdate+"',DealNumber='" + DealNumber + "')";
        	
        	MainoModel.read(sPath, {
        		success: function(oData, response){
        			oEntry = {
        				Prdgrp: oData.Prdgrp,
        				ConfirmCode: "X"
        			};
        		},
        		async: false
        	});
        	
        	if(Object.keys(oEntry).length > 0){
        		MainoModel.update(sPath, oEntry,{
        			success: function(oData, response){
        				MessageBox.success("확정취소되었습니다.");
        			},
        			error: function(oError){
        				var lvErrtxt = oError.message;
        				sap.m.MessageToast.show(lvErrtxt);
        			},
        			async: false
        		});
        	}
        	
      
        	var oDialog = oEvent.getSource().getParent();        	
        	oDialog.close();
        },
        
        onConfCancCanc: function(oEvent){
        	var oDialog = oEvent.getSource().getParent();
        	oDialog.close();
        }
   

        

	});
});
