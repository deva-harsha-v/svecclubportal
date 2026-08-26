import React, { useState, useEffect } from 'react';
import { Search, Eye } from 'lucide-react';
import { api } from '../../services/api';
import { StudentOut } from '../../types';
import { Modal } from '../../components/ui/Modal';
import { Pagination } from '../../components/ui/Pagination';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export const StudentManagementPage: React.FC = () => {
  const [students, setStudents] = useState<StudentOut[]>([]);
  const [search, setSearch] = useState('');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<any | null>(null);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const limit = 50;

  useEffect(() => {
    fetchStudents();
  }, [search, offset]);

  const fetchStudents = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getStudents(search, undefined, limit, offset);
      setStudents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch students list.');
    } finally {
      setLoading(false);
    }
  };

  const handleInspectStudent = async (studentId: number) => {
    try {
      const detail = await api.getStudentDetail(studentId);
      setSelectedStudentDetail(detail);
    } catch (err: any) {
      alert(err.message || 'Failed to fetch student details.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-display font-bold text-2xl text-[#FFE5F1]">Student Directory</h1>
          <p className="text-xs text-[rgba(255,229,241,0.68)] font-mono mt-0.5">
            Central repository of unique registered students and joined organizations
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[rgba(255,229,241,0.45)]" />
        <input
          type="text"
          placeholder="Search name, roll number, or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setOffset(0);
          }}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#010030]/80 border border-[#7226FF]/35 text-[#FFE5F1] placeholder:text-[rgba(255,229,241,0.4)] text-xs focus:outline-none focus:border-[#F042FF]"
        />
      </div>

      {error && <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">{error}</div>}

      {loading ? (
        <LoadingSpinner label="Loading student directory..." />
      ) : (
        <div className="glass-panel rounded-3xl border border-[#7226FF]/35 bg-[#160078]/60 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto -webkit-overflow-scrolling-touch">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>Branch & Section</th>
                  <th>Contact Info</th>
                  <th>Clubs Joined</th>
                  <th className="text-right">Inspect</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="font-bold text-[#FFE5F1] text-sm">
                      {student.name}
                    </td>
                    <td className="font-mono font-semibold text-[#87F5F5]">
                      {student.roll_number}
                    </td>
                    <td className="text-[rgba(255,229,241,0.8)] font-medium">
                      {student.branch} {student.section ? `(${student.section})` : ''}
                    </td>
                    <td className="font-mono text-[11px] text-[rgba(255,229,241,0.65)]">
                      <div>{student.email}</div>
                      <div>{student.phone}</div>
                    </td>
                    <td>
                      <span className="font-mono text-xs font-bold text-[#F042FF] bg-[#F042FF]/15 border border-[#F042FF]/30 px-2.5 py-0.5 rounded-full">
                        {student.club_count} {student.club_count === 1 ? 'club' : 'clubs'}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        onClick={() => handleInspectStudent(student.id)}
                        className="p-1.5 rounded-lg bg-[#010030] border border-[#7226FF]/35 text-[#87F5F5] hover:border-[#F042FF] transition"
                        title="View Joined Clubs"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination offset={offset} limit={limit} onPageChange={setOffset} />
        </div>
      )}

      {/* Inspection Modal */}
      <Modal
        isOpen={!!selectedStudentDetail}
        onClose={() => setSelectedStudentDetail(null)}
        title={`Student Profile: ${selectedStudentDetail?.name || ''}`}
      >
        {selectedStudentDetail && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-[#010030]/80 border border-[#7226FF]/30 text-xs">
              <div>
                <span className="font-mono text-[#87F5F5] uppercase text-[10px]">Roll Number</span>
                <div className="font-mono font-bold text-[#FFE5F1] text-sm">{selectedStudentDetail.roll_number}</div>
              </div>
              <div>
                <span className="font-mono text-[#87F5F5] uppercase text-[10px]">Branch & Section</span>
                <div className="font-semibold text-[#FFE5F1]">{selectedStudentDetail.branch} ({selectedStudentDetail.section || 'N/A'})</div>
              </div>
              <div>
                <span className="font-mono text-[#87F5F5] uppercase text-[10px]">Email</span>
                <div className="font-mono text-[rgba(255,229,241,0.8)]">{selectedStudentDetail.email}</div>
              </div>
              <div>
                <span className="font-mono text-[#87F5F5] uppercase text-[10px]">Phone</span>
                <div className="font-mono text-[rgba(255,229,241,0.8)]">{selectedStudentDetail.phone}</div>
              </div>
            </div>

            <div>
              <h4 className="font-display font-bold text-sm text-[#FFE5F1] mb-3">
                Selected & Registered Clubs ({selectedStudentDetail.registered_clubs?.length || 0})
              </h4>
              <div className="space-y-2">
                {selectedStudentDetail.registered_clubs?.map((club: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-[#160078]/60 border border-[#7226FF]/30">
                    <div>
                      <div className="font-bold text-xs text-[#FFE5F1]">{club.name}</div>
                      <div className="font-mono text-[10px] text-[#87F5F5]">{club.category}</div>
                    </div>
                    <span className="font-mono text-[10px] text-[rgba(255,229,241,0.6)]">
                      {new Date(club.registered_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
