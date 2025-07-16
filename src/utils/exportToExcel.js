import * as XLSX from 'xlsx';

export const exportToExcel = (staff) => {
  if (staff.length === 0) {
    alert('No data to export!');
    return;
  }

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Prepare data for Excel
  const excelData = staff.map((member, index) => ({
    'Sr. No': index + 1,
    'Staff ID': member.staffId,
    'Name': member.name,
    'Mobile No': member.mobile,
    'Email ID': member.email,
    'Teaching/Non-Teaching': member.type,
    'Department': member.department || '',
    'PAN Card': member.panCard || '',
    'Aadhaar Card': member.aadhaarCard || '',
    'Designation': member.designation,
    'Qualifications': member.qualifications || '',
    'Experience (Years)': member.experienceYears || 0,
    'Experience (Months)': member.experienceMonths || 0,
    'Date of Birth': formatDate(member.dateOfBirth),
    'Date of Joining': formatDate(member.dateOfJoining),
    'Date of Leaving': formatDate(member.dateOfRelieving),
    'Status': member.status
  }));

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Set column widths
  const colWidths = [
    { wch: 8 },  // Sr. No
    { wch: 12 }, // Staff ID
    { wch: 20 }, // Name
    { wch: 15 }, // Mobile No
    { wch: 25 }, // Email ID
    { wch: 18 }, // Teaching/Non-Teaching
    { wch: 20 }, // Department
    { wch: 15 }, // PAN Card
    { wch: 18 }, // Aadhaar Card
    { wch: 20 }, // Designation
    { wch: 25 }, // Qualifications
    { wch: 12 }, // Experience (Years)
    { wch: 12 }, // Experience (Months)
    { wch: 15 }, // Date of Birth
    { wch: 15 }, // Date of Joining
    { wch: 15 }, // Date of Leaving
    { wch: 10 }  // Status
  ];
  ws['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Staff Data');

  // Generate filename with current date
  const filename = `staff_data_${new Date().toISOString().split('T')[0]}.xlsx`;

  // Save file
  XLSX.writeFile(wb, filename);
};