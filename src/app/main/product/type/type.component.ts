import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.css']
})
export class TypeComponent extends BaseComponent implements OnInit {

  public categorys: any;
  public category: any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  public parent: 10;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'tenloai': [''],
    });
    
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/loaisp/search-category',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.categorys = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/loaisp/search-category',{page: this.page, pageSize: this.pageSize, tenloai: this.formsearch.get('tenloai').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.categorys = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }

  

  get f() { return this.formdata.controls; }

  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    } 
    if(this.isCreate) { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
            parent_maloai:this.parent,
            tenloai:value.tenloai,
                 
          };
        this._api.post('/api/loaisp/create-category',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          tenloai:value.tenloai,
           maloai:this.category.maloai,          
          };
        this._api.post('/api/loaisp/update-category',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/loaisp/delete-category',{maloai:row.maloai}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.category = null;
    this.formdata = this.fb.group({
      'tenloai': ['', Validators.required],
   
    }, {
    
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.category = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
      'tenloai': ['',Validators.required],


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
      this._api.get('/api/loaisp/get-by-id/'+ row.maloai).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.category = res; 
        
          this.formdata = this.fb.group({
            'tenloai': [this.category.tenloai,Validators.required],
            
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
