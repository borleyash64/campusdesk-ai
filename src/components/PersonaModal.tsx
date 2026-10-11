import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, Globe, GraduationCap } from 'lucide-react';
import { StudentProfile } from '../types.ts';

interface PersonaModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudent: StudentProfile;
  onSelectStudent: (student: StudentProfile) => void;
}

const PRESET_STUDENTS: StudentProfile[] = [
  {
    id: 'student-1',
    name: 'Alex Rivera',
    studentId: 'STU-2024-9841',
    email: 'arivera@university.edu',
    year: 'Sophomore',
    major: 'Computer Science',
    gpa: 3.42,
    isInternational: false,
    earnedCredits: 42
  },
  {
    id: 'student-2',
    name: 'Priya Sharma',
    studentId: 'STU-2023-5520',
    email: 'psharma@university.edu',
    year: 'Junior',
    major: 'Data Science & AI',
    gpa: 3.85,
    isInternational: true,
    visaType: 'F-1 Visa',
    earnedCredits: 68
  },
  {
    id: 'student-3',
    name: 'Marcus Vance',
    studentId: 'STU-2022-1089',
    email: 'mvance@university.edu',
    year: 'Senior',
    major: 'Business Administration',
    gpa: 3.18,
    isInternational: false,
    earnedCredits: 104
  },
  {
    id: 'student-4',
    name: 'Chloe Kim',
    studentId: 'STU-2025-0043',
    email: 'ckim@university.edu',
    year: 'Freshman',
    major: 'Software Engineering (Pre-Major)',
    gpa: 3.60,
    isInternational: false,
    earnedCredits: 15
  }
];

export const PersonaModal: React.FC<PersonaModalProps> = ({
  isOpen,
  onClose,
  currentStudent,
  onSelectStudent
}) => {
  const [customMode, setCustomMode] = useState(false);
  const [formData, setFormData] = useState<StudentProfile>(currentStudent);

  if (!isOpen) return null;

  const handleSaveCustom = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectStudent(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-indigo-600" />
              Student Context & Persona
            </h2>
            <p className="text-xs text-slate-500">
              The chatbot tailors prerequisite warnings, CPT visa rules, and graduation dates to this student profile.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 max-h-[75vh] overflow-y-auto">
          {!customMode ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Select Quick Profile
                </span>
                <button
                  onClick={() => {
                    setFormData(currentStudent);
                    setCustomMode(true);
                  }}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-800 underline"
                >
                  Create Custom Profile
                </button>
              </div>

              {PRESET_STUDENTS.map((preset) => {
                const isSelected = preset.id === currentStudent.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => {
                      onSelectStudent(preset);
                      onClose();
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                          {preset.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-slate-900">
                              {preset.name}
                            </span>
                            {preset.isInternational && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                                <Globe className="w-2.5 h-2.5" />
                                F-1 Visa
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600">
                            {preset.year} • {preset.major}
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-xs">
                        <span className="font-semibold text-slate-800">GPA {preset.gpa.toFixed(2)}</span>
                        <p className="text-[11px] text-slate-500">{preset.earnedCredits} credits</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleSaveCustom} className="space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Custom Student Details
                </span>
                <button
                  type="button"
                  onClick={() => setCustomMode(false)}
                  className="text-xs font-medium text-slate-500 hover:text-slate-800 underline"
                >
                  Back to presets
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Academic Standing</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({ ...formData, year: e.target.value as any })}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Major / Program</label>
                  <input
                    type="text"
                    required
                    value={formData.major}
                    onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Cumulative GPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={formData.gpa}
                    onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) || 3.0 })}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Earned Credits</label>
                  <input
                    type="number"
                    min="0"
                    max="180"
                    value={formData.earnedCredits}
                    onChange={(e) => setFormData({ ...formData, earnedCredits: parseInt(e.target.value, 10) || 0 })}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={formData.isInternational}
                    onChange={(e) => setFormData({ ...formData, isInternational: e.target.checked })}
                    className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                  />
                  <span>International Student (F-1 / J-1 Visa, Requires CPT/OPT)</span>
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCustomMode(false)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Save & Apply
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
