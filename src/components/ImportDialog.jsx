import * as Dialog from '@radix-ui/react-dialog';
import { X, Upload, FileSpreadsheet, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { importFromExcel } from '../utils/importFromExcel';
import * as XLSX from 'xlsx';

const ImportDialog = ({ isOpen, onClose, onImport }) => {
  const [dragActive, setDragActive] = useState(false);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      setError('Please select a valid Excel file (.xlsx or .xls)');
      return;
    }

    setImporting(true);
    setError('');

    try {
      const staffData = await importFromExcel(file);
      
      if (staffData.length === 0) {
        setError('No valid staff data found in the file. Please check the format.');
        return;
      }

      onImport(staffData);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const templateData = [{
      'Staff ID': 'S001',
      'Name': 'John Doe',
      'Mobile No': '9876543210',
      'Email ID': 'john.doe@example.com',
      'Teaching/Non-Teaching': 'Teaching',
      'Department': 'Computer Science',
      'PAN Card': 'ABCDE1234F',
      'Aadhaar Card': '1234-5678-9012',
      'Designation': 'Professor',
      'Qualifications': 'PhD Computer Science',
      'Experience (Years)': 5,
      'Experience (Months)': 6,
      'Date of Birth': '15-Jan-1985',
      'Date of Joining': '01-Jan-2020',
      'Date of Leaving': '',
      'Status': 'Active'
    }];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Staff Template');
    XLSX.writeFile(wb, 'staff_import_template.xlsx');
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md z-50 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Upload className="w-6 h-6 text-blue-600" />
              <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
                Import Staff Data
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </Dialog.Close>
          </div>

          <div className="p-6 space-y-4">
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Drag and drop your Excel file here, or
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileInput}
                  className="hidden"
                  disabled={importing}
                />
                <span className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                  {importing ? 'Importing...' : 'Browse Files'}
                </span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Supports .xlsx and .xls files
              </p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Need a template?
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                Download our Excel template with the correct format and sample data.
              </p>
              <button
                onClick={downloadTemplate}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Download Template
              </button>
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p>• Required fields: Staff ID, Name, Mobile No, Email ID, Designation</p>
              <p>• Date format: DD-MMM-YYYY (e.g., 01-Jan-2020)</p>
              <p>• Status: Active or Left</p>
              <p>• Duplicate Staff IDs will be skipped</p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ImportDialog;