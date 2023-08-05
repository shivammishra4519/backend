import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ServiceService } from '../service.service';
import { text } from 'express';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { Dialog } from '@angular/cdk/dialog';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  [x: string]: any;
  delet = faTrash;
  edit = faEdit;
  check = faCheck;
  checkCircle = faCircleCheck
  constructor(private builder: FormBuilder, private service: ServiceService, private toastr: ToastrService) { }


  ngOnInit(): void {
    this.showtask()

  }

  showEdit = false;
  showSave = true;

  // creating reactive form's object and form controls 
  formData = this.builder.group({
    task: this.builder.control('', Validators.required,),
    id: this.builder.control("")
  })

  // cretaing a property 
  array: any;

  // creating method for add task start here 
  add() {
    if (this.formData.value.task?.trim) {
      let data = {
        taskName: this.formData.value.task,
        completed: false
      };

      this.service.saveTask(data).subscribe({
        next: data => {

          this.showtask()
          this.formData.reset()
        },
        error: err => {
          console.log("err", err)
        }

      })

      if (this.showEdit) {
        this.showEdit = false
      }

    } else {
      this.toastr.error("Enter a valid task name")
      alert("Enter a valid task name")
    }


    this['cdr'].detectChanges()
  }
  // creating method for add task end  here 


  // creating method for show  tasks 
  showtask() {
    this.service.getTask().subscribe({
      next: data => this.array = data
    })

  }
  // end of show tasks method


  // creating method for delet task  start
  deleteTask(taskId: any) {
    console.log("task id is ", taskId)

    this.service.deleteTask(taskId).subscribe({
      next: data => {
        this.showtask()
      },
      error: err => console.log("err is ", err)
    })

    this['cdr'].detectChanges()

  }

  // end of delete task

  // start of edit method
  task: any;
  text: any;
  editTask(id: any) {
    console.log("id from btn", id)
    let userData: any
    this.service.getUserByid(id).subscribe({
      next: data => {
        userData = data

        this.formData.setValue({
          task: userData.taskName,
          id: id
        });

      }
    })

    if (!this.showEdit) {
      this.showEdit = true
      this.showSave = false
    }

  }

  editCnf() {
    let taskname = this.formData.value.task;
    let id = this.formData.value.id;

    this.service.updateTask({ id: id, taskname: taskname }).subscribe(res => {
      console.log("respon", res)
      this.formData.reset()
      this.showtask()
    })
    console.log("50")
    if (!this.showSave) {
      this.showSave = true
      this.showEdit = false
    }

    this['cdr'].detectChanges()
  }

  // method for check is task completed or not 
  show = false;

  chechTask(data: any) {
    console.log("id in check", data)
    this.service.updateCompleted({ id: data, completed: true }).subscribe(res => {

      this.showtask()

    })
    this['cdr'].detectChanges()
  }
  unCheckTask(data: any) {

    this.service.updateCompleted({ id: data, completed: false }).subscribe(res => {

      this.showtask()

    })
    this['cdr'].detectChanges()
  }
dataAfterSearch:any;


  search(taskname:any){
    this.service.getBytaskname(this.searchTask.value.taskName).subscribe({
      next:data=>{
this.dataAfterSearch=data;
      }})
  }
  searchTask=this.builder.group({
    taskName:this.builder.control("")
  });


  

}
