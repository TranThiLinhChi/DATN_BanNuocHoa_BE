"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.OrderComponent = void 0;
var core_1 = require("@angular/core");
var base_component_1 = require("../../../common/base-component");
require("rxjs/add/observable/combineLatest");
require("rxjs/add/operator/takeUntil");
var rxjs_1 = require("rxjs");
var OrderComponent = /** @class */ (function (_super) {
    __extends(OrderComponent, _super);
    function OrderComponent(injector, messageService) {
        var _this = _super.call(this, injector) || this;
        _this.messageService = messageService;
        _this.p = 1;
        _this.hidden = false;
        return _this;
    }
    OrderComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.status = [
            { id: 1, name: "Đang xử lý" },
            { id: 2, name: "Đã xác thực" },
            { id: 3, name: "Đã giao hàng" },
            { id: 0, name: "Đã hủy" },
        ];
        // Lay danh sach don hang
        this.day = Date.now();
        rxjs_1.Observable.combineLatest(this._api.get('api/bill/get-bills')).takeUntil(this.unsubcribe).subscribe(function (res) {
            _this.list_order = res[0];
            console.log(_this.list_order);
            setTimeout(function () {
            });
        });
    };
    OrderComponent.prototype.exportExcel = function () {
        var _this = this;
        // this.messageService.add({severity:'success', summary:'Service Message', detail:'Via MessageService'});
        Promise.resolve().then(function () { return require("xlsx"); }).then(function (xlsx) {
            var worksheet = xlsx.utils.json_to_sheet(_this.list_order);
            var workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            var excelBuffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
            _this.saveAsExcelFile(excelBuffer, "list_order");
        });
    };
    OrderComponent.prototype.filterBill = function (id) {
        var _this = this;
        rxjs_1.Observable.combineLatest(this._api.get("api/bill/get-by-status/" + id)).takeUntil(this.unsubcribe).subscribe(function (res) {
            _this.list_order = res[0];
        });
        console.log(this.list_order);
    };
    OrderComponent.prototype.ViewDetail = function (id) {
        var _this = this;
        console.log(id);
        this.id = id;
        rxjs_1.Observable.combineLatest(this._api.get('api/bill/get-bill-detail/' + id)).takeUntil(this.unsubcribe).subscribe(function (res) {
            _this.order_detail = res[0];
            console.log(_this.order_detail);
            setTimeout(function () {
                $('#myBill').modal('toggle');
            });
        });
    };
    OrderComponent.prototype.deleteBill = function (id) {
        // $('#confirmModal').modal('toggle');
        var _this = this;
        Swal.fire({
            title: 'Bạn chắc chắn chứ?',
            text: "Bạn không thẩy khôi phục lại đơn hàng!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Đúng, xóa ngay bây giờ!'
        }).then(function (result) {
            if (result.isConfirmed) {
                rxjs_1.Observable.combineLatest(_this._api.get('api/bill/delete-bill/' + id)).takeUntil(_this.unsubcribe).subscribe(function (res) {
                    // location.reload();
                    _this.list_order = _this.list_order.filter(function (val) { return val.id != id; });
                });
                Swal.fire('Đã xóa!', 'Đơn hàng đã bị xóa!.', 'success');
            }
        });
    };
    OrderComponent.prototype.changeStatus = function (id, msg) {
        console.log(msg);
        rxjs_1.Observable.combineLatest(this._api.get('api/bill/change-status/' + id + '/' + msg)).takeUntil(this.unsubcribe).subscribe(function (res) {
            $(document).Toasts('create', {
                "class": 'bg-light',
                icon: '',
                title: 'Thành công!',
                subtitle: '',
                //delay: 10,
                fixed: false,
                body: 'Thay đổi trạng thái đơn hàng thành công!'
            });
            location.reload();
        });
    };
    OrderComponent = __decorate([
        core_1.Component({
            selector: 'app-order',
            templateUrl: './order.component.html',
            styleUrls: ['./order.component.css']
        })
    ], OrderComponent);
    return OrderComponent;
}(base_component_1.BaseComponent));
exports.OrderComponent = OrderComponent;
