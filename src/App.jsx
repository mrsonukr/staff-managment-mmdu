import { useState, useEffect } from 'react';
import { Plus, Edit, Download, Upload, Search, Sun, Moon, Users, LogOut, Trash2, X } from 'lucide-react';
import StaffForm from './components/StaffForm';
import StaffTable from './components/StaffTable';
import StatsCards from './components/StatsCards';
import BirthdayCard from './components/BirthdayCard';
import FilterBar from './components/FilterBar';
import ConfirmDialog from './components/ConfirmDialog';
import ImportDialog from './components/ImportDialog';
import PasscodeScreen from './components/PasscodeScreen';
import SuccessToast from './components/SuccessToast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { exportToExcel } from './utils/exportToExcel';

function App() {
  const { isAuthenticated, login, logout } = useAuth();
  const [staff, setStaff] = useLocalStorage('staffData', []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStaff, setSelectedStaff] = useState(new Set());
  const [successMessage, setSuccessMessage] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    department: '',
    experience: ''
  });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, staffId: null, staffName: '' });
  const { theme, toggleTheme } = useTheme();

  // Show passcode screen if not authenticated
  if (!isAuthenticated) {
    return <PasscodeScreen onAuthenticated={login} />;
  }

  // Generate unique ID for new staff
  const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  };

  const handleAddStaff = (staffData) => {
    const newStaff = {
      ...staffData,
      id: generateId(),
      createdAt: new Date().toISOString()
    };
    setStaff(prev => [...prev, newStaff]);
    setSuccessMessage('Staff member added successfully!');
  };

  const handleEditStaff = (staffData) => {
    setStaff(prev => prev.map(member => 
      member.id === staffData.id 
        ? { ...staffData, updatedAt: new Date().toISOString() }
        : member
    ));
    setEditingStaff(null);
    setSuccessMessage('Staff member updated successfully!');
  };

  const handleDeleteStaff = (id) => {
    const staffMember = staff.find(member => member.id === id);
    setDeleteConfirm({
      isOpen: true,
      staffId: id,
      staffName: staffMember?.name || 'this staff member'
    });
  };

  const confirmDelete = () => {
    if (deleteConfirm.staffId === 'selected') {
      // Delete selected staff
      setStaff(prev => prev.filter(member => !selectedStaff.has(member.id)));
      setSuccessMessage(`Successfully deleted ${selectedStaff.size} staff member(s)!`);
      setSelectedStaff(new Set());
    } else {
      // Delete single staff
      setStaff(prev => prev.filter(member => member.id !== deleteConfirm.staffId));
      setSuccessMessage('Staff member deleted successfully!');
    }
    setDeleteConfirm({ isOpen: false, staffId: null, staffName: '' });
  };

  const handleImport = (importedStaff) => {
    // Check for duplicate staff IDs
    const existingIds = new Set(staff.map(member => member.staffId));
    const newStaff = importedStaff.filter(member => !existingIds.has(member.staffId));
    
    const duplicateCount = importedStaff.length - newStaff.length;
    
    if (duplicateCount > 0) {
      setSuccessMessage(`Successfully imported ${newStaff.length} staff members. ${duplicateCount} duplicate(s) were skipped.`);
    } else {
      setSuccessMessage(`Successfully imported ${newStaff.length} staff members!`);
    }
    
    setStaff(prev => [...prev, ...newStaff]);
  };

  const openEditForm = (staffMember) => {
    setEditingStaff(staffMember);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingStaff(null);
  };

  const handleFormSubmit = (staffData) => {
    if (editingStaff) {
      handleEditStaff(staffData);
    } else {
      handleAddStaff(staffData);
    }
  };

  // Get filtered staff for export
  const getFilteredStaff = () => {
    return staff.filter(member => {
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
  };

  const handleBulkDelete = () => {
    if (selectedStaff.size === 0) return;
    
    setDeleteConfirm({
      isOpen: true,
      staffId: 'selected',
      staffName: `${selectedStaff.size} selected staff member(s)`
    });
  };

  const handleSelectAll = () => {
    const filteredStaff = getFilteredStaff();
    if (selectedStaff.size === filteredStaff.length) {
      // Deselect all
      setSelectedStaff(new Set());
    } else {
      // Select all filtered staff
      setSelectedStaff(new Set(filteredStaff.map(member => member.id)));
    }
  };

  const handleSelectStaff = (staffId) => {
    const newSelected = new Set(selectedStaff);
    if (newSelected.has(staffId)) {
      newSelected.delete(staffId);
    } else {
      newSelected.add(staffId);
    }
    setSelectedStaff(newSelected);
  };

  const handleExport = () => {
    const dataToExport = selectedStaff.size > 0 
      ? staff.filter(member => selectedStaff.has(member.id))
      : getFilteredStaff();
    
    exportToExcel(dataToExport);
    setSuccessMessage(`Successfully exported ${dataToExport.length} staff member(s)!`);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      status: '',
      type: '',
      department: '',
      experience: ''
    });
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Staff Management System
                </h1>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                >
                  {theme === 'light' ? (
                    <Moon className="w-5 h-5 text-gray-600" />
                  ) : (
                    <Sun className="w-5 h-5 text-yellow-500" />
                  )}
                </button>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <StatsCards staff={staff} />
              </div>
              <div>
                <BirthdayCard staff={staff} />
              </div>
            </div>

            {/* Filters */}
            <FilterBar 
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />

            {/* Action Buttons */}
            <div className="space-y-4">
              {/* Selection Actions */}
              {selectedStaff.size > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">{selectedStaff.size}</span>
                      </div>
                      <span className="text-blue-800 dark:text-blue-200 font-medium">
                        {selectedStaff.size} staff member(s) selected
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={handleExport}
                        className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export Selected</span>
                      </button>
                      <button
                        onClick={handleBulkDelete}
                        className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete Selected</span>
                      </button>
                      <button
                        onClick={() => setSelectedStaff(new Set())}
                        className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                      >
                        <X className="w-4 h-4" />
                        <span>Clear Selection</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Action Buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4">
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium w-full sm:w-auto justify-center sm:justify-start"
              >
                <Plus className="w-4 h-4" />
                <span>Add Staff</span>
              </button>
              
              {/* Only show export all when no staff are selected */}
              {selectedStaff.size === 0 && (
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto justify-center sm:justify-start"
                  disabled={getFilteredStaff().length === 0}
                >
                  <Download className="w-4 h-4" />
                  <span>Export All Data</span>
                </button>
              )}

              <button
                onClick={() => setIsImportOpen(true)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors font-medium w-full sm:w-auto justify-center sm:justify-start"
              >
                <Upload className="w-4 h-4" />
                <span>Import from XLSX</span>
              </button>

              <div className="flex items-center space-x-2 w-full sm:w-auto sm:ml-auto">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search staff..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white w-full sm:w-80"
                />
              </div>
            </div>
            </div>

            {/* Staff Table */}
            <StaffTable
              staff={staff}
              onEdit={openEditForm}
              onDelete={handleDeleteStaff}
              searchTerm={searchTerm}
              filters={filters}
              selectedStaff={selectedStaff}
              onSelectStaff={handleSelectStaff}
              onSelectAll={handleSelectAll}
            />
          </div>
        </div>
      </div>

      {/* Success Toast */}
      <SuccessToast 
        message={successMessage} 
        onClose={() => setSuccessMessage('')} 
      />

      {/* Staff Form Modal */}
      <StaffForm
        isOpen={isFormOpen}
        onClose={closeForm}
        onSubmit={handleFormSubmit}
        editingStaff={editingStaff}
      />

      {/* Import Dialog */}
      <ImportDialog
        isOpen={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        onImport={handleImport}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm({ isOpen: false, staffId: null, staffName: '' })}
        onConfirm={confirmDelete}
        title="Delete Staff Member"
        description={`Are you sure you want to delete ${deleteConfirm.staffName}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}

export default App;