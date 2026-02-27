'use client';

import React, { useState, useEffect } from 'react';
import { Trophy, Trash2, Plus, Pencil } from 'lucide-react';
import SectionContainer from '../SectionContainer';
import EditCertificationModal, { CertificationData } from '../modals/EditCertificationModal';
import EditAwardModal, { AwardData } from '../modals/EditAwardModal';
import EditClubModal, { ClubData } from '../modals/EditClubModal';

function dbToCert(row: any): CertificationData & { dbId: string } {
    return {
        dbId: row.id,
        id: row.id,
        name: row.title || '',
        completionId: row.completionId || '',
        url: row.url || '',
        startMonth: row.startMonth || '',
        startYear: row.startYear || '',
        endMonth: row.endMonth || '',
        endYear: row.endYear || '',
        doesNotExpire: row.doesNotExpire || false,
    };
}

function dbToAward(row: any): AwardData & { dbId: string } {
    return {
        dbId: row.id,
        id: row.id,
        title: row.title || '',
        issuer: row.organization || '',
        issueMonth: row.startMonth || '',
        issueYear: row.startYear || '',
        description: row.description || ''
    };
}

function dbToClub(row: any): ClubData & { dbId: string } {
    return {
        dbId: row.id,
        id: row.id,
        clubName: row.title || '',
        position: row.organization || '',
        startMonth: row.startMonth || '',
        startYear: row.startYear || '',
        endMonth: row.endMonth || '',
        endYear: row.endYear || '',
        isCurrent: row.isCurrent || false,
        description: row.description || '',
    };
}

const Accomplishments = () => {
    const [certifications, setCertifications] = useState<(CertificationData & { dbId?: string })[]>([]);
    const [awards, setAwards] = useState<(AwardData & { dbId?: string })[]>([]);
    const [clubs, setClubs] = useState<(ClubData & { dbId?: string })[]>([]);

    const [activeModal, setActiveModal] = useState<'cert' | 'award' | 'club' | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/profile/achievements')
            .then(res => res.json())
            .then(json => {
                if (Array.isArray(json)) {
                    setCertifications(json.filter((a: any) => a.type === 'CERTIFICATION').map(dbToCert));
                    setAwards(json.filter((a: any) => a.type === 'AWARD').map(dbToAward));
                    setClubs(json.filter((a: any) => a.type === 'CLUB').map(dbToClub));
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    async function saveAchievement(type: string, data: any, dbId?: string) {
        if (dbId) {
            return fetch('/api/profile/achievements', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: dbId, type, ...data }),
            }).then(r => r.json());
        } else {
            return fetch('/api/profile/achievements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, ...data }),
            }).then(r => r.json());
        }
    }

    async function deleteAchievement(dbId: string) {
        await fetch(`/api/profile/achievements?id=${dbId}`, { method: 'DELETE' });
    }

    const handleSaveCert = async (data: CertificationData) => {
        const dbId = editingIndex !== null ? (certifications[editingIndex] as any)?.dbId : undefined;
        const saved = await saveAchievement('CERTIFICATION', { title: data.name, score: data.completionId, description: data.url, startYear: data.startYear }, dbId);
        const mapped = dbToCert(saved);
        if (editingIndex !== null) {
            setCertifications(prev => { const n = [...prev]; n[editingIndex] = mapped; return n; });
        } else {
            setCertifications(prev => [...prev, mapped]);
        }
        closeModal();
    };

    const handleDeleteCert = async (index: number) => {
        const item = certifications[index] as any;
        if (item?.dbId) await deleteAchievement(item.dbId);
        setCertifications(certifications.filter((_, i) => i !== index));
    };

    const handleSaveAward = async (data: AwardData) => {
        const dbId = editingIndex !== null ? (awards[editingIndex] as any)?.dbId : undefined;
        const saved = await saveAchievement('AWARD', { title: 'Award', description: data.description }, dbId);
        const mapped = dbToAward(saved);
        if (editingIndex !== null) {
            setAwards(prev => { const n = [...prev]; n[editingIndex] = mapped; return n; });
        } else {
            setAwards(prev => [...prev, mapped]);
        }
        closeModal();
    };

    const handleDeleteAward = async (index: number) => {
        const item = awards[index] as any;
        if (item?.dbId) await deleteAchievement(item.dbId);
        setAwards(awards.filter((_, i) => i !== index));
    };

    const handleSaveClub = async (data: ClubData) => {
        const dbId = editingIndex !== null ? (clubs[editingIndex] as any)?.dbId : undefined;
        const saved = await saveAchievement('CLUB', {
            title: data.position,
            organization: data.clubName,
            description: data.description,
            date: data.startYear ? `${data.startYear}-01-01` : null,
        }, dbId);
        const mapped = dbToClub(saved);
        if (editingIndex !== null) {
            setClubs(prev => { const n = [...prev]; n[editingIndex] = mapped; return n; });
        } else {
            setClubs(prev => [...prev, mapped]);
        }
        closeModal();
    };

    const handleDeleteClub = async (index: number) => {
        const item = clubs[index] as any;
        if (item?.dbId) await deleteAchievement(item.dbId);
        setClubs(clubs.filter((_, i) => i !== index));
    };

    const closeModal = () => { setActiveModal(null); setEditingIndex(null); };
    const openModal = (type: 'cert' | 'award' | 'club', index: number | null = null) => {
        setActiveModal(type); setEditingIndex(index);
    };

    return (
        <SectionContainer id="accomplishments" title="Accomplishments" icon={<Trophy />}>
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-xl" />)}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
                    {/* Certifications */}
                    {certifications.length === 0 ? (
                        <div onClick={() => openModal('cert')} className="border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer bg-white group min-h-[160px]">
                            <div className="text-[#117a7a] mb-2 group-hover:scale-110 transition-transform"><Trophy size={24} /></div>
                            <span className="text-xs font-bold text-gray-900 mb-2">Certifications</span>
                            <span className="text-[10px] font-bold text-[#117a7a] uppercase">Add Certification</span>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-bold text-gray-700">Certifications</h4>
                                <button onClick={() => openModal('cert')} className="text-xs font-bold text-[#117a7a] flex items-center gap-1 hover:underline"><Plus size={12} /> Add</button>
                            </div>
                            <div className="space-y-3 flex-1">
                                {certifications.map((cert, i) => (
                                    <div key={cert.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group border border-transparent hover:border-gray-200">
                                        <div className="text-[#117a7a] min-w-[20px]"><Trophy size={20} /></div>
                                        <div className="overflow-hidden">
                                            <p className="text-sm font-bold text-gray-900 truncate">{cert.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{cert.startYear} {cert.doesNotExpire ? '- No Expiration' : ''}</p>
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

                    {/* Awards */}
                    {awards.length === 0 ? (
                        <div onClick={() => openModal('award')} className="border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer bg-white group min-h-[160px]">
                            <div className="text-[#117a7a] mb-2 group-hover:scale-110 transition-transform"><Trophy size={24} /></div>
                            <span className="text-xs font-bold text-gray-900 mb-2">Awards</span>
                            <span className="text-[10px] font-bold text-[#117a7a] uppercase">Add Award</span>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-bold text-gray-700">Awards</h4>
                                <button onClick={() => openModal('award')} className="text-xs font-bold text-[#117a7a] flex items-center gap-1 hover:underline"><Plus size={12} /> Add</button>
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

                    {/* Clubs */}
                    {clubs.length === 0 ? (
                        <div onClick={() => openModal('club')} className="border border-gray-100 rounded-xl p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow cursor-pointer bg-white group min-h-[160px]">
                            <div className="text-[#117a7a] mb-2 group-hover:scale-110 transition-transform"><Trophy size={24} /></div>
                            <span className="text-xs font-bold text-gray-900 mb-2">Clubs & Committees</span>
                            <span className="text-[10px] font-bold text-[#117a7a] uppercase">Add Club</span>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="text-sm font-bold text-gray-700">Clubs & Committees</h4>
                                <button onClick={() => openModal('club')} className="text-xs font-bold text-[#117a7a] flex items-center gap-1 hover:underline"><Plus size={12} /> Add</button>
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
            )}

            <EditCertificationModal isOpen={activeModal === 'cert'} onClose={closeModal} initialData={editingIndex !== null && activeModal === 'cert' ? certifications[editingIndex] as CertificationData : undefined} onSave={handleSaveCert} />
            <EditAwardModal isOpen={activeModal === 'award'} onClose={closeModal} initialData={editingIndex !== null && activeModal === 'award' ? awards[editingIndex] as AwardData : undefined} onSave={handleSaveAward} />
            <EditClubModal isOpen={activeModal === 'club'} onClose={closeModal} initialData={editingIndex !== null && activeModal === 'club' ? clubs[editingIndex] as ClubData : undefined} onSave={handleSaveClub} />
        </SectionContainer>
    );
};

export default Accomplishments;
