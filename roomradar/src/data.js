export const FACILITIES = ['Wi-Fi', 'Power outlets', 'Whiteboard', 'Projector', 'Smart screen', 'Computers', 'AC', 'Accessible'];

// classes: fixed timetable slots (start inclusive, end exclusive, 24h clock)
// busy: hours when a (simulated) occupancy sensor reports the room as in use
export const ROOMS = [
  { id: 'lib1', name: 'Library Study Room 1', building: 'Central Library', type: 'Study room', capacity: 4, noise: 'quiet',
    facilities: ['Wi-Fi', 'Power outlets', 'Whiteboard'], access: 'Open to all students', classes: [], busy: [11, 14] },
  { id: 'lib2', name: 'Library Study Room 2', building: 'Central Library', type: 'Study room', capacity: 6, noise: 'quiet',
    facilities: ['Wi-Fi', 'Power outlets', 'Whiteboard', 'Smart screen'], access: 'Open to all students', classes: [], busy: [9] },
  { id: 'lib3', name: 'Library Discussion Pod', building: 'Central Library', type: 'Discussion room', capacity: 8, noise: 'moderate',
    facilities: ['Wi-Fi', 'Power outlets', 'Whiteboard', 'Smart screen', 'AC'], access: 'Open to all students', classes: [], busy: [15] },
  { id: 'a101', name: 'Room A101', building: 'Block A', type: 'Classroom', capacity: 40, noise: 'moderate',
    facilities: ['Projector', 'Whiteboard', 'AC', 'Wi-Fi', 'Accessible'], access: 'Open when no class is scheduled',
    classes: [{ start: 9, end: 11, course: 'CS201 Data Structures' }, { start: 14, end: 16, course: 'MA101 Calculus' }], busy: [] },
  { id: 'a204', name: 'Room A204', building: 'Block A', type: 'Seminar room', capacity: 20, noise: 'moderate',
    facilities: ['Projector', 'Whiteboard', 'Wi-Fi', 'AC'], access: 'Open when no class is scheduled',
    classes: [{ start: 10, end: 12, course: 'EE210 Circuits' }], busy: [16] },
  { id: 'lab1', name: 'Computer Lab 1', building: 'Science Block', type: 'Lab', capacity: 30, noise: 'moderate',
    facilities: ['Computers', 'Wi-Fi', 'Projector', 'AC', 'Power outlets'], access: 'Project groups, booking required',
    classes: [{ start: 8, end: 10, course: 'CS110 Programming Lab' }, { start: 13, end: 16, course: 'CS330 Databases Lab' }], busy: [] },
  { id: 'hub1', name: 'Project Room', building: 'Student Hub', type: 'Project room', capacity: 10, noise: 'lively',
    facilities: ['Whiteboard', 'Smart screen', 'Power outlets', 'Wi-Fi', 'Accessible'], access: 'Open to all students', classes: [], busy: [12, 13] },
  { id: 'hub2', name: 'Collaboration Zone', building: 'Student Hub', type: 'Open zone', capacity: 6, noise: 'lively',
    facilities: ['Whiteboard', 'Power outlets', 'Wi-Fi', 'Accessible'], access: 'Open to all students', classes: [], busy: [] }
];
