import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css']
})
export class BrandComponent extends BaseComponent implements OnInit {

  public brands: any;
  public brand: any;
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
      'tenthuonghieu': [''],
    });
    
   
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/thuonghieu/search-brand',{page: page, pageSize: this.pageSize}).takeUntil(this.unsubscribe).subscribe(res => {
      this.brands = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/thuonghieu/search-brand',{page: this.page, pageSize: this.pageSize, tenthuonghieu: this.formsearch.get('tenthuonghieu').value}).takeUntil(this.unsubscribe).subscribe(res => {
      this.brands = res.data;
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
            parent_mathuonghieu:this.parent,
            tenthuonghieu:value.tenthuonghieu,
            mota:value.mota,
                 
          };
        this._api.post('/api/thuonghieu/create-brand',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
          });
      });
    } else { 
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          tenthuonghieu:value.tenthuonghieu,
          mota:value.mota,
           mathuonghieu:this.brand.mathuonghieu,          
          };
        this._api.post('/api/thuonghieu/update-brand',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
          });
      });
    }
   
  } 

  onDelete(row) { 
    this._api.post('/api/thuonghieu/delete-brand',{mathuonghieu:row.mathuonghieu}).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search(); 
      });
  }

  Reset() {  
    this.brand = null;
    this.formdata = this.fb.group({
      'tenthuonghieu': ['', Validators.required],
      'mota': ['', Validators.required],
   
    }, {
    
    }); 
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.brand = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
      'tenthuonghieu': ['',Validators.required],
      'mota': ['',Validators.required],


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
      this._api.get('/api/thuonghieu/get-by-id/'+ row.mathuonghieu).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.brand = res; 
        
          this.formdata = this.fb.group({
            'tenthuonghieu': [this.brand.tenthuonghieu, Validators.required],
            'mota': [this.brand.mota, Validators.required],
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

