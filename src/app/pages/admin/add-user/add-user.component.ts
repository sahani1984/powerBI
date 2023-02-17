import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PowerbiDbService } from 'src/app/services/powerbi-db.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  title_data: string = "Add User"
  loading: boolean = false
  registerForm!: FormGroup;
  constructor(
    private powerbiDb: PowerbiDbService,
    private router: Router) {
    this.clientLists();
    this.initform();
  }

  ngOnInit(): void { }

  register(data: any) {
    this.loading = true;
    let obj: any = {};
    obj["data"] = {}
    obj["data"]["serviceEndpoint"] = "/register";
    obj["data"]["serviceRequestType"] = "POST";
    obj["data"]["serviceRequestData"] = {};
    obj["data"]["serviceRequestData"]["data"] = {};
    obj["data"]["serviceRequestData"]["data"]["email"] = data.email;
    obj["data"]["serviceRequestData"]["data"]["password"] = data.password;
    obj["data"]["serviceRequestData"]["data"]["logo"] = data.logo;
    obj["data"]["serviceRequestData"]["data"]["type"] = data.type;
    this.powerbiDb.register(obj).subscribe({
      next: (res: any) => {
        if (res["statusCode"] == 200) {
          this.loading = false;
          this.router.navigate(['/dashboard/user-list']);
        }
      },
      error: (err) => console.log(err),
      complete: () => this.loading = false
    })
  }


  clientList: any[] = [];
  clientLists() {
    let obj: any = {};
    obj["data"] = {};
    obj["data"]["serviceEndpoint"] = "/client-listing";
    obj["data"]["serviceRequestType"] = "POST";
    this.powerbiDb.getClientLists(obj).subscribe({
      next: (res: any) => {
        if (res["statusCode"] == 200) {
          this.clientList = res["data"];
        }
      },
      error: (err) => console.log(err)
    })
  }

  initform() {
    this.registerForm = new FormGroup({
      'clientID': new FormControl("", [Validators.required]),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required),
      'confrom_password': new FormControl(null, Validators.required),
      'logo': new FormControl(null, Validators.required),
      'type': new FormControl('airline', Validators.required),
    })
  }
}
