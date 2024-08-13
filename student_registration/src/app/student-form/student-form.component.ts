import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.css']
})
export class StudentFormComponent implements OnInit{

  studentForm: FormGroup;
  students: any[] = [];
  courses: string[] = ['Math', 'Science', 'Literature', 'History'];
  hobbies: string[] = ['Reading', 'Sports', 'Music', 'Traveling'];
  isUpdate: boolean = false;
  currentIndex: number | null = null;
  filteredData: string[] = [];
  searchQuery: string = '';
  fileError: string = '';
  selectedFile: File | null = null;


  constructor(private fb: FormBuilder,private toastr:ToastrService,private http:HttpClient) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18)]],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      course: ['', Validators.required],
      hobbies: [''],
      filePath: [''] 
    });
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      // Assuming you want to validate the file size or type, you can do it here
      if (this.selectedFile.size > 1048576) { // 1MB limit
        this.fileError = 'File size exceeds 1MB.';
        this.selectedFile = null;
      } else {
        this.fileError = '';
        this.studentForm.patchValue({ filePath: this.selectedFile.name }); // Store the file name or path
      }
    }
  }


 

  onSubmit() {

    if (!this.studentForm.valid) {
      console.log('form is invalid bro..')
    this.showAlert();
    }

    const studentData = this.studentForm.value;
    if (this.isUpdate && this.currentIndex !== null) {
      this.students[this.currentIndex] = studentData;
      this.isUpdate = false;
      this.currentIndex = null;
      localStorage.setItem('users', JSON.stringify(this.students));
      this.showInfo();

    } else {
      this.students.push(studentData);
      localStorage.setItem('users',JSON.stringify(this.students));
      this.http.post('https://employeeform-12-default-rtdb.firebaseio.com/employees.json',this.students).subscribe((res)=>{
        console.log('Data:',res);
      })
      this.showSuccess();
    }
    this.studentForm.reset();
  }

  onEdit(index: number) {
    console.log('index is basically :: ',index)
    this.studentForm.patchValue(this.students[index]);
    this.isUpdate = true;
    this.currentIndex = index;
  }

  showSuccess(): void {
    this.toastr.success('Data saved successfully!', 'Success');
  }

  showInfo() :void {
    this.toastr.info('Data Updated Successfully : ')
  }

  safeDelete() : void {
    this.toastr.info('So The Data is Safe Thank You :)')
  }

  showDelete() :void {
    this.toastr.error('Data Deleted successfully: ');
  }

  showAlert() :void {
    this.toastr.warning('Please Fill Valid Details');
  }

  onDelete(index: number) {

    const res = confirm('are You Sure Want to Delete the Data');
    if(res === true)
    { 
    this.students.splice(index, 1);
    this.isUpdate = false;
    this.currentIndex = null;
    localStorage.setItem('users', JSON.stringify(this.students));
    this.showDelete();
    }
    else{
      this.safeDelete();
    }
  }

  ngOnInit(): void {
    const storedStudents = localStorage.getItem('users');
    if (storedStudents) {
      this.students = JSON.parse(storedStudents);
    }
  }

}


