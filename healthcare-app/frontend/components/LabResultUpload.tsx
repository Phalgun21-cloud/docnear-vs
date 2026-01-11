import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { useToast } from './ui/use-toast';
import { Upload, FileText, CheckCircle, XCircle, Download } from 'lucide-react';
import { labAPI } from '../services/api';

interface LabTest {
  _id: string;
  testType: string;
  testName: string;
  status: string;
  orderDate: string;
  resultDate?: string;
  resultFile?: {
    url: string;
    fileName: string;
    uploadedAt: string;
  };
  patientId: {
    name: string;
    email: string;
  };
}

interface LabResultUploadProps {
  labTest: LabTest;
  onUploadSuccess: () => void;
}

export const LabResultUpload = ({ labTest, onUploadSuccess }: LabResultUploadProps) => {
  const { toast } = useToast();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: 'Invalid File Type',
          description: 'Please upload PDF, JPG, JPEG, or PNG files only.',
          variant: 'destructive',
        });
        return;
      }
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File Too Large',
          description: 'File size must be less than 10MB.',
          variant: 'destructive',
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No File Selected',
        description: 'Please select a file to upload.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resultFile', selectedFile);
      formData.append('testId', labTest._id);

      const response = await labAPI.uploadResult(formData);

      if (response.data.success) {
        toast({
          title: 'Upload Successful!',
          description: 'Lab test result uploaded successfully.',
        });
        setUploadOpen(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        onUploadSuccess();
      }
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.response?.data?.message || 'Failed to upload result. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Card className="border border-gray-200 hover:border-primary/50 transition-colors">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg mb-1">{labTest.testName}</CardTitle>
              <p className="text-sm text-gray-600">{labTest.testType}</p>
            </div>
            <Badge
              variant={
                labTest.status === 'Completed'
                  ? 'success'
                  : labTest.status === 'In Progress'
                  ? 'warning'
                  : 'secondary'
              }
              className="text-xs"
            >
              {labTest.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1">Patient</p>
              <p className="font-semibold text-gray-900">{labTest.patientId.name}</p>
              <p className="text-sm text-gray-600">{labTest.patientId.email}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 mb-1">Order Date</p>
              <p className="text-sm text-gray-900">
                {new Date(labTest.orderDate).toLocaleDateString()}
              </p>
            </div>

            {labTest.resultFile ? (
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-800">Result Uploaded</span>
                </div>
                <p className="text-sm text-gray-700 mb-2">{labTest.resultFile.fileName}</p>
                <p className="text-xs text-gray-500">
                  Uploaded: {new Date(labTest.resultFile.uploadedAt).toLocaleDateString()}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => window.open(labTest.resultFile?.url, '_blank')}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Result
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setUploadOpen(true)}
                className="w-full btn-gradient"
                disabled={labTest.status === 'Pending'}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Result
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Lab Test Result</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Test: <span className="font-semibold">{labTest.testName}</span>
              </p>
              <p className="text-sm text-gray-600 mb-4">
                Patient: <span className="font-semibold">{labTest.patientId.name}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Result File
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-10 h-10 text-gray-400 mb-2" />
                  <span className="text-sm font-semibold text-gray-700 mb-1">
                    Click to upload or drag and drop
                  </span>
                  <span className="text-xs text-gray-500">
                    PDF, JPG, JPEG, PNG (Max 10MB)
                  </span>
                </label>
              </div>
              {selectedFile && (
                <div className="mt-4 p-3 bg-primary/5 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedFile.name}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setUploadOpen(false);
                  setSelectedFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="flex-1 btn-gradient"
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Uploading...
                  </div>
                ) : (
                  <>
                    <Upload className="mr-2 w-4 h-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
