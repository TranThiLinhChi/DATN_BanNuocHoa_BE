import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-import-order',
  templateUrl: './import-order.component.html',
  styleUrls: ['./import-order.component.css']
})
export class ImportOrderComponent extends BaseComponent implements OnInit {
  hoadonnhap:any;
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
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tenNV': [''],
    });
    
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/hdn/search',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.orders = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/hdn/search',{page: this.page, pageSize: this.pageSize, tenNV: this.formsearch.get('tenNV').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.orders = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }

  

  get f() { return this.formdata.controls; }

  

  Reset() {  
    this.order = null;
    this.formdata = this.fb.group({
      'tenNV': ['', Validators.required],
      'dia_chi': ['', Validators.required],
      'sdt': ['', [Validators.required]],
      'ngaynhap': ['', Validators.required],
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
      'maHDN': ['', Validators.required],
      'tenNV': ['', Validators.required],
      'dia_chi': ['', Validators.required],
      'sdt': ['', [Validators.required]],
      'ngaynhap': ['', Validators.required],
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
      this._api.get('/api/hdn/get-by-id/'+ row.maHDN).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.order = res; 
          this.formdata = this.fb.group({
            'maHDN': [this.order.MaHDN, Validators.required],
            'tenNV': [this.order.tenNV, Validators.required],
            'dia_chi': [this.order.dia_chi, Validators.required],
            'sdt': [this.order.sdt, Validators.required],
            'ngaynhap': [this.order.ngaynhap, Validators.required],
          }); 
          this.doneSetupForm = true;
        }); 
    }, 700);
  }

  closeModal() {
    $('#createsanphamModal').closest('.modal').modal('hide');
  }
}
