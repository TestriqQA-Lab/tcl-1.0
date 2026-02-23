"use client";

import React from 'react';
import { SectionCard } from '../SectionCard';
import { FormInput } from '../FormInput';
import { FormSelect } from '../FormSelect';
import { DatePicker } from '../DatePicker';
import { EducationData } from '@/lib/profileTypes';
import { GraduationCap, School } from 'lucide-react';

interface EducationSectionProps {
    data: EducationData;
    onChange: (data: EducationData) => void;
    isComplete?: boolean;
}

const qualificationOptions = [
    { value: 'high-school', label: 'High School' },
    { value: 'diploma', label: 'Diploma' },
    { value: 'bachelors', label: "Bachelor's Degree" },
    { value: 'masters', label: "Master's Degree" },
    { value: 'phd', label: 'PhD' },
];

export const EducationSection: React.FC<EducationSectionProps> = ({
    data,
    onChange,
    isComplete = false,
}) => {
    return (
        <SectionCard
            title="Education Details"
            subtitle="Academic qualifications and achievements"
            isComplete={isComplete}
        >
            <div className="space-y-6">
                {/* Highest Qualification */}
                <div className="bg-gradient-to-r from-primary/5 to-blue-50 p-5 rounded-2xl border border-primary/20">
                    <div className="flex items-center gap-2 mb-4">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-slate-900">Current / Highest Qualification</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormSelect
                            label="Qualification Level"
                            name="highestQualification"
                            options={qualificationOptions}
                            value={data.highestQualification}
                            onChange={(e) => onChange({ ...data, highestQualification: e.target.value })}
                            required
                        />

                        <FormInput
                            label="Degree"
                            name="degree"
                            placeholder="e.g. B.Tech"
                            value={data.degree}
                            onChange={(e) => onChange({ ...data, degree: e.target.value })}
                            required
                        />

                        <FormInput
                            label="Course"
                            name="course"
                            placeholder="e.g. Computer Science"
                            value={data.course}
                            onChange={(e) => onChange({ ...data, course: e.target.value })}
                            required
                        />

                        <FormInput
                            label="Specialization"
                            name="specialization"
                            placeholder="e.g. AI & ML"
                            value={data.specialization}
                            onChange={(e) => onChange({ ...data, specialization: e.target.value })}
                        />

                        <FormInput
                            label="University / Institute"
                            name="university"
                            placeholder="e.g. IIT Delhi"
                            value={data.university}
                            onChange={(e) => onChange({ ...data, university: e.target.value })}
                            required
                            className="md:col-span-2"
                        />

                        <DatePicker
                            label="Start Year"
                            name="startYear"
                            type="month"
                            value={data.startYear}
                            onChange={(e) => onChange({ ...data, startYear: e.target.value })}
                            required
                        />

                        <DatePicker
                            label="End Year"
                            name="endYear"
                            type="month"
                            value={data.endYear}
                            onChange={(e) => onChange({ ...data, endYear: e.target.value })}
                            required
                        />
                    </div>
                </div>

                {/* Class XII */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                        <School className="w-5 h-5 text-slate-600" />
                        <h3 className="font-bold text-slate-900">Class XII (12th Standard)</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            label="Board"
                            name="classXII.board"
                            placeholder="e.g. CBSE"
                            value={data.classXII.board}
                            onChange={(e) =>
                                onChange({ ...data, classXII: { ...data.classXII, board: e.target.value } })
                            }
                        />

                        <FormInput
                            label="Stream"
                            name="classXII.stream"
                            placeholder="e.g. Science"
                            value={data.classXII.stream}
                            onChange={(e) =>
                                onChange({ ...data, classXII: { ...data.classXII, stream: e.target.value } })
                            }
                        />

                        <FormInput
                            label="School Name"
                            name="classXII.school"
                            placeholder="School name"
                            value={data.classXII.school}
                            onChange={(e) =>
                                onChange({ ...data, classXII: { ...data.classXII, school: e.target.value } })
                            }
                        />

                        <FormInput
                            label="Year of Passing"
                            name="classXII.year"
                            type="number"
                            placeholder="2020"
                            value={data.classXII.year}
                            onChange={(e) =>
                                onChange({ ...data, classXII: { ...data.classXII, year: e.target.value } })
                            }
                        />

                        <FormInput
                            label="Percentage / CGPA"
                            name="classXII.score"
                            placeholder="e.g. 90%"
                            value={data.classXII.score}
                            onChange={(e) =>
                                onChange({ ...data, classXII: { ...data.classXII, score: e.target.value } })
                            }
                        />
                    </div>
                </div>

                {/* Class X */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                    <div className="flex items-center gap-2 mb-4">
                        <School className="w-5 h-5 text-slate-600" />
                        <h3 className="font-bold text-slate-900">Class X (10th Standard)</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            label="Board"
                            name="classX.board"
                            placeholder="e.g. CBSE"
                            value={data.classX.board}
                            onChange={(e) =>
                                onChange({ ...data, classX: { ...data.classX, board: e.target.value } })
                            }
                        />

                        <FormInput
                            label="School Name"
                            name="classX.school"
                            placeholder="School name"
                            value={data.classX.school}
                            onChange={(e) =>
                                onChange({ ...data, classX: { ...data.classX, school: e.target.value } })
                            }
                        />

                        <FormInput
                            label="Year of Passing"
                            name="classX.year"
                            type="number"
                            placeholder="2018"
                            value={data.classX.year}
                            onChange={(e) =>
                                onChange({ ...data, classX: { ...data.classX, year: e.target.value } })
                            }
                        />

                        <FormInput
                            label="Percentage / CGPA"
                            name="classX.score"
                            placeholder="e.g. 95%"
                            value={data.classX.score}
                            onChange={(e) =>
                                onChange({ ...data, classX: { ...data.classX, score: e.target.value } })
                            }
                        />
                    </div>
                </div>
            </div>
        </SectionCard>
    );
};
