import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MultiSelectModule} from 'primeng/multiselect';
import {ButtonModule} from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MultiSelectModule,InputSwitchModule,  ReactiveFormsModule,ButtonModule, CommonModule,FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  
  dropdowns : any = [];
  selectedDropdowns: any[] = [];
  myForm !: FormGroup ;

  searchText: string = '';

  constructor(private fb : FormBuilder){}

  ngOnInit(){
    this.initForm();
    
    this.loadData();
    this.intializeFormArray();
    this.onSelectionChange();

    console.log(this.agentConfigs);
  }

  loadData(){
    this.dropdowns = [ {         
      "id": 1,
      "configCode": "outbound-call-prefixes",
      "configValue": "9,8,*00",
      "originalValue": "9,8,*00",
      "description": null
    }, {
      "id": 2,
      "configCode": "default-country-code",
      "configValue": "AE",
      "originalValue": "AE",
      "description": null
    },  {
      "id": 3,
      "configCode": "default-call-prefix",
      "configValue": "1", 
      "originalValue": "9", 
      "description": null
    },  {
      "id": 4,
      "configCode": "DEFAULTVDN",
      "configValue": "0",
      "originalValue": "Default Vdn",
      "description": null
    }, {
      "id": 5,
      "configCode": "DN",
      "configValue": "true",
      "originalValue": "Vdn",
      "description": null
    }]
    
    this.selectedDropdowns = [...this.dropdowns];

  }

  initForm(){
    this.myForm = this.fb.group({
      // name : [null, Validators.required],
      // age : [null, Validators.required],
      agentConfigurations : this.fb.array([])
    });
  }

  onSave(){
    debugger;
    const formData = this.myForm.getRawValue().agentConfigurations;
    const payLoad = formData.map((item:any)=>{
      const isSelected = this.selectedDropdowns.some(
        x=>x.id === item.configId
      )
      const original = this.dropdowns.find((x:any) => x.id === item.configId);
      let finalValue = item.configValue;
  
      // convert boolean back to original type
      if (original?.configValue === "1" || original?.configValue === "0") {
        finalValue = item.configValue ? 1 : 0;
      }
      else if(original?.configValue === 'true' || original?.configValue === 'false'){
        finalValue = item.configValue ? 'true' : 'false';
      }

      if(isSelected){
        return item ;  //user selected ->take edited value
      }
      else{
        const original = this.dropdowns.find((x:any)=>x.id === item.configId);
        return {
          configId : item.configId,
          configValue : original?.configValue,
          configDescription : original?.description
        };
      }
    });
    console.log(payLoad);
  }

  isSelected(item: any): boolean {
    return this.selectedDropdowns.some(x => x.id === item.id);
  }

  intializeFormArray(){
    this.agentConfigs.clear();
    this.dropdowns.forEach((element : any) => {
      this.agentConfigs.push(this.createConfigItems(element));
    });

    //this.onSelectionChange();
  }

  createConfigItems(item : any){

    const isToggle = this.isToggleType(item.configValue);
    let value = item.configValue;
    if (isToggle) {
      value = this.normalizeToBoolean(item.configValue); // ✅ convert
    }
    return this.fb.group({
      configId : [item.id],
      configValue : [value],
      //originalValue: [item.configValue],   
      configDescription : [item.configCode], //description is empty
      //isToggle: [isToggle]
    });
  }

  normalizeToBoolean(value: any): boolean {
    if (value == null) return false;
      const v = value.trim().toLowerCase();
      return v === 'true' || v === '1';
  }

  onSelectionChange(){
    // this.agentConfigs.clear();
    // this.selectedDropdowns.forEach(item => {
    //   this.agentConfigs.push(this.createConfigItems(item));
    // })

    this.agentConfigs.controls.forEach((group:any) => {
      const isSelected = this.selectedDropdowns.some(
        x => Number(x.id) === Number(group.value.configId)
      );
      
      const control = group.get('configValue');
      if(!control) return;

      if(isSelected){
        control?.enable({ emitEvent: false });
      }
      else{
        //control?.setValue(group.value.originalValue,{ emitEvent: false });
        control?.disable({ emitEvent: false });
      }
    });
    this.myForm.updateValueAndValidity();
  }

  get filteredConfigs() : FormGroup[] {
    
    const text = this.searchText?.toLowerCase() || '';
    return this.agentConfigs.controls
    .filter(control => {
      const group = control as FormGroup;
      return group.value.configDescription
        ?.toLowerCase()
        .includes(text);
    })
    .map(control => control as FormGroup);
}

  get agentConfigs(){
    return this.myForm.get('agentConfigurations') as FormArray;
  }

  isToggleType(value : any) : boolean{
    if(typeof value === 'boolean') return true;
    if(value === null) return false;
      const v = value.toString().trim().toLowerCase();
      return ['true', 'false', '1', '0'].includes(v);
  }

  clearSearch() {
    this.searchText = '';
  }
}
