import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/observable/combineLatest';
import { Observable } from 'rxjs';
declare var $: any;
declare var Swal: any;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent  extends BaseComponent implements OnInit {

  public orders: any;
  public order: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  public parent: 1;
  status:any;
  term: string;
  p: number = 1;
  day: any;
  cols: any[];
  id: any;
  hidden = false;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'ho_ten': [''],
    });
   this.search();
   this.status = [
    { id: 1, name: "Đang xử lý" },
    { id: 2, name: "Đã xác thực" },
    { id: 3, name: "Đã giao hàng" },
    { id: 0, name: "Đã hủy" },
  ];
  }

  loadPage(page) { 
    this._api.post('/api/hdb/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.orders = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 
  filterBill(id: any) {
    Observable.combineLatest(this._api.get("api/hdb/get-by-status/" + id)).takeUntil(this.unsubscribe).subscribe(
    res => {
      this.orders= res[0];
    }

 )

  console.log(this.orders);
}
  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/hdb/search',{page: this.page, pageSize: this.pageSize, ho_ten: this.formsearch.get('ho_ten').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.orders = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }

  

  get f() { return this.formdata.controls; }

  

  Reset() {  
    this.order = null;
    this.formdata = this.fb.group({
      'ho_ten': ['', Validators.required],
      'dia_chi': ['', Validators.required],
      'sdt': ['', Validators.required],
      'order_total': ['', Validators.required],
    }, {
    
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.order = null;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this.formdata = this.fb.group({
      'ma_hoa_don': ['', Validators.required],
      'ho_ten': ['', Validators.required],
      'dia_chi': ['', Validators.required],
      'sdt': ['', [Validators.required]],
      'order_total': ['', Validators.required],
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createsanphamModal').modal('toggle');
      this._api.get('/api/hdb/get-chi-tiet-by-hoa-don/'+ row.ma_hoa_don).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.order = res; 
          this.formdata = this.fb.group({
            'ma_hoa_don': [this.order.ma_hoa_don, Validators.required],
            'ho_ten': [this.order.ho_ten, Validators.required],
            'dia_chi': [this.order.dia_chi, Validators.required],
            'sdt': [this.order.sdt, Validators.required],
            'order_total': [this.order.order_total, Validators.required],
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }
  deleteBill(id: any) {

    // $('#confirmModal').modal('toggle');
 
 Swal.fire({
   title: 'Bạn chắc chắn chứ?',
   text: "Bạn không thẩy khôi phục lại đơn hàng!",
   icon: 'warning',
   showCancelButton: true,
   confirmButtonColor: '#3085d6',
   cancelButtonColor: '#d33',
   confirmButtonText: 'Đúng, xóa ngay bây giờ!'
 }).then((result) => {
   if (result.isConfirmed) {
 
      Observable.combineLatest(
       this._api.get('api/hdb/delete-bill/' + id)).takeUntil(this.unsubscribe).subscribe(
         res => {
          // location.reload();
           this.orders = this.orders.filter(val => val.id != id);
         }
       );
 
     Swal.fire(
       'Đã xóa!',
       'Đơn hàng đã bị xóa!.',
       'success'
     );
   }
 })
    }
  
  changeStatus(id: any, msg: any) {
    console.log(msg);
     Observable.combineLatest(
      this._api.get('api/hdb/change-status/' + id + '/' +msg)).takeUntil(this.unsubscribe).subscribe(
        res => {
          $(document).Toasts('create', {
            class: 'bg-light',
            icon:'',
            title: 'Thành công!',
            subtitle: '',
           //delay: 10,
            fixed: false,
            body: 'Thay đổi trạng thái đơn hàng thành công!'
          });

            location.reload();



        }
      );
  }

  closeModal() {
    $('#createsanphamModal').closest('.modal').modal('hide');
  }
 
}
