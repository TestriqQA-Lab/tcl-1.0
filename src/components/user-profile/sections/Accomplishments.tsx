'use client';

import React, { useState } from 'react';
import { Trophy, Trash2, Plus, Pencil } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import EditCertificationModal, { CertificationData } from '../modals/EditCertificationModal';
import EditAwardModal, { AwardData } from '../modals/EditAwardModal';
import EditClubModal, { ClubData } from '../modals/EditClubModal';

const Accomplishments = () => {
    const [certifications, setCertifications] = useState<CertificationData[]>([]);
    const [awards, setAwards] = useState<AwardData[]>([]);
    const [clubs, setClubs] = useState<ClubData[]>([]);

    const [activeModal, setActiveModal] = useState<'cert' | 'award' | 'club' | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    // Handlers for Certifications
    const handleSaveCert = (data: CertificationData) => {
        if (editingIndex !== null) {
            const newCerts = [...certifications];
            newCerts[editingIndex] = data;
            setCertifications(newCerts);
        } else {
            setCertifications([...certifications, data]);
        }
        closeModal();
    };
    const handleDeleteCert = (index: number) => setCertifications(certifications.filter((_, i) => i !== index));

    // Handlers for Awards
    const handleSaveAward = (data: AwardData) => {
        if (editingIndex !== null) {
            const newAwards = [...awards];
            newAwards[editingIndex] = data;
            setAwards(newAwards);
        } else {
            setAwards([...awards, data]);
        }
        closeModal();
    };
    const handleDeleteAward = (index: number) => setAwards(awards.filter((_, i) => i !== index));

    // Handlers for Clubs
    const handleSaveClub = (data: ClubData) => {
        if (editingIndex !== null) {
            const newClubs = [...clubs];
            newClubs[editingIndex] = data;
            setClubs(newClubs);
        } else {
            setClubs([...clubs, data]);
        }
        closeModal();
    };
    const handleDeleteClub = (index: number) => setClubs(clubs.filter((_, i) => i !== index));

    const closeModal = () => {
        setActiveModal(null);
        setEditingIndex(null);
    };

    const openModal = (type: 'cert' | 'award' | 'club', index: number | null = null) => {
        setActiveModal(type);
        setEditingIndex(index);
    };

    const hasData = certifications.length > 0 || awards.length > 0 || clubs.length > 0;

    return (
        <SectionContainer id="accomplishments" title="Accomplishments" icon={<Trophy />}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
                {/* Certifications Section */}
                {certifications.length === 0 ? (
                    <div
                        onClick={() => openModal('cert')}
                        className="border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer bg-white group min-h-[160px]"
                    >
                        <div className="text-[#117a7a] mb-2 group-hover:scale-110 transition-transform"><Trophy size={24} /></div>
                        <span className="text-xs font-bold text-gray-900 mb-2">Certifications</span>
                        <span className="text-[10px] font-bold text-[#117a7a] uppercase">Add Certification</span>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-bold text-gray-700">Certifications</h4>
                            <button onClick={() => openModal('cert')} className="text-xs font-bold text-[#117a7a] flex items-center gap-1 hover:underline">
                                <Plus size={12} /> Add
                            </button>
                        </div>
                        <div className="space-y-3 flex-1">
                            {certifications.map((cert, i) => (
                                <div key={cert.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group border border-transparent hover:border-gray-200">
                                    <div className="text-[#117a7a] min-w-[20px]"><Trophy size={20} /></div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-gray-900 truncate">{cert.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{cert.startYear} - {cert.doesNotExpire ? 'No Expiration' : cert.endYear}</p>
                                    </div>
                                    <div className="ml-auto flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openModal('cert', i)} className="text-gray-400 hover:text-[#117a7a]"><Pencil size={14} /></button>
                                        <button onClick={() => handleDeleteCert(i)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Awards Section */}
                {awards.length === 0 ? (
                    <div
                        onClick={() => openModal('award')}
                        className="border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer bg-white group min-h-[160px]"
                    >
                        <div className="text-[#117a7a] mb-2 group-hover:scale-110 transition-transform"><Trophy size={24} /></div>
                        <span className="text-xs font-bold text-gray-900 mb-2">Awards</span>
                        <span className="text-[10px] font-bold text-[#117a7a] uppercase">Add Award</span>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-bold text-gray-700">Awards</h4>
                            <button onClick={() => openModal('award')} className="text-xs font-bold text-[#117a7a] flex items-center gap-1 hover:underline">
                                <Plus size={12} /> Add
                            </button>
                        </div>
                        <div className="space-y-3 flex-1">
                            {awards.map((award, i) => (
                                <div key={award.id} className="flex items-start gap-3 p-3 bg-emerald-50/30 rounded-lg hover:bg-emerald-50 transition-colors group border border-transparent hover:border-emerald-100">
                                    <div className="text-[#117a7a] mt-0.5 min-w-[20px]"><Trophy size={20} /></div>
                                    <p className="text-sm text-gray-700 line-clamp-3 leading-relaxed">{award.description}</p>
                                    <div className="ml-auto flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openModal('award', i)} className="text-gray-400 hover:text-[#117a7a]"><Pencil size={14} /></button>
                                        <button onClick={() => handleDeleteAward(i)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Clubs Section */}
                {clubs.length === 0 ? (
                    <div
                        onClick={() => openModal('club')}
                        className="border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer bg-white group min-h-[160px]"
                    >
                        <div className="text-[#117a7a] mb-2 group-hover:scale-110 transition-transform"><Trophy size={24} /></div>
                        <span className="text-xs font-bold text-gray-900 mb-2">Clubs & Committees</span>
                        <span className="text-[10px] font-bold text-[#117a7a] uppercase">Add Club</span>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="text-sm font-bold text-gray-700">Clubs & Committees</h4>
                            <button onClick={() => openModal('club')} className="text-xs font-bold text-[#117a7a] flex items-center gap-1 hover:underline">
                                <Plus size={12} /> Add
                            </button>
                        </div>
                        <div className="space-y-3 flex-1">
                            {clubs.map((club, i) => (
                                <div key={club.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group border border-transparent hover:border-gray-200">
                                    <div className="text-[#117a7a] min-w-[20px]"><Trophy size={20} /></div>
                                    <div className="overflow-hidden">
                                        <p className="text-sm font-bold text-gray-900 truncate">{club.position} <span className="font-normal text-gray-500">at {club.clubName}</span></p>
                                        <p className="text-xs text-gray-500 truncate">{club.startYear} - {club.isCurrent ? 'Present' : club.endYear}</p>
                                    </div>
                                    <div className="ml-auto flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => openModal('club', i)} className="text-gray-400 hover:text-[#117a7a]"><Pencil size={14} /></button>
                                        <button onClick={() => handleDeleteClub(i)} className="text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <EditCertificationModal
                isOpen={activeModal === 'cert'}
                onClose={closeModal}
                initialData={editingIndex !== null && activeModal === 'cert' ? certifications[editingIndex] : undefined}
                onSave={handleSaveCert}
            />
            <EditAwardModal
                isOpen={activeModal === 'award'}
                onClose={closeModal}
                initialData={editingIndex !== null && activeModal === 'award' ? awards[editingIndex] : undefined}
                onSave={handleSaveAward}
            />
            <EditClubModal
                isOpen={activeModal === 'club'}
                onClose={closeModal}
                initialData={editingIndex !== null && activeModal === 'club' ? clubs[editingIndex] : undefined}
                onSave={handleSaveClub}
            />
        </SectionContainer>
    );
};

export default Accomplishments;
