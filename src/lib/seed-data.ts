
import type { Report } from './types';

// Omit fields that are auto-generated or not part of the seed data.
type SeedReport = Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'assignedDepartments' | 'images' | 'notes'> & {
    timeline: { time: string, event: string, author?: string }[];
};

export const reportSeedData: SeedReport[] = [
  {
    "reportId": "#RPT-20251011-FIR-078",
    "title": "Residential Fire – Structure Fire Reported",
    "status": "In Progress",
    "urgency": "High",
    "location": "Pablo Ocampo Street, Makati City",
    "submittedAt": "2025-10-11T17:33:00+08:00",
    "dateTime": "2025-10-11T17:33:00+08:00",
    "category": "Fire",
    "description": "A fire broke out in a residential apartment complex along Pablo Ocampo Street. The incident originated from the kitchen area of a second-floor unit, reportedly caused by an unattended cooking appliance. Smoke was visible from nearby streets. Residents began evacuating while neighbors alerted authorities. Immediate assistance required for fire suppression and medical response.",
    "reporterName": "Maria Dela Cruz",
    "reporterContact": "0917-456-8921",
    "submittedBy": "Maria Dela Cruz",
    "contactNumber": "0917-456-8921",
    "timeline": [
      { "time": "2025-10-11T17:33:00+08:00", "event": "Report submitted by Maria Dela Cruz." },
      { "time": "2025-10-11T17:36:00+08:00", "event": "Acknowledged by Makati Fire Station and Barangay Fire Brigade." },
      { "time": "2025-10-11T17:42:00+08:00", "event": "Fire response units and EMTs dispatched." },
      { "time": "2025-10-11T17:55:00+08:00", "event": "Firefighters on site; active suppression operations in progress." }
    ]
  },
  {
    "reportId": "#RPT-20251010-FIR-077",
    "title": "Residential Fire – Structure Fire Reported",
    "status": "In Progress",
    "urgency": "High",
    "location": "Zobel Roxas Street, Makati City",
    "submittedAt": "2025-10-11T16:30:00+08:00",
    "dateTime": "2025-10-11T16:30:00+08:00",
    "category": "Fire",
    "description": "A residential unit along Zobel Roxas Street caught fire due to an electrical malfunction in the living area. Flames were observed spreading to adjacent sections of the structure. Residents began immediate evacuation, and nearby establishments have been alerted. Assistance requested for fire suppression and crowd control.",
    "reporterName": "Anonymous",
    "reporterContact": "0918-624-3775",
    "submittedBy": "Anonymous",
    "contactNumber": "0918-624-3775",
    "timeline": [
      { "time": "2025-10-11T16:30:00+08:00", "event": "Report submitted by citizen." },
      { "time": "2025-10-11T16:33:00+08:00", "event": "Acknowledged by Makati Fire Station and Barangay Fire Volunteers." },
      { "time": "2025-10-11T16:38:00+08:00", "event": "Fire response units and EMTs dispatched." },
      { "time": "2025-10-11T16:50:00+08:00", "event": "Responders on site; active suppression and containment efforts ongoing." }
    ]
  },
  {
    "reportId": "#RPT-20251009-FIR-076",
    "title": "Industrial Fire – Structure Fire Reported",
    "status": "In Progress",
    "urgency": "High",
    "location": "Pablo Ocampo Street, Makati City",
    "submittedAt": "2025-10-11T15:15:00+08:00",
    "dateTime": "2025-10-11T15:15:00+08:00",
    "category": "Fire",
    "description": "An industrial warehouse along Pablo Ocampo Street reported a fire originating from the storage area containing flammable materials. Thick smoke was seen rising from the facility, prompting nearby businesses to evacuate personnel. Immediate deployment of fire suppression teams required to prevent further spread and potential chemical hazards.",
    "reporterName": "Roberto Santos",
    "reporterContact": "0920-835-4412",
    "submittedBy": "Roberto Santos",
    "contactNumber": "0920-835-4412",
    "timeline": [
      { "time": "2025-10-11T15:15:00+08:00", "event": "Report submitted by Roberto Santos." },
      { "time": "2025-10-11T15:18:00+08:00", "event": "Acknowledged by Makati Fire Station and Industrial Fire Response Unit." },
      { "time": "2025-10-11T15:25:00+08:00", "event": "Multiple fire engines and EMT units dispatched to the scene." },
      { "time": "2025-10-11T15:40:00+08:00", "event": "Responders conducting containment operations; nearby traffic rerouted for safety." },
      { "time": "2025-10-11T15:50:00+08:00", "event": "Hazardous materials (chemical solvents) identified; HAZMAT team requested for containment and air quality monitoring." }
    ]
  },
  {
    "reportId": "#RPT-20251008-FIR-075",
    "title": "Residential Fire – Structure Fire Reported",
    "status": "Resolved",
    "urgency": "Medium",
    "location": "P. Burgos Street, Barangay Poblacion, Makati City",
    "submittedAt": "2025-10-10T22:45:00+08:00",
    "dateTime": "2025-10-10T22:45:00+08:00",
    "category": "Fire",
    "description": "Smoke is coming from a house along P. Burgos Street. I can see flames from one of the windows on the second floor. It looks like it started in the kitchen area. The neighbors are shouting for help and trying to use buckets of water.",
    "reporterName": "Liza Ramos",
    "reporterContact": "0906-782-1193",
    "submittedBy": "Liza Ramos",
    "contactNumber": "0906-782-1193",
    "timeline": [
      { "time": "2025-10-10T22:45:00+08:00", "event": "Report submitted by Liza Ramos." },
      { "time": "2025-10-10T22:47:00+08:00", "event": "Acknowledged by Makati Fire Station and Barangay Poblacion volunteers." },
      { "time": "2025-10-10T22:55:00+08:00", "event": "Fire units arrived; blaze under control." },
      { "time": "2025-10-10T23:10:00+08:00", "event": "Fire declared out; no injuries reported." }
    ]
  },
  {
    "reportId": "#RPT-20251007-FIR-074",
    "title": "Residential Fire – Structure Fire Reported",
    "status": "Resolved",
    "urgency": "Medium",
    "location": "J.P. Rizal Extension, Barangay Olympia, Makati City",
    "submittedAt": "2025-10-10T16:20:00+08:00",
    "dateTime": "2025-10-10T16:20:00+08:00",
    "category": "Fire",
    "description": "I saw thick smoke coming from a house near J.P. Rizal Extension. There was a loud noise before the fire started, maybe from a gas tank or stove. People nearby are shouting and trying to move their vehicles away from the area.",
    "reporterName": "Mark Dela Peña",
    "reporterContact": "0919-233-8457",
    "submittedBy": "Mark Dela Peña",
    "contactNumber": "0919-233-8457",
    "timeline": [
      { "time": "2025-10-10T16:20:00+08:00", "event": "Report submitted by Mark Dela Peña." },
      { "time": "2025-10-10T16:23:00+08:00", "event": "Fire response dispatched from Makati Fire Station." },
      { "time": "2025-10-10T16:32:00+08:00", "event": "Fire brought under control." },
      { "time": "2025-10-10T16:45:00+08:00", "event": "Scene cleared; one resident treated for minor smoke inhalation." }
    ]
  },
  {
    "reportId": "#RPT-20251006-FIR-073",
    "title": "Residential Fire – Structure Fire Reported",
    "status": "Resolved",
    "urgency": "Medium",
    "location": "Chino Roces Avenue, Barangay Bangkal, Makati City",
    "submittedAt": "2025-10-10T12:55:00+08:00",
    "dateTime": "2025-10-10T12:55:00+08:00",
    "category": "Fire",
    "description": "I saw flames coming from a small house along Chino Roces Avenue. The residents have gone outside, and the smoke is getting thicker.",
    "reporterName": "Daniel Cruz",
    "reporterContact": "0935-428-7762",
    "submittedBy": "Daniel Cruz",
    "contactNumber": "0935-428-7762",
    "timeline": [
      { "time": "2025-10-10T12:55:00+08:00", "event": "Report submitted by Daniel Cruz." },
      { "time": "2025-10-10T12:58:00+08:00", "event": "Acknowledged by Makati Fire Station." },
      { "time": "2025-10-10T13:07:00+08:00", "event": "Fire under control; electrical inspection requested." },
      { "time": "2025-10-10T13:25:00+08:00", "event": "Fire declared out; minor property damage reported." }
    ]
  },
  {
    "reportId": "#RPT-20251005-FIR-072",
    "title": "Residential Fire – Structure Fire Reported",
    "status": "Resolved",
    "urgency": "Low",
    "location": "Kalayaan Avenue, Barangay Guadalupe Nuevo, Makati City",
    "submittedAt": "2025-10-09T21:40:00+08:00",
    "dateTime": "2025-10-09T21:40:00+08:00",
    "category": "Fire",
    "description": "I can see a fire inside one of the houses along Kalayaan Avenue near the tricycle terminal. There’s heavy smoke coming from the roof, and people are running out of the house. It looks like it started from the back part of the building.",
    "reporterName": "Angela Perez",
    "reporterContact": "0917-552-3068",
    "submittedBy": "Angela Perez",
    "contactNumber": "0917-552-3068",
    "timeline": [
      { "time": "2025-10-09T21:40:00+08:00", "event": "Report submitted by Angela Perez." },
      { "time": "2025-10-09T21:43:00+08:00", "event": "Acknowledged by Makati Fire Station and Barangay Guadalupe Nuevo volunteers." },
      { "time": "2025-10-09T21:50:00+08:00", "event": "Fire response units arrived; immediate suppression initiated." },
      { "time": "2025-10-09T22:05:00+08:00", "event": "Fire declared out; assessment and cleanup operations conducted." }
    ]
  },
  {
    "reportId": "#RPT-20251004-FIR-071",
    "title": "Residential Fire – Structure Fire Reported",
    "status": "Resolved",
    "urgency": "Low",
    "location": "Arnaiz Avenue, Barangay San Lorenzo, Makati City",
    "submittedAt": "2025-10-09T18:25:00+08:00",
    "dateTime": "2025-10-09T18:25:00+08:00",
    "category": "Fire",
    "description": "I saw flames coming from a residential building along Arnaiz Avenue, near a small grocery. The fire started suddenly and the smoke is dark and thick. People nearby are trying to alert others and move vehicles away from the area.",
    "reporterName": "Jerome Bautista",
    "reporterContact": "0928-714-5593",
    "submittedBy": "Jerome Bautista",
    "contactNumber": "0928-714-5593",
    "timeline": [
      { "time": "2025-10-09T18:25:00+08:00", "event": "Report submitted by Jerome Bautista." },
      { "time": "2025-10-09T18:28:00+08:00", "event": "Fire response acknowledged by Makati Fire Station." },
      { "time": "2025-10-09T18:36:00+08:00", "event": "Units deployed to location; partial evacuation in progress." },
      { "time": "2025-10-09T18:50:00+08:00", "event": "Fire contained; investigation on source initiated." }
    ]
  },
  {
    "reportId": "#RPT-20251003-FIR-070",
    "title": "Residential Fire – Structure Fire Reported",
    "status": "Resolved",
    "urgency": "Low",
    "location": "Estrella Street, Barangay Bel-Air, Makati City",
    "submittedAt": "2025-10-09T14:10:00+08:00",
    "dateTime": "2025-10-09T14:10:00+08:00",
    "category": "Fire",
    "description": "I noticed smoke coming from a house on Estrella Street near the corner of Nicanor Garcia. It seems to be spreading fast, and there’s a strong burning smell. People are shouting for help while others are calling emergency services.",
    "reporterName": "Carlo Mendoza",
    "reporterContact": "0930-826-1145",
    "submittedBy": "Carlo Mendoza",
    "contactNumber": "0930-826-1145",
    "timeline": [
      { "time": "2025-10-09T14:10:00+08:00", "event": "Report submitted by Carlo Mendoza." },
      { "time": "2025-10-09T14:13:00+08:00", "event": "Fire Station notified and volunteers dispatched." },
      { "time": "2025-10-09T14:20:00+08:00", "event": "Firefighters arrived; suppression operations began." },
      { "time": "2025-10-09T14:35:00+08:00", "event": "Fire extinguished; minor smoke damage to adjacent house." }
    ]
  }
];

    