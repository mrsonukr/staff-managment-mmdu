import { Edit, Trash2, Eye } from 'lucide-react';

const StaffTable = ({ staff, onEdit, onDelete, searchTerm, filters, selectedStaff, onSelectStaff, onSelectAll }) => {
  const filteredStaff = staff.filter(member => {
    // Search term filter
    const matchesSearch = !searchTerm || 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(member.staffId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.department && member.department.toLowerCase().includes(searchTerm.toLowerCase()));

    // Status filter
    const matchesStatus = !filters.status || member.status === filters.status;

    // Type filter
    const matchesType = !filters.type || member.type === filters.type;

    // Department filter
    const matchesDepartment = !filters.department || member.department === filters.department;

    // Experience filter
    const matchesExperience = !filters.experience || (() => {
      const totalYears = (member.experienceYears || 0) + Math.floor((member.experienceMonths || 0) / 12);
      switch (filters.experience) {
        case '0-2': return totalYears <= 2;
        case '3-5': return totalYears >= 3 && totalYears <= 5;
        case '6-10': return totalYears >= 6 && totalYears <= 10;
        case '10+': return totalYears > 10;
        default: return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesType && matchesDepartment && matchesExperience;
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const isAllSelected = filteredStaff.length > 0 && selectedStaff.size === filteredStaff.length;
  const isIndeterminate = selectedStaff.size > 0 && selectedStaff.size < filteredStaff.length;

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <table className="w-full text-left border-collapse text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
          <tr>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-12">
              <div className="flex items-center justify-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={onSelectAll}
                  className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-500 rounded-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-400 cursor-pointer"
                />
              </div>
            </th>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-16">Sr. No</th>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-20">Staff ID</th>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-32">Name</th>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-28">Mobile No</th>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-40">Email ID</th>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-20">Type</th>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-32">Department</th>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-24">PAN Card</th>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-28">Aadhaar Card</th>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-32">Designation</th>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-32">Qualifications</th>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-24">Experience</th>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-28">Date of Birth</th>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-28">Date of Joining</th>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-28">Date of Leaving</th>
            <th className="px-3 py-3 border-b border-r border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-20">Status</th>
            <th className="px-3 py-3 border-b border-gray-300 dark:border-gray-600 font-semibold whitespace-nowrap w-20">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStaff.length === 0 ? (
            <tr>
              <td colSpan="18" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                {searchTerm ? 'No staff members found matching your search.' : 'No staff members added yet.'}
              </td>
            </tr>
          ) : (
            filteredStaff.map((member, index) => (
              <tr key={member.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-200 dark:border-gray-700 ${
                selectedStaff.has(member.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}>
                <td className="px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={selectedStaff.has(member.id)}
                      onChange={() => onSelectStaff(member.id)}
                      className="w-4 h-4 text-blue-600 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-500 rounded-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-400 cursor-pointer"
                    />
                  </div>
                </td>
                <td className="px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  {index + 1}
                </td>
                <td className="px-3 py-3 text-gray-900 dark:text-white font-medium whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  {member.staffId}
                </td>
                <td className="px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  <div className="truncate max-w-32" title={member.name}>{member.name}</div>
                </td>
                <td className="px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  {member.mobile}
                </td>
                <td className="px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  <div className="truncate max-w-40" title={member.email}>{member.email}</div>
                </td>
                <td className="px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.type === 'Teaching' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                      : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  }`}>
                    {member.type}
                  </span>
                </td>
                <td className="px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  <div className="truncate max-w-32" title={member.department || '-'}>{member.department || '-'}</div>
                </td>
                <td className="px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  {member.panCard || '-'}
                </td>
                <td className="px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  {member.aadhaarCard || '-'}
                </td>
                <td className="px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  <div className="truncate max-w-32" title={member.designation}>{member.designation}</div>
                </td>
                <td className="px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  <div className="truncate max-w-32" title={member.qualifications || '-'}>{member.qualifications || '-'}</div>
                </td>
                <td className="px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  {(() => {
                    const years = member.experienceYears || 0;
                    const months = member.experienceMonths || 0;
                    
                    // If both are 0 or null, show "-"
                    if (years === 0 && months === 0) return '-';
                    
                    // Calculate total days for better display
                    const totalDays = (years * 365) + (months * 30);
                    
                    if (totalDays < 30) {
                      return totalDays === 1 ? '1 day' : `${totalDays} days`;
                    } else if (totalDays < 365) {
                      const monthsOnly = Math.floor(totalDays / 30);
                      return monthsOnly === 1 ? '1 month' : `${monthsOnly} months`;
                    } else {
                      if (months === 0) {
                        return years === 1 ? '1 year' : `${years} years`;
                      } else {
                        return `${years}Y ${months}M`;
                      }
                    }
                  })()}
                </td>
                <td className="px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  {formatDate(member.dateOfBirth)}
                </td>
                <td className="px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  {formatDate(member.dateOfJoining)}
                </td>
                <td className="px-3 py-3 text-gray-900 dark:text-white whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  {formatDate(member.dateOfRelieving)}
                </td>
                <td className="px-3 py-3 whitespace-nowrap border-r border-gray-200 dark:border-gray-700">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    member.status === 'Active' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-3 py-3 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(member)}
                      className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(member.id)}
                      className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;