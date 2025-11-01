
import type { Department } from './types';

// Omit fields that are auto-generated.
export type SeedDepartment = Omit<Department, 'id'>;

export const departmentSeedData: SeedDepartment[] = [
  {
    "name": "Makati - Police Department",
    "district": "District 1",
    "isActive": true
  },
  {
    "name": "Makati - Command Control and Communication Center",
    "district": "District 1",
    "isActive": true
  },
  {
    "name": "Makati - Bureau of Fire Protection",
    "district": "District 1",
    "isActive": true
  },
  {
    "name": "Makati - Department of Environmental Services",
    "district": "District 2",
    "isActive": true
  },
  {
    "name": "Makati - Disaster Risk Reduction and Management Office",
    "district": "District 2",
    "isActive": true
  }
];
