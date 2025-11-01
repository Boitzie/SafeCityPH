import type { User, Report, Department, AdminNote } from './types';
import { placeholderImages } from './placeholder-images.json';

export const mockUser: User = {
  uid: 'admin-001',
  email: 'admin@gmail.scph.gov',
  fullName: 'Juan Dela Cruz',
  avatarUrl: placeholderImages.find(p => p.id === 'avatar-1')?.imageUrl || '',
  role: 'admin',
  department: 'Makati – DRRMO',
  lastActive: new Date(),
  createdAt: new Date('2023-01-15T09:00:00Z'),
};

export const mockDepartments: Department[] = [
  { id: 'dep-1', name: 'Makati – Bureau of Fire Protection (BFP)', district: '1', isActive: true },
  { id: 'dep-2', name: 'Makati – DRRMO', district: '1', isActive: true },
  { id: 'dep-3', name: 'Makati – C3', district: '2', isActive: true },
  { id: 'dep-4', name: 'Makati – Police Department', district: '1', isActive: true },
  { id: 'dep-5', name: 'Makati – Department of Environmental Services (DES)', district: '2', isActive: true },
];

export const mockReports: Report[] = [
  {
    id: 'report-001',
    reportId: '#RPT-20240728-FIR-001',
    title: 'Structure Fire in Bel-Air',
    category: 'Fire',
    location: 'Jupiter St, Bel-Air, Makati',
    dateTime: new Date('2024-07-28T14:30:00Z'),
    description: 'A two-story residential building caught fire. Initial reports suggest electrical fault. Smoke is visible from EDSA.',
    reporterName: 'Maria Santos',
    reporterContact: '0917-123-4567',
    status: 'In Progress',
    urgency: 'High',
    assignedDepartments: ['dep-1', 'dep-2', 'dep-4'],
    images: [
      placeholderImages.find(p => p.id === 'report-1-img-1')?.imageUrl || '',
      placeholderImages.find(p => p.id === 'report-1-img-2')?.imageUrl || '',
    ],
    timeline: [
      { time: new Date('2024-07-28T14:30:00Z'), event: 'Report received via emergency hotline.' },
      { time: new Date('2024-07-28T14:32:00Z'), event: 'Dispatched BFP and DRRMO teams.', author: 'Juan Dela Cruz' },
    ],
    notes: [
      { author: 'Juan Dela Cruz', text: 'BFP reports difficulty accessing the street due to afternoon traffic. Police assistance requested for traffic control.', timestamp: new Date('2024-07-28T14:45:00Z') },
    ],
    createdAt: new Date('2024-07-28T14:31:00Z'),
    updatedAt: new Date('2024-07-28T14:45:00Z'),
  },
  {
    id: 'report-002',
    reportId: '#RPT-20240727-EMG-002',
    title: 'Vehicular Accident at Ayala Avenue',
    category: 'Emergency',
    location: 'Ayala Avenue corner Paseo de Roxas',
    dateTime: new Date('2024-07-27T08:15:00Z'),
    description: 'A multi-vehicle collision involving a bus and two cars. Multiple injuries reported. Heavy traffic buildup.',
    reporterName: 'John Doe',
    reporterContact: '0928-987-6543',
    status: 'Resolved',
    urgency: 'High',
    assignedDepartments: ['dep-2', 'dep-4'],
    images: [
      placeholderImages.find(p => p.id === 'report-2-img-1')?.imageUrl || '',
      placeholderImages.find(p => p.id === 'report-2-img-2')?.imageUrl || '',
    ],
    timeline: [
      { time: new Date('2024-07-27T08:15:00Z'), event: 'C3 camera operator spotted the incident.' },
      { time: new Date('2024-07-27T08:17:00Z'), event: 'DRRMO ambulance and police dispatched.', author: 'Admin' },
      { time: new Date('2024-07-27T08:45:00Z'), event: 'Injured individuals transported to hospital.' },
      { time: new Date('2024-07-27T09:30:00Z'), event: 'Vehicles cleared from the road. Traffic flow normalizing.' },
      { time: new Date('2024-07-27T10:00:00Z'), event: 'Incident marked as resolved.' },
    ],
    notes: [],
    createdAt: new Date('2024-07-27T08:16:00Z'),
    updatedAt: new Date('2024-07-27T10:00:00Z'),
  },
  {
    id: 'report-003',
    reportId: '#RPT-20240726-DST-003',
    title: 'Flash Flood in Brgy. Pio del Pilar',
    category: 'Disaster',
    location: 'Washington St, Brgy. Pio del Pilar, Makati',
    dateTime: new Date('2024-07-26T16:00:00Z'),
    description: 'Heavy downpour caused gutter-deep floods, stranding commuters and residents. Drainage systems are overwhelmed.',
    reporterName: 'City Watch',
    reporterContact: 'N/A',
    status: 'Resolved',
    urgency: 'Medium',
    assignedDepartments: ['dep-2', 'dep-5'],
    images: [
      placeholderImages.find(p => p.id === 'report-3-img-1')?.imageUrl || '',
    ],
    timeline: [
      { time: new Date('2024-07-26T16:00:00Z'), event: 'Flood monitoring alert triggered.' },
      { time: new Date('2024-07-26T16:10:00Z'), event: 'DES personnel dispatched to check drainage pumps.' },
      { time: new D ate('2024-07-26T18:30:00Z'), event: 'Floodwaters have subsided.' },
    ],
    notes: [
      { author: 'Admin', text: 'Recurring issue in this area during heavy rains. Recommend long-term drainage upgrade.', timestamp: new Date('2024-07-26T19:00:00Z') },
    ],
    createdAt: new Date('2024-07-26T16:01:00Z'),
    updatedAt: new Date('2024-07-26T18:30:00Z'),
  },
  {
    id: 'report-004',
    reportId: '#RPT-20240725-CRI-004',
    title: 'Reported Robbery in Poblacion',
    category: 'Crime',
    location: 'Don Pedro St, Poblacion, Makati',
    dateTime: new Date('2024-07-25T23:00:00Z'),
    description: 'A tourist reported a snatching incident. Suspects fled on a motorcycle. Details are being gathered.',
    reporterName: 'Michael Smith',
    reporterContact: 'N/A',
    status: 'For Review',
    urgency: 'Medium',
    assignedDepartments: ['dep-4'],
    images: [],
    timeline: [],
    notes: [],
    createdAt: new Date('2024-07-25T23:05:00Z'),
    updatedAt: new Date('2024-07-25T23:05:00Z'),
  },
    {
    id: 'report-005',
    reportId: '#RPT-20240724-FIR-005',
    title: 'Grass Fire near Guadalupe Bridge',
    category: 'Fire',
    location: 'Near Guadalupe Bridge, northbound',
    dateTime: new Date('2024-07-24T13:00:00Z'),
    description: 'A patch of dry grass under the bridge caught fire, cause unknown. Fire is small but causing smoke to drift across EDSA.',
    reporterName: 'MMDA Officer',
    reporterContact: 'N/A',
    status: 'Resolved',
    urgency: 'Low',
    assignedDepartments: ['dep-1'],
    images: [placeholderImages.find(p => p.id === 'report-5-img-1')?.imageUrl || ''],
    timeline: [
      { time: new Date('2024-07-24T13:02:00Z'), event: 'Report received from MMDA.' },
      { time: new Date('2024-07-24T13:15:00Z'), event: 'Fire truck on site.' },
      { time: new Date('2024-07-24T13:30:00Z'), event: 'Fire out.' },
    ],
    notes: [],
    createdAt: new Date('2024-07-24T13:03:00Z'),
    updatedAt: new Date('2024-07-24T13:30:00Z'),
  },
  {
    id: 'report-006',
    reportId: '#RPT-20240723-EMG-006',
    title: 'Medical Emergency at a Condo',
    category: 'Emergency',
    location: 'Jazz Residences, Bel-Air',
    dateTime: new Date('2024-07-23T11:45:00Z'),
    description: 'Resident experiencing severe chest pains and difficulty breathing. Building admin requested for an ambulance.',
    reporterName: 'Jazz Residences Security',
    reporterContact: '0918-111-2222',
    status: 'Resolved',
    urgency: 'High',
    assignedDepartments: ['dep-2'],
    images: [],
    timeline: [
      { time: new Date('2024-07-23T11:46:00Z'), event: 'Call received for medical assistance.' },
      { time: new Date('2024-07-23T11:55:00Z'), event: 'Ambulance arrived at the location.' },
      { time: new Date('2024-07-23T12:15:00Z'), event: 'Patient stabilized and transported to Makati Medical Center.' },
    ],
    notes: [],
    createdAt: new Date('2024-07-23T11:47:00Z'),
    updatedAt: new Date('2024-07-23T12:15:00Z'),
  },
    {
    id: 'report-007',
    reportId: '#RPT-20240722-OTH-007',
    title: 'Fallen Tree on Chino Roces Ave',
    category: 'Other',
    location: 'Chino Roces Ave, near Pasong Tamo',
    dateTime: new Date('2024-07-22T05:30:00Z'),
    description: 'An old acacia tree fell overnight, obstructing two lanes of the road. No injuries reported. Result of strong winds and rain.',
    reporterName: 'Street Sweeper',
    reporterContact: 'N/A',
    status: 'In Progress',
    urgency: 'Medium',
    assignedDepartments: ['dep-5', 'dep-2'],
    images: [
        placeholderImages.find(p => p.id === 'report-7-img-1')?.imageUrl || '',
        placeholderImages.find(p => p.id === 'report-7-img-2')?.imageUrl || '',
    ],
    timeline: [
      { time: new Date('2024-07-22T05:35:00Z'), event: 'Report received from a city employee.' },
      { time: new Date('2024-07-22T05:45:00Z'), event: 'DES clearing team dispatched with chainsaws.' },
    ],
    notes: [
      { author: 'Juan Dela Cruz', text: 'Clearing operation may take up to 3 hours. Advised traffic management to reroute vehicles.', timestamp: new Date('2024-07-22T06:00:00Z') },
    ],
    createdAt: new Date('2024-07-22T05:36:00Z'),
    updatedAt: new Date('2024-07-22T06:00:00Z'),
  },
  {
    id: 'report-008',
    reportId: '#RPT-20240721-FIR-008',
    title: 'Kitchen Fire in a Restaurant',
    category: 'Fire',
    location: 'Salcedo Village',
    dateTime: new Date('2024-07-21T20:00:00Z'),
    description: 'Grease fire started in the kitchen of a popular restaurant. Staff used a fire extinguisher but were unable to contain it.',
    reporterName: 'Restaurant Manager',
    reporterContact: '0919-555-8888',
    status: 'For Review',
    urgency: 'High',
    assignedDepartments: ['dep-1'],
    images: [placeholderImages.find(p => p.id === 'report-8-img-1')?.imageUrl || ''],
    timeline: [],
    notes: [
      { author: 'Admin', text: 'Awaiting initial report from the BFP inspector on site.', timestamp: new Date('2024-07-21T20:30:00Z') },
    ],
    createdAt: new Date('2024-07-21T20:05:00Z'),
    updatedAt: new Date('2024-07-21T20:30:00Z'),
  },
  {
    id: 'report-009',
    reportId: '#RPT-20240720-CRI-009',
    title: 'Illegal Parking Clamp Operation',
    category: 'Crime',
    location: 'Legazpi Village',
    dateTime: new Date('2024-07-20T10:00:00Z'),
    description: 'Joint operation with MAPSA to clamp illegally parked vehicles causing obstruction in Legazpi Village.',
    reporterName: 'MAPSA',
    reporterContact: 'N/A',
    status: 'For Review',
    urgency: 'Low',
    assignedDepartments: ['dep-4'],
    images: [placeholderImages.find(p => p.id === 'report-9-img-1')?.imageUrl || ''],
    timeline: [],
    notes: [],
    createdAt: new Date('2024-07-20T10:01:00Z'),
    updatedAt: new Date('2024-07-20T10:01:00Z'),
  },
];


export const mockAdminNotes: AdminNote[] = [
    {
        id: 'note-1',
        title: 'System Maintenance',
        content: 'Scheduled system maintenance on Sunday at 2 AM. Expect brief downtime.',
        author: 'Juan Dela Cruz',
        timestamp: new Date('2024-07-28T10:00:00Z'),
        updatedAt: new Date('2024-07-28T10:00:00Z'),
    },
    {
        id: 'note-2',
        title: 'New Typhoon Protocol',
        content: 'All departments must review the new typhoon response protocol (Circular #2024-05) by end of the week.',
        author: 'Juan Dela Cruz',
        timestamp: new Date('2024-07-27T15:00:00Z'),
        updatedAt: new Date('2024-07-27T15:00:00Z'),
    }
]

export const getReports = async () => {
    // In a real app, this would be a database call.
    // Here we simulate a network delay.
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockReports;
}

export const getReportById = async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return mockReports.find(report => report.id === id);
}

export const getAdminNotes = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockAdminNotes;
}

export const getUser = async () => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return mockUser;
}
