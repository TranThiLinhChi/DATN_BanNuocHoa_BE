import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent extends BaseComponent implements OnInit {
  menus:any;
  menus1:any;
  public customers: any;
  public customer: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;
  public showUpdateModal:any;
  public isCreate:any;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tenkh': [''],
      'email': [''],
    });
  //  this._api.get('/api/loaisp/get-menu').takeUntil(this.unsubscribe).subscribe(res => {
  //   this.menus = res;
  //  });
  //  this._api.get('/api/thuonghieu/get-brand').takeUntil(this.unsubscribe).subscribe(res => {
  //   this.menus1 = res;
  // });

   this.search();
  }


  loadPage(page) {
    this._api.post('/api/khachhang/search-customer',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.customers = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });

  }

  search() {
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/khachhang/search-customer',{page: this.page, pageSize: this.pageSize, tenkh: this.formsearch.get('tenkh').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.customers = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }



  get f() { return this.formdata.controls; }
//form này lúc ấn submit thôi
  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    }
    if(this.isCreate) {
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
      //  let data_image = data == '' ? null : data;
        let tmp = {
          // anh:data_image,
         //  masp:Number.parseInt(value.masp),
           tenkh:value.tenkh,
           diachi:value.diachi,
           sdt:value.sdt,
           email:value.email,
           pw:value.pw,
          };

        this._api.post('/api/khachhang/create-customer',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm khách hàng thành công');
          this.search();
          this.closeModal();
          });

      });
    } else {
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
      //  let data_image = data == '' ? null : data;
        let tmp = {
          tenkh:value.tenkh,
           diachi:value.diachi,
           sdt:value.sdt,
           email:value.email,
           pw:value.pw,
           makh:this.customer.makh,
          };
        this._api.post('/api/khachhang/update-customer',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhậtkhách hàng thành công');
          this.search();
          this.closeModal();
          });
      });
    }

  }

  onDelete(row) {
    this._api.post('/api/khachhang/delete-customer',{makh:row.makh}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa khách hàng thành công');
      this.search();
      });
  }

  Reset() {
    this.customer = null;
    this.formdata = this.fb.group({
      'tenkh': ['', Validators.required],
      'diachi': ['', Validators.required],
      'sdt': ['', Validators.required],
      'email': ['', Validators.required],
      'pw': ['',Validators.required],
    }, {
    });
  }
// đây này lúc khởi tao form thêm không có trường id nên nó k nhận ra là đúng rồi

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.customer = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
      'tenkh': [],
     // 'masp': ['',Validators.required],
     'diachi': ['', Validators.required],
     'sdt': ['', Validators.required],
     'email': ['', Validators.required],
     'pw': ['',Validators.required],
      }, {
      });
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/khachhang/get-by-id/'+ row.makh).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.customer = res;

          this.formdata = this.fb.group({
            'tenkh': [this.customer.tenkh,Validators.required],
            'diachi': [this.customer.diachi,Validators.required],
            'sdt': [this.customer.sdt,Validators.required],
            'email': [this.customer.email,Validators.required],
            'pw': [this.customer.pw,Validators.required],
          }, {

          });
          this.doneSetupForm = true;
        });
    }, 700);
  }

  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }
}
