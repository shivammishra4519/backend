import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http:HttpClient) { }

  baseUrl="http://localhost:8080/task";

  saveTask(data:any){
    return this.http.post(this.baseUrl,data);
  }

  getTask(){
    return this.http.get(this.baseUrl);
  }

  deleteTask(id:any){
    return this.http.delete(this.baseUrl+'/'+id)
  }

  updateTask(data:any):Observable<any>{
    console.log("service",data._id)
    return this.http.patch((this.baseUrl+'/'+data.id),{taskName:data.taskname});

  }
  updateCompleted(data:any){
    return this.http.patch((this.baseUrl+'/'+data.id),{completed:data.completed})
  }
  getUserByid(id:any){
    return this.http.get(this.baseUrl+"/"+id)
  }
  baseUrlSerach="http://localhost:8080/search/";
  getBytaskname(taskname:any){
    return this.http.get(this.baseUrlSerach+taskname)
  }
}
