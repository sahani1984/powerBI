import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PowerbiDbService } from 'src/app/services/powerbi-db.service';

@Component({
  selector: 'app-user-lists',
  templateUrl: './user-lists.component.html',
  styleUrls: ['./user-lists.component.scss']
})
export class UserListsComponent implements OnInit {
  title_data: string = "User List"
  showloader: boolean = false;
  searchTerms: any = "";
  page: number = 0
  constructor(private router: Router,
    private powerbiDb: PowerbiDbService) {

  }

  ngOnInit(): void {
    this.userLists();

  }



  usersLists: any[] = [];
  userLists() {
    this.showloader = true;
    let obj: any = {};
    obj["data"] = {};
    obj["data"]["serviceEndpoint"] = "/user-listing";
    obj["data"]["serviceRequestType"] = "POST";
    this.powerbiDb.getUserLists(obj).subscribe({
      next: (res: any) => {
        if (res["statusCode"] == 200) {
          this.usersLists = res["data"];
          this.showloader = false
        }else{
          this.showloader = false
        }
      },
      error: (err) => {
      this.showloader = false
      console.log(err)
       }
    })
  }
  add_user() {
    this.router.navigate(['/dashboard/add-user']);
  }
  enabled: any[] = []
  disabled(data: any) {
    data.enabled = !data.enabled;
    let obj: any = {};
    obj["data"] = {}
    obj["data"]["serviceEndpoint"] = "/enable-user";
    obj["data"]["serviceRequestType"] = "POST";
    obj["data"]["serviceRequestData"] = {};
    obj["data"]["serviceRequestData"]["data"] = {};
    obj["data"]["serviceRequestData"]["data"]["_id"] = data._id;
    obj["data"]["serviceRequestData"]["data"]["enabled"] = data.enabled;
    this.powerbiDb.enabled(obj).subscribe({
      next: (res: any) => {
        if (res["statusCode"] == 200) {
          console.log(res);
        }
      }
    })
  }
}
