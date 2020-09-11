import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Division, Position, Employee } from 'src/app/interfaces';
import { DivisionService } from 'src/app/services/division/division.service';
import { PositionService } from 'src/app/services/position/position.service';
import { EmployeeService } from 'src/app/services/employee/employee.service';
import { b } from '@angular/core/src/render3';

@Component({
  selector: 'app-employees-form',
  templateUrl: './employees-form.component.html',
  styleUrls: ['./employees-form.component.css']
})
export class EmployeesFormComponent implements OnInit {

  private id: number;
  private isUpdate: boolean = false;
  private form: FormGroup = new FormGroup({
    nik: new FormControl(''),
    name: new FormControl(''),
    divisionId: new FormControl(''),
    positionId: new FormControl(''),
  });
  private lastData: any = {};
  private divisions: Division[];
  private positions: Position[];
  private employeeLength: number = 0;

  constructor(private router: Router, private route: ActivatedRoute, private employeeService: EmployeeService, private divisionService: DivisionService, private positionService: PositionService) {
    this.ngOnInit();
  }

  async ngOnInit() {
    this.id = this.route.snapshot.params.id;

    this.initData();

    if (this.id) {
      this.isUpdate = true;
      await this.employeeService.getById(this.id).subscribe((res: Employee) => {
        this.form.patchValue({
          nik: res.nik,
          name: res.name,
          divisionId: res.divisionId,
          positionId: res.positionId
        });

        this.lastData = {
          ...this.form.value,
          lastPosition: res.lastPosition,
          type: res.type
        };
      })
    }
    else {

      this.employeeService.getAll().subscribe((res: any) => {
        this.employeeLength = res.length;
        let number = this.employeeLength + 1;
        this.form.patchValue({
          nik: 'EM0000' + number
        })
      })
    }
  }

  initData() {
    this.divisionService.getAll().subscribe((res: any) => {
      this.divisions = res;
      this.form.patchValue({ divisionId: res[0].id || 0 });
    });

    this.positionService.getAll().subscribe((res: any) => {
      this.positions = res;
      this.form.patchValue({ positionId: res[0].id || 0 });
    })

  }

  onSubmit() {
    console.warn(this.form.value);
    let body = {
      ...this.form.value
    }

    console.log("lastData", this.lastData);

    if (this.isUpdate) {
      body.id = this.id;
      body.lastPosition = this.lastData.positionId != body.positionId ? this.positions.find(f => f.id == this.lastData.positionId).name : this.lastData.lastPosition;
      body.type = this.lastData.positionId != body.positionId ? this.isPromotionOrDemotion(this.lastData.positionId, body.positionId) : this.lastData.type;
      this.update(body);
    }
    else {
      body.lastPosition = this.positions.find(f => f.id == body.positionId).name;
      body.type = "DEMOTION";
      this.insert(body);
    }
  }

  isPromotionOrDemotion(idBefore, idAfter) {
    let positionBefore = this.positions.find(f => f.id == idBefore);
    let positionAfter = this.positions.find(f => f.id == idAfter);
    if (positionAfter.level > positionBefore.level) {
      return "PROMOTION";
    }
    else {
      return "DEMOTION";
    }
  }

  async update(body) {
    await this.employeeService.update(body).subscribe((res) => {
      console.log("res", res);
    });
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/']));
  }

  async insert(body) {
    let res = await this.employeeService.insert(body).subscribe((res) => {
      console.log("res", res);
    });
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigate(['/']));
  }

}
