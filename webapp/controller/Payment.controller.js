sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("ControlTower.controller.Payment", {
        
        onInit: function () {
            var oModel = new sap.ui.model.json.JSONModel({
                previewText: ""
            });
            this.getView().setModel(oModel);
            
        },
        
        onTabSelect: function (oEvent) {
            var sSelectedKey = oEvent.getParameter("key");
            if (sSelectedKey === "preview") {
                this.updatePreview();
            }
        },

        updatePreview: function () {
        
            var sRemark = this.getView().byId("idRemark").getValue();
            this.getView().getModel().setProperty("/previewText", sRemark);
        },

        onPressButton1: function () {
            // 임시기안문 전송 기능 추가
        },

        onApprovalStatusPress: function () {
            // 결재상태 확인 기능 추가
        }

    });
});