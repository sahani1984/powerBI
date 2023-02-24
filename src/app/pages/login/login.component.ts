import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators, } from '@angular/forms';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PowerbiDbService } from 'src/app/services/powerbi-db.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading: boolean = false;
  constructor(
    private router: Router,
    private powerDb: PowerbiDbService,
    private authService: AuthService) {
    this.initform();
  }

  ngOnInit(): void { }


  login(data: any) {
    let obj: any = {};
    this.loading = true;
    obj["data"] = {}
    obj["data"]["serviceEndpoint"] = "/sign-in";
    obj["data"]["serviceRequestType"] = "POST";
    obj["data"]["serviceRequestData"] = {};
    obj["data"]["serviceRequestData"]["data"] = {};
    obj["data"]["serviceRequestData"]["data"]["email"] = data.email;
    obj["data"]["serviceRequestData"]["data"]["password"] = data.password;
    this.powerDb.signIn(obj).subscribe({
      next: (res: any) => {
        if (res["statusCode"] == 200) {
          let obj: any = {};
          obj["_token"] = res["token"];
          obj["email"] = res["email"];
          this.authService.USER_INFO = obj;
          sessionStorage.setItem('user_info', JSON.stringify(obj));
          this.authService.setUserLoggedIn();
          this.router.navigate(['/dashboard/by-day']);
          this.loading = false;        
        }else{
          this.loading = false;
          this.showErrMsg(res.body)
        }
      },
      error: (err) => {
        this.loading = false
        this.showErrMsg(err)
      }
    })
  }

  resMsg:any="";
  showResMsg:boolean=false;
  showErrMsg(data:any){   
    if(!data) return;
    data = JSON.parse(data);
    this.showResMsg = true;
     this.resMsg = data.message;
      timer(4000).subscribe((res:any)=> {     
        this.showResMsg = false;
        this.resMsg = "";
      }); 
  }

  initform() {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    })
  }

}
