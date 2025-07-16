import * as XLSX from 'xlsx';

export const importFromExcel = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        // Transform data to match our staff structure
        const staffData = jsonData.map((row, index) => {
          const parseDate = (dateStr) => {
            if (!dateStr || dateStr === '' || dateStr === '-') return '';
            
            // Handle Excel date serial numbers
            if (typeof dateStr === 'number') {
              const excelDate = new Date((dateStr - 25569) * 86400 * 1000);
              return excelDate.toISOString().split('T')[0];
            }
            
            // Handle string dates
            if (typeof dateStr === 'string') {
              // Try to parse various date formats
              const date = new Date(dateStr);
              if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
              }
            }
            
            return '';
          };

          const generateId = () => {
            return Date.now().toString(36) + Math.random().toString(36).substr(2) + index;
          };

          return {
            id: generateId(),
            staffId: row['Staff ID'] || row['staffId'] || '',
            name: row['Name'] || row['name'] || '',
            mobile: String(row['Mobile No'] || row['mobile'] || ''),
            email: row['Email ID'] || row['email'] || '',
            type: row['Teaching/Non-Teaching'] || row['type'] || 'Teaching',
            department: row['Department'] || row['department'] || '',
            panCard: row['PAN Card'] || row['panCard'] || '',
            aadhaarCard: String(row['Aadhaar Card'] || row['aadhaarCard'] || ''),
            designation: row['Designation'] || row['designation'] || '',
            qualifications: row['Qualifications'] || row['qualifications'] || '',
            experienceYears: Number(row['Experience (Years)'] || row['experienceYears'] || 0),
            experienceMonths: Number(row['Experience (Months)'] || row['experienceMonths'] || 0),
            dateOfBirth: parseDate(row['Date of Birth'] || row['dateOfBirth']),
            dateOfJoining: parseDate(row['Date of Joining'] || row['dateOfJoining']),
            dateOfRelieving: parseDate(row['Date of Leaving'] || row['Date of Relieving'] || row['dateOfRelieving']),
            status: row['Status'] || row['status'] || 'Active',
            createdAt: new Date().toISOString()
          };
        });

        // Filter out rows with missing required fields
        const validStaffData = staffData.filter(staff => 
          staff.staffId && staff.name && staff.mobile && staff.email && staff.designation
        );

        resolve(validStaffData);
      } catch (error) {
        reject(new Error('Failed to parse Excel file. Please check the file format.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };

    reader.readAsArrayBuffer(file);
  });
};