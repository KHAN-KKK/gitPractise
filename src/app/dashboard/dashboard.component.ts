import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormBuilder],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  myForm !:FormGroup ;

  constructor(private fb : FormBuilder){}

  ngOnInit(){
    this.initForm();
  }

  initForm(){
    this.myForm = this.fb.group({
      name : [null, Validators.required],
      age : [null, Validators.required]
    });
  }

  onSubmit(){
    console.log('clicked save');
  }
}
