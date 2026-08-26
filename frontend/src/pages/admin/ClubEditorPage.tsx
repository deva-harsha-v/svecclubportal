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
    'w-full px-4 py-2.5 rounded-xl bg-[#010030]/80 border border-[#7226FF]/35 text-[#FFE5F1] text-sm focus:outline-none focus:border-[#F042FF] focus:ring-1 focus:ring-[#F042FF] transition placeholder:text-[rgba(255,229,241,0.35)] disabled:opacity-50 disabled:bg-[#010030]/40 font-sans';
  const labelClasses = 'block text-xs font-mono font-semibold text-[#87F5F5] mb-1.5';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/admin/clubs')}
        className="inline-flex items-center gap-2 text-xs font-mono text-[rgba(255,229,241,0.68)] hover:text-[#FFE5F1] transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Clubs List
      </button>

      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-[#7226FF]/35 shadow-2xl bg-[#160078]/70 text-[#FFE5F1]">
        <div className="border-b border-[#7226FF]/25 pb-6 mb-6">
          <h1 className="font-display font-bold text-2xl text-[#FFE5F1]">
            {isEdit ? `Edit Club: ${formData.name}` : 'Create New Club'}
          </h1>
          <p className="text-xs text-[rgba(255,229,241,0.68)] font-mono mt-1">
            Modifications will be immediately reflected in the live Student Discovery Portal.
          </p>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>
                Club Name <span className="text-[#F042FF]">*</span>
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
                Slug (URL Identifier) <span className="text-[#F042FF]">*</span>
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
                Category <span className="text-[#F042FF]">*</span>
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

          {/* Logo & Cover Banner Upload Section */}
          <div className="pt-4 border-t border-[#7226FF]/25 space-y-4">
            <h3 className="font-display font-bold text-sm text-[#FFE5F1]">Club Media & Visual Assets</h3>

            {/* Emblem Logo Upload */}
            <div>
              <label className={labelClasses}>Club Emblem / Logo Image</label>
              <div className="flex items-center gap-4 mt-1.5">
                {formData.logo && (
                  <div className="w-14 h-14 rounded-2xl bg-[#010030] border border-[#7226FF]/40 p-1 flex items-center justify-center overflow-hidden shrink-0">
                    <img
                      src={getLogoUrl(formData.logo)}
                      alt="Logo Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#010030]/80 border border-[#7226FF]/35 text-xs font-mono text-[#FFE5F1] hover:border-[#F042FF] transition">
                  <Upload className="w-4 h-4 text-[#87F5F5]" />
                  <span>{logoFile ? logoFile.name : 'Upload Emblem Logo File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        setLogoFile(file);
                        const dataUrl = await compressImage(file, 400, 400, 0.9);
                        setFormData((prev) => ({ ...prev, logo: dataUrl }));
                      }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Cover Banner Image Upload */}
            <div>
              <label className={labelClasses}>Header Cover Banner Picture (Replaces Large Gradient Area)</label>
              <div className="space-y-2 mt-1.5">
                {formData.banner && (
                  <div className="w-full h-28 rounded-2xl bg-[#010030] border border-[#7226FF]/40 p-1 flex items-center justify-center overflow-hidden shrink-0 relative">
                    <img
                      src={getLogoUrl(formData.banner)}
                      alt="Banner Preview"
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <span className="absolute bottom-2 right-2 font-mono text-[9px] bg-black/60 px-2 py-0.5 rounded text-[#87F5F5]">
                      Cover Image Preview
                    </span>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <input
                    type="text"
                    placeholder="Paste image URL (e.g. https://...)"
                    value={formData.banner}
                    onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                    className={inputClasses}
                  />
                  <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#010030]/80 border border-[#7226FF]/35 text-xs font-mono text-[#FFE5F1] hover:border-[#F042FF] transition shrink-0 whitespace-nowrap">
                    <ImageIcon className="w-4 h-4 text-[#F042FF]" />
                    <span>{bannerFile ? bannerFile.name : 'Upload Picture File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setBannerFile(file);
                          const dataUrl = await compressImage(file, 1200, 600, 0.85);
                          setFormData((prev) => ({ ...prev, banner: dataUrl }));
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
          <div className="pt-4 border-t border-[#7226FF]/25 space-y-4">
            <h3 className="font-display font-bold text-sm text-[#FFE5F1]">Coordinator & External Links</h3>
            
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
          <div className="pt-4 border-t border-[#7226FF]/25 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-[#FFE5F1]">Student Leads / Office Bearers</h3>
              <button
                type="button"
                onClick={handleAddLead}
                className="inline-flex items-center gap-1.5 text-xs font-mono text-[#87F5F5] hover:text-[#F042FF] transition"
              >
                <Plus className="w-4 h-4" />
                Add Student Lead
              </button>
            </div>

            {leads.length === 0 ? (
              <p className="text-xs font-mono text-[rgba(255,229,241,0.5)] italic">
                No student leads added yet. Click above to assign public club heads.
              </p>
            ) : (
              <div className="space-y-3">
                {leads.map((lead, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-[#010030]/60 border border-[#7226FF]/30">
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
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="pt-4 border-t border-[#7226FF]/25 flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono text-[#FFE5F1]">
              <input
                type="checkbox"
                checked={formData.registration_open}
                onChange={(e) => setFormData({ ...formData, registration_open: e.target.checked })}
                className="w-4 h-4 rounded border-[#7226FF]/40 bg-[#010030] text-[#F042FF] focus:ring-[#F042FF]"
              />
              <span>Registration Open for Students</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-mono text-[#FFE5F1]">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 rounded border-[#7226FF]/40 bg-[#010030] text-[#F042FF] focus:ring-[#F042FF]"
              />
              <span>Club Active on Directory</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-[#7226FF]/25 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/clubs')}
              className="px-5 py-2.5 rounded-xl border border-[rgba(135,245,245,0.2)] text-xs font-mono text-[rgba(255,229,241,0.68)] hover:text-[#FFE5F1] transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl btn-primary-gradient font-bold text-xs shadow-magentaGlow disabled:opacity-50"
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
