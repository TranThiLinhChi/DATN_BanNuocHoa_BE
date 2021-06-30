import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent extends BaseComponent implements OnInit {
  menus:any;
  menus1:any;
  public products: any;
  public product: any;
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
      'tensp': [''],
      'dongia': [''],
    });
    this._api.get('/api/loaisp/get-menu').takeUntil(this.unsubscribe).subscribe(res => {
      this.menus = res;
    });
    this._api.get('/api/thuonghieu/get-brand').takeUntil(this.unsubscribe).subscribe(res => {
      this.menus1 = res;
    });

   this.search();
  }


  loadPage(page) {
    this._api.post('/api/sanpham/search-product',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.products = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });

  }

  search() {
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/sanpham/search-product',{page: this.page, pageSize: this.pageSize, tensp: this.formsearch.get('tensp').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.products = res.data;
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
        let data_image = data == '' ? null : data;
        let tmp = {
           anh:data_image,
         //  masp:Number.parseInt(value.masp),
           tensp:value.tensp,
           maloai:value.maloai,
           mathuonghieu:value.mathuonghieu,
           mota:value.mota,
           xuatxu:value.xuatxu,
           phongcach:value.phongcach,
           soluong:Number.parseInt(value.soluong),
           dongia: +value.dongia,
           gianhap:+value.gianhap,
           namsx:Number.parseInt(value.namsx),
           dungtich:Number.parseInt(value.dungtich),
           status:value.status,
          };

        this._api.post('/api/sanpham/create-product',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });

      });
    } else {
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          anh:data_image,
          tensp:value.tensp,
          maloai:value.maloai,
          mathuonghieu:value.mathuonghieu,
          mota:value.mota,
          xuatxu:value.xuatxu,
          phongcach:value.phongcach,
          soluong:Number.parseInt(value.soluong),
          dongia: +value.dongia,
          gianhap:+value.gianhap,
          namsx:Number.parseInt(value.namsx),
          dungtich:Number.parseInt(value.dungtich),
          status:value.status,
          masp:this.product.masp,
          };
        this._api.post('/api/sanpham/update-product',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }

  }

  onDelete(row) {
    this._api.post('/api/sanpham/delete-product',{masp:row.masp}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search();
      });
  }

  Reset() {
    this.product = null;
    this.formdata = this.fb.group({
      'tensp': ['', Validators.required],
      'masp': ['', Validators.required],
      'xuatxu': ['', Validators.required],
      'mota': ['', Validators.required],
      'maloai': ['',Validators.required,],
      'mathuonghieu': ['', Validators.required],
      'dongia': ['', [Validators.required]],
      'gianhap': ['', [Validators.required]],
      'soluong': ['', Validators.required],
      'namsx': ['', Validators.required],
      'phongcach':['',Validators.required],
      'dungtich':['',Validators.required],
      'status': ['', Validators.required],

    }, {

    });
  }
// đây này lúc khởi tao form thêm không có trường id nên nó k nhận ra là đúng rồi

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.product = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
      'tensp': [],
     // 'masp': ['',Validators.required],
      'xuatxu': ['',Validators.required],
      'mota': ['',Validators.required],
      'maloai': ['',Validators.required],
      'mathuonghieu': ['', Validators.required],
      'dongia': ['', Validators.required],
      'gianhap': ['', [Validators.required]],
      'soluong': ['', Validators.required],
      'namsx': ['', Validators.required],
      'phongcach':['',Validators.required],
      'dungtich':['',Validators.required],
      'status': ['', Validators.required],

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
      this._api.get('/api/sanpham/get-by-id/'+ row.masp).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.product = res;

          this.formdata = this.fb.group({
            'tensp': [this.product.tensp,Validators.required],
            'xuatxu': [this.product.xuatxu,Validators.required],
            'mota': [this.product.mota,Validators.required],
            'maloai': [this.product.maloai,Validators.required],
            'mathuonghieu': [this.product.mathuonghieu,Validators.required],
            'dongia': [this.product.dongia, Validators.required],
            'gianhap': [this.product.gianhap, Validators.required],
            'soluong': [this.product.soluong, Validators.required],
            'namsx': [this.product.namsx, Validators.required],
            'phongcach': [this.product.phongcach, Validators.required],
            'dungtich': [this.product.dungtich, Validators.required],
            'status': [this.product.status, Validators.required],
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
