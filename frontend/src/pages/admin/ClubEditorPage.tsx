import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Plus, Trash2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';
import { ClubLead } from '../../types';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { getLogoUrl, compressImage } from '../../utils/logoHelper';

export const ClubEditorPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const isEdit = !!slug;
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Technical',
    tagline: '',
    description: '',
    what_we_do_raw: '',
    domains_raw: '',
    logo: '',
    banner: '',
    faculty_coordinator: '',
    instagram: '',
    linkedin: '',
    website: '',
    registration_open: true,
    is_active: true,
  });

  const [leads, setLeads] = useState<ClubLead[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);

  useEffect(() => {
    if (isEdit && slug) {
      fetchClub(slug);
    }
  }, [slug]);

  const fetchClub = async (clubSlug: string) => {
    setLoading(true);
    try {
      const club = await api.getClubBySlug(clubSlug);
      setFormData({
        name: club.name,
        slug: club.slug,
        category: club.category,
        tagline: club.tagline || '',
        description: club.description || '',
        what_we_do_raw: (club.what_we_do || []).join('\n'),
        domains_raw: (club.domains || []).join(', '),
        logo: club.logo || '',
        banner: club.banner || '',
        faculty_coordinator: club.faculty_coordinator || '',
        instagram: club.instagram || '',
        linkedin: club.linkedin || '',
        website: club.website || '',
        registration_open: club.registration_open,
        is_active: club.is_active,
      });
      setLeads(club.leads || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load club details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = () => {
    setLeads([...leads, { name: '', role: '', is_public: true }]);
  };

  const handleLeadChange = (index: number, field: keyof ClubLead, value: any) => {
    const next = [...leads];
    next[index] = { ...next[index], [field]: value };
    setLeads(next);
  };

  const handleRemoveLead = (index: number) => {
    setLeads(leads.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const what_we_do = formData.what_we_do_raw
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const domains = formData.domains_raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      let uploadedLogoUrl = formData.logo;
      if (logoFile && !uploadedLogoUrl.startsWith('data:')) {
        try {
          const logoRes = await api.uploadLogo(formData.slug || 'temp', logoFile);
          uploadedLogoUrl = logoRes.logo_url;
        } catch {
          // Keep base64 if server upload fails
        }
      }

      let uploadedBannerUrl = formData.banner;
      if (bannerFile && !uploadedBannerUrl.startsWith('data:')) {
        try {
          const bannerRes = await api.uploadBanner(formData.slug || 'temp', bannerFile);
          uploadedBannerUrl = bannerRes.banner_url;
        } catch {
          // Keep base64 if server upload fails
        }
      }

      const payload = {
        name: formData.name,
        slug: formData.slug,
        category: formData.category,
        tagline: formData.tagline || undefined,
        description: formData.description || undefined,
        what_we_do,
        domains,
        logo: uploadedLogoUrl || undefined,
        banner: uploadedBannerUrl || undefined,
        faculty_coordinator: formData.faculty_coordinator || undefined,
        instagram: formData.instagram || undefined,
        linkedin: formData.linkedin || undefined,
        website: formData.website || undefined,
        registration_open: formData.registration_open,
        is_active: formData.is_active,
        leads: leads.filter((l) => l.name.trim().length > 0),
      };

      if (isEdit && slug) {
        await api.updateClub(slug, payload);
      } else {
        await api.createClub(payload);
      }

      navigate('/admin/clubs');
    } catch (err: any) {
      setError(err.message || 'Failed to save club configuration.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading club editor..." />;

  const inputClasses =
    'w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition placeholder:text-slate-500 disabled:opacity-50 disabled:bg-slate-900/40 font-sans';
  const labelClasses = 'block text-xs font-semibold text-indigo-400 mb-1.5';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/admin/clubs')}
        className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-100 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Clubs List
      </button>

      <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl text-slate-100">
        <div className="border-b border-slate-800 pb-6 mb-6">
          <h1 className="font-display font-bold text-2xl text-slate-100">
            {isEdit ? `Edit Club: ${formData.name}` : 'Create New Club'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Modifications will be immediately reflected in the live Student Discovery Portal.
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>
                Club Name <span className="text-indigo-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SAKALA Dance & Dramatic Club"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>
                Slug (URL Identifier) <span className="text-indigo-400">*</span>
              </label>
              <input
                type="text"
                required
                disabled={isEdit}
                placeholder="e.g. sakala"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>
                Category <span className="text-indigo-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Performing Arts, Technical, Music, Photography..."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Tagline</label>
              <input
                type="text"
                placeholder="Short one-line motto"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Description / About</label>
            <textarea
              rows={4}
              placeholder="Full club overview for students..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>What We Do (One activity per line)</label>
              <textarea
                rows={4}
                placeholder="Dance Performances&#10;Stage Dramas&#10;Cultural Events"
                value={formData.what_we_do_raw}
                onChange={(e) => setFormData({ ...formData, what_we_do_raw: e.target.value })}
                className={inputClasses}
              />
            </div>

            <div>
              <label className={labelClasses}>Domains (Comma separated tags)</label>
              <textarea
                rows={4}
                placeholder="Dance, Drama, Theatre, Choreography"
                value={formData.domains_raw}
                onChange={(e) => setFormData({ ...formData, domains_raw: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>

          {/* Club Media & Visual Assets Section */}
          <div className="pt-5 border-t border-slate-800 space-y-6">
            <div>
              <h3 className="font-display font-bold text-base text-slate-100">Club Media & Visual Assets</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload separate images tailored specifically for the Spotlight carousel framing and Detail profile page.
              </p>
            </div>

            {/* 1. Spotlight Cover Image Upload (3072x1560 Landscape) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-200">
                  1. Spotlight Cover Image <span className="text-indigo-400 font-mono">(Expected: 3072 × 1560 ~1.97:1 Landscape)</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Used for the homepage Spotlight carousel. Displays with consistent 1.97:1 landscape framing and object-cover cropping.
                </p>
              </div>

              {formData.banner && (
                <div className="w-full aspect-[3072/1560] max-h-48 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden relative shadow-sm">
                  <img
                    src={getLogoUrl(formData.banner)}
                    alt="Spotlight Banner Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <span className="absolute bottom-2 right-2 text-[10px] font-semibold bg-slate-950/80 border border-slate-800 px-2 py-0.5 rounded text-indigo-400">
                    Preview (1.97:1 Object-Cover)
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  placeholder="Paste Spotlight Cover image URL (e.g. https://...)"
                  value={formData.banner}
                  onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                  className={inputClasses}
                />
                <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition shrink-0 whitespace-nowrap">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  <span>{bannerFile ? bannerFile.name : 'Upload Spotlight File (3072×1560)'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setBannerFile(file);
                        const dataUrl = await compressImage(file, 3072, 1560, 0.88);
                        setFormData((prev) => ({ ...prev, banner: dataUrl }));
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* 2. Detail Page Emblem & Profile Image Upload (3:4 Portrait Ratio) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-200">
                  2. Detail Page Emblem & Profile Image <span className="text-indigo-400 font-mono">(Expected: 3:4 Instagram Portrait Ratio)</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Used for the club profile page emblem box and directory grid. Fills the 3:4 portrait ratio cleanly with object-cover cropping.
                </p>
              </div>

              <div className="flex items-center gap-4">
                {formData.logo && (
                  <div className="w-24 h-32 aspect-[3/4] rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shrink-0 relative shadow-sm">
                    <img
                      src={getLogoUrl(formData.logo)}
                      alt="Detail Emblem Preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-semibold bg-slate-950/80 px-1.5 py-0.5 rounded text-indigo-400 whitespace-nowrap">
                      3:4 Preview
                    </span>
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Paste Detail Emblem image URL (e.g. https://...)"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className={inputClasses}
                  />
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    <span>{logoFile ? logoFile.name : 'Upload Detail File (3:4 Ratio)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setLogoFile(file);
                          const dataUrl = await compressImage(file, 600, 800, 0.90);
                          setFormData((prev) => ({ ...prev, logo: dataUrl }));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Faculty Coordinator & Socials */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <h3 className="font-display font-bold text-sm text-slate-100">Coordinator & External Links</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Faculty Coordinator Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Vyasa Krishnaji Kadambari C S"
                  value={formData.faculty_coordinator}
                  onChange={(e) => setFormData({ ...formData, faculty_coordinator: e.target.value })}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Instagram URL</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Student Leads */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-slate-100">Student Leads / Office Bearers</h3>
              <button
                type="button"
                onClick={handleAddLead}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
              >
                <Plus className="w-4 h-4" />
                Add Student Lead
              </button>
            </div>

            {leads.length === 0 ? (
              <p className="text-xs text-slate-500 italic">
                No student leads added yet. Click above to assign public club heads.
              </p>
            ) : (
              <div className="space-y-3">
                {leads.map((lead, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <input
                      type="text"
                      placeholder="Lead Name"
                      value={lead.name}
                      onChange={(e) => handleLeadChange(index, 'name', e.target.value)}
                      className={inputClasses}
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g. President)"
                      value={lead.role || ''}
                      onChange={(e) => handleLeadChange(index, 'role', e.target.value)}
                      className={inputClasses}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveLead(index)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-200">
              <input
                type="checkbox"
                checked={formData.registration_open}
                onChange={(e) => setFormData({ ...formData, registration_open: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Registration Open for Students</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-200">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500"
              />
              <span>Club Active on Directory</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/clubs')}
              className="px-5 py-2.5 rounded-xl border border-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm disabled:opacity-50 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Club'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
