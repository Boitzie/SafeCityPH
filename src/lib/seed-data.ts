
import type { Report } from './types';
import { placeholderImages } from './placeholder-images.json';

// Omit fields that are auto-generated or not part of the seed data.
export type SeedReport = Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'notes'> & {
    timeline: { time: string, event: string, author?: string }[];
};


const getImage = (id: string) => placeholderImages.find(p => p.id === id)?.imageUrl || '';

export const reportSeedData: SeedReport[] = [
  {
    "reportId": "#RPT-20251011-FIR-078",
    "title": "Residential Fire – Structure Fire Reported",
    "status": "In Progress",
    "urgency": "High",
    "location": "Pablo Ocampo Street, Makati City",
    "dateTime": "2025-10-11T17:33:00+08:00",
    "category": "Fire",
    "description": "A fire broke out in a residential apartment complex along Pablo Ocampo Street. The incident originated from the kitchen area of a second-floor unit, reportedly caused by an unattended cooking appliance. Smoke was visible from nearby streets. Residents began evacuating while neighbors alerted authorities. Immediate assistance required for fire suppression and medical response.",
    "reporterName": "Maria Dela Cruz",
    "reporterContact": "0917-456-8921",
    "timeline": [
      { "time": "2025-10-11T17:33:00+08:00", "event": "Report submitted by Maria Dela Cruz." },
      { "time": "2025-10-11T17:36:00+08:00", "event": "Acknowledged by Makati Fire Station and Barangay Fire Brigade." },
      { "time": "2025-10-11T17:42:00+08:00", "event": "Fire response units and EMTs dispatched." },
      { "time": "2025-10-11T17:55:00+08:00", "event": "Firefighters on site; active suppression operations in progress." }
    ],
    "images": [getImage('report-1-img-1'), getImage('report-1-img-2')],
    "assignedDepartments": []
  },
  {
    "reportId": "#RPT-20251010-FIR-077",
    "title": "Vehicle Accident - Multiple Cars",
    "status": "In Progress",
    "urgency": "High",
    "location": "Zobel Roxas Street, Makati City",
    "dateTime": "2025-10-11T16:30:00+08:00",
    "category": "Emergency",
    "description": "A multi-vehicle collision occurred on Zobel Roxas Street involving a sedan and a delivery truck. The sedan sustained significant front-end damage, and the truck is overturned, blocking two lanes of traffic. Medical assistance is needed for potentially injured individuals, and traffic management is required to clear the congestion.",
    "reporterName": "Anonymous",
    "reporterContact": "0918-624-3775",
    "timeline": [
      { "time": "2025-10-11T16:30:00+08:00", "event": "Report submitted by citizen." },
      { "time": "2025-10-11T16:33:00+08:00", "event": "Acknowledged by MAPSA and Makati Police Department." },
      { "time": "2025-10-11T16:38:00+08:00", "event": "Ambulance and traffic enforcers dispatched." },
      { "time": "2025-10-11T16:50:00+08:00", "event": "Responders on site; attending to injured individuals." }
    ],
    "images": [getImage('report-2-img-1'), getImage('report-2-img-2')],
    "assignedDepartments": []
  },
  {
    "reportId": "#RPT-20251009-FIR-076",
    "title": "Flooding Incident - Severe",
    "status": "For Review",
    "urgency": "High",
    "location": "Pablo Ocampo Street, Makati City",
    "dateTime": "2025-10-11T15:15:00+08:00",
    "category": "Disaster",
    "description": "Severe flooding along Pablo Ocampo Street due to heavy rainfall has rendered the road impassable for light vehicles. Water levels have reached waist-deep in some areas, trapping several commuters. Requesting immediate rescue and evacuation assistance for affected residents and motorists.",
    "reporterName": "Roberto Santos",
    "reporterContact": "0920-835-4412",
    "timeline": [
      { "time": "2025-10-11T15:15:00+08:00", "event": "Report submitted by Roberto Santos." }
    ],
    "images": [getImage('report-3-img-1')],
    "assignedDepartments": []
  },
  {
    "reportId": "#RPT-20251008-FIR-075",
    "title": "Structural Collapse - Partial",
    "status": "Resolved",
    "urgency": "Medium",
    "location": "P. Burgos Street, Barangay Poblacion, Makati City",
    "dateTime": "2025-10-10T22:45:00+08:00",
    "category": "Emergency",
    "description": "A portion of an old commercial building on P. Burgos Street has collapsed. Debris has fallen onto the sidewalk, creating a hazard for pedestrians. No injuries have been reported, but the area needs to be cordoned off for safety assessment and clearing operations.",
    "reporterName": "Liza Ramos",
    "reporterContact": "0906-782-1193",
    "timeline": [
      { "time": "2025-10-10T22:45:00+08:00", "event": "Report submitted by Liza Ramos." },
      { "time": "2025-10-10T22:47:00+08:00", "event": "Acknowledged by Department of Engineering and Safety." },
      { "time": "2025-10-10T22:55:00+08:00", "event": "Safety inspectors arrived; area secured." },
      { "time": "2025-10-10T23:10:00+08:00", "event": "Debris cleared; structural assessment complete." }
    ],
    "images": [],
    "assignedDepartments": []
  },
  {
    "reportId": "#RPT-20251007-FIR-074",
    "title": "Grass Fire - Open Field",
    "status": "Resolved",
    "urgency": "Medium",
    "location": "J.P. Rizal Extension, Barangay Olympia, Makati City",
    "dateTime": "2025-10-10T16:20:00+08:00",
    "category": "Fire",
    "description": "A grass fire has started in an open field near J.P. Rizal Extension. The fire is spreading quickly due to dry conditions and wind. It is approaching a nearby residential area, and smoke is causing visibility issues on the road.",
    "reporterName": "Mark Dela Peña",
    "reporterContact": "0919-233-8457",
    "timeline": [
      { "time": "2025-10-10T16:20:00+08:00", "event": "Report submitted by Mark Dela Peña." },
      { "time": "2025-10-10T16:23:00+08:00", "event": "Fire response dispatched from Makati Fire Station." },
      { "time": "2025-10-10T16:32:00+08:00", "event": "Fire brought under control." },
      { "time": "2025-10-10T16:45:00+08:00", "event": "Scene cleared; fire completely extinguished." }
    ],
    "images": [getImage('report-5-img-1')],
    "assignedDepartments": []
  },
  {
    "reportId": "#RPT-20251006-FIR-073",
    "title": "Theft and Robbery - Report",
    "status": "For Review",
    "urgency": "Medium",
    "location": "Chino Roces Avenue, Barangay Bangkal, Makati City",
    "dateTime": "2025-10-10T12:55:00+08:00",
    "category": "Crime",
    "description": "A robbery was reported at a convenience store on Chino Roces Avenue. The suspect, described as wearing a dark jacket and a face mask, allegedly took cash from the register and fled on foot. The store clerk is safe but shaken. Police presence is requested to investigate the scene and search for the suspect.",
    "reporterName": "Daniel Cruz",
    "reporterContact": "0935-428-7762",
    "timeline": [
      { "time": "2025-10-10T12:55:00+08:00", "event": "Report submitted by Daniel Cruz." }
    ],
    "images": [],
    "assignedDepartments": []
  },
  {
    "reportId": "#RPT-20251005-FIR-072",
    "title": "Fallen Tree - Road Obstruction",
    "status": "Resolved",
    "urgency": "Low",
    "location": "Kalayaan Avenue, Barangay Guadalupe Nuevo, Makati City",
    "dateTime": "2025-10-09T21:40:00+08:00",
    "category": "Disaster",
    "description": "A large acacia tree has fallen across Kalayaan Avenue near the tricycle terminal, blocking both lanes of traffic. The incident occurred after a short, intense downpour. No injuries or vehicle damages have been reported, but the obstruction is causing a major traffic jam.",
    "reporterName": "Angela Perez",
    "reporterContact": "0917-552-3068",
    "timeline": [
      { "time": "2025-10-09T21:40:00+08:00", "event": "Report submitted by Angela Perez." },
      { "time": "2025-10-09T21:43:00+08:00", "event": "Acknowledged by Parks and Recreation Department." },
      { "time": "2025-10-09T21:50:00+08:00", "event": "Clearing crew dispatched." },
      { "time": "2025-10-09T22:05:00+08:00", "event": "Tree cleared from the road; traffic flow restored." }
    ],
    "images": [getImage('report-7-img-1'), getImage('report-7-img-2')],
    "assignedDepartments": []
  },
  {
    "reportId": "#RPT-20251004-FIR-071",
    "title": "Commercial Fire - Kitchen Fire",
    "status": "Resolved",
    "urgency": "Low",
    "location": "Arnaiz Avenue, Barangay San Lorenzo, Makati City",
    "dateTime": "2025-10-09T18:25:00+08:00",
    "category": "Fire",
    "description": "A small fire started in the kitchen of a restaurant on Arnaiz Avenue. The staff used a fire extinguisher to control the blaze before it could spread. No one was injured, but the kitchen has sustained smoke damage. A fire safety inspection is requested to ensure the establishment is safe to operate.",
    "reporterName": "Jerome Bautista",
    "reporterContact": "0928-714-5593",
    "timeline": [
      { "time": "2025-10-09T18:25:00+08:00", "event": "Report submitted by Jerome Bautista." },
      { "time": "2025-10-09T18:28:00+08:00", "event": "Fire Station notified." },
      { "time": "2025-10-09T18:36:00+08:00", "event": "Fire out on arrival; safety inspection conducted." },
      { "time": "2025-10-09T18:50:00+08:00", "event": "Scene cleared; restaurant advised on safety measures." }
    ],
    "images": [getImage('report-8-img-1')],
    "assignedDepartments": []
  },
  {
    "reportId": "#RPT-20251003-FIR-070",
    "title": "Illegal Parking - Obstruction",
    "status": "For Review",
    "urgency": "Low",
    "location": "Estrella Street, Barangay Bel-Air, Makati City",
    "dateTime": "2025-10-09T14:10:00+08:00",
    "category": "Other",
    "description": "A white van has been illegally parked in a no-parking zone on Estrella Street for several hours, causing a significant obstruction. It is blocking the entrance to a residential driveway and narrowing the road, making it difficult for other vehicles to pass. Requesting traffic enforcement to tow or ticket the vehicle.",
    "reporterName": "Carlo Mendoza",
    "reporterContact": "0930-826-1145",
    "timeline": [
      { "time": "2025-10-09T14:10:00+08:00", "event": "Report submitted by Carlo Mendoza." }
    ],
    "images": [getImage('report-9-img-1')],
    "assignedDepartments": []
  }
];
