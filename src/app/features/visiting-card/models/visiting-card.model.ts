import { EmployeeRole } from '../enums/employee-role.enum';

export interface VisitingCardModel {
  name: string;
  mobile: string;
  email: string;
  role: EmployeeRole | null;
  companyName: string;
  logo: string;
  address: string;
  website: string;
  linkedin: string;
}
