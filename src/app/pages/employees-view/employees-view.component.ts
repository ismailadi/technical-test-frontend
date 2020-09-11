import { Component, OnInit } from '@angular/core';
import { Employee, Division, Position } from 'src/app/interfaces';
import { EmployeeService } from '../../services/employee/employee.service';
import { DivisionService } from '../../services/division/division.service';
import { PositionService } from '../../services/position/position.service';

@Component({
  selector: 'app-employees-view',
  templateUrl: './employees-view.component.html',
  styleUrls: ['./employees-view.component.css']
})
export class EmployeesViewComponent implements OnInit {
  private page: number = 1;
  private pageSize: number = 5;
  private collectionSize: number = 0;
  private employees: Employee[];
  private divisions: Division[];
  private positions: Position[];

  constructor(private service: EmployeeService, private divisionService: DivisionService, private positionService: PositionService) {
    this.ngOnInit()
  }

  async initData() {
    await this.divisionService.getAll().subscribe((res: any)=>{
      this.divisions = res;
    });
    
    await this.positionService.getAll().subscribe((res: any)=>{
      this.positions = res;
    })

    await this.service.getAll().subscribe((res: any) => {
      this.employees = res.map((data, i) => ({ id: i + 1, ...data })).slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
      this.employees = this.employees.map(data=>{
        let division = this.divisions.find(f=> f.id == data.divisionId);
        let position = this.positions.find(f=> f.id == data.positionId);
        return {
          ...data,
          division,
          position
        }
      })
      this.collectionSize = res.length;
      console.log(this.employees);
    });
  }

  ngOnInit() {
    this.initData();
  }

  async deleteEmployee(id){
    await this.service.delete(id).subscribe(res=>{
      this.initData();
    });
    
  }

}
