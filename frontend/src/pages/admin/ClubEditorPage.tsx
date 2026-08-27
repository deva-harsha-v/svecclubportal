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
    detail_image: '',
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
  const [detailFile, setDetailFile] = useState<File | null>(null);

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
        detail_image: club.detail_image || '',
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

      const payload = {
        name: formData.name,
        slug: formData.slug.toLowerCase().trim(),
        category: formData.category,
        tagline: formData.tagline,
        description: formData.description,
        what_we_do,
        domains,
        logo: formData.logo,
        banner: formData.banner,
        detail_image: formData.detail_image,
        faculty_coordinator: formData.faculty_coordinator,
        instagram: formData.instagram,
        linkedin: formData.linkedin,
        website: formData.website,
        registration_open: formData.registration_open,
        is_active: formData.is_active,
        leads: leads.map((l) => ({
          name: l.name,
          role: l.role,
          is_public: l.is_public,
        })),
      };

      if (isEdit && slug) {
        await api.updateClub(slug, payload);
      } else {
        await api.createClub(payload);
      }

      navigate('/admin/clubs');
    } catch (err: any) {
      setError(err.message || 'Failed to save club details.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading club editor..." />;

  const inputClasses =
    'w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs focus:outline-none focus:border-indigo-500 transition font-sans';
  const labelClasses = 'block text-xs font-semibold text-slate-300 mb-1.5';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/admin/clubs')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-slate-100 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Club Management
      </button>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <h1 className="font-display font-bold text-2xl text-slate-100">
            {isEdit ? `Edit Club: ${formData.name}` : 'Create New Club Module'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure club media assets, categories, details, and active registration settings.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>
                Club Name <span className="text-red-400">*</span>
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
                Club Slug (URL identifier) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. sakala-dance-dramatic-club"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                disabled={isEdit}
                className={`${inputClasses} ${isEdit ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>

            <div>
              <label className={labelClasses}>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className={inputClasses}
              >
                <option value="Technical">Technical</option>
                <option value="Performing Arts">Performing Arts</option>
                <option value="Music">Music</option>
                <option value="Photography">Photography</option>
                <option value="Media & Editorial">Media & Editorial</option>
                <option value="Social & Cultural">Social & Cultural</option>
                <option value="Sports">Sports</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Short Tagline</label>
              <input
                type="text"
                placeholder="e.g. Dance • Drama • Stage Expression"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className={inputClasses}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Full Description</label>
            <textarea
              rows={3}
              placeholder="Describe the club's vision, history, and goals..."
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
                placeholder="Annual Stage Drama Performances&#10;Inter-College Dance Competitions"
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

          {/* Club Media & Visual Assets Section (3 Separate Visual Assets) */}
          <div className="pt-5 border-t border-slate-800 space-y-6">
            <div>
              <h3 className="font-display font-bold text-base text-slate-100">Club Media & Visual Assets</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Upload separate images tailored specifically for Homepage Spotlight cards, Club Detail 3:4 profile page, and transparent logo overlay.
              </p>
            </div>

            {/* 1. Spotlight Cover Image Upload (3072x1560 Landscape) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-200">
                  1. Spotlight & Directory Cover Image <span className="text-indigo-400 font-mono">(Expected: 3072 × 1560 ~1.97:1 Landscape)</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Used as the main landscape cover image for Homepage Spotlight & regular club cards.
                </p>
              </div>

              {formData.banner && (
                <div className="w-full aspect-[3072/1560] max-h-40 rounded-lg bg-slate-900 border border-slate-800 overflow-hidden relative shadow-sm">
                  <img
                    src={getLogoUrl(formData.banner)}
                    alt="Spotlight Banner Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <span className="absolute bottom-2 right-2 text-[10px] font-semibold bg-slate-950/80 border border-slate-800 px-2 py-0.5 rounded text-indigo-400">
                    Landscape Preview (1.97:1)
                  </span>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="text"
                  placeholder="Paste Landscape Cover image URL (e.g. https://...)"
                  value={formData.banner}
                  onChange={(e) => setFormData({ ...formData, banner: e.target.value })}
                  className={inputClasses}
                />
                <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition shrink-0 whitespace-nowrap">
                  <ImageIcon className="w-4 h-4 text-indigo-400" />
                  <span>{bannerFile ? bannerFile.name : 'Upload Landscape File (3072×1560)'}</span>
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

            {/* 2. Detail Page Profile Image Upload (3:4 Instagram Portrait Ratio) */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-200">
                  2. Club Detail Page Image <span className="text-indigo-400 font-mono">(Expected: 3:4 Instagram Portrait Ratio)</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Used exclusively on the individual club detail profile page hero header. Fills the 3:4 portrait ratio cleanly.
                </p>
              </div>

              <div className="flex items-center gap-4">
                {formData.detail_image && (
                  <div className="w-24 h-32 aspect-[3/4] rounded-lg bg-slate-900 border border-slate-800 overflow-hidden shrink-0 relative shadow-sm">
                    <img
                      src={getLogoUrl(formData.detail_image)}
                      alt="3:4 Detail Image Preview"
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
                    placeholder="Paste 3:4 Detail Image URL (e.g. https://...)"
                    value={formData.detail_image}
                    onChange={(e) => setFormData({ ...formData, detail_image: e.target.value })}
                    className={inputClasses}
                  />
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    <span>{detailFile ? detailFile.name : 'Upload 3:4 Detail File'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setDetailFile(file);
                          const dataUrl = await compressImage(file, 600, 800, 0.90);
                          setFormData((prev) => ({ ...prev, detail_image: dataUrl }));
                        }
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* 3. Transparent Club Logo Upload */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-200">
                  3. Transparent Club Logo PNG <span className="text-indigo-400 font-mono">(Background Removed PNG)</span>
                </label>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Floating transparent logo overlay rendered directly on top of cards and profile headers.
                </p>
              </div>

              <div className="flex items-center gap-4">
                {formData.logo && (
                  <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shrink-0">
                    <img
                      src={getLogoUrl(formData.logo)}
                      alt="Transparent Logo Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    placeholder="Paste Transparent Logo PNG URL (e.g. https://...)"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    className={inputClasses}
                  />
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition">
                    <Upload className="w-4 h-4 text-indigo-400" />
                    <span>{logoFile ? logoFile.name : 'Upload Transparent Logo PNG'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          setLogoFile(file);
                          const dataUrl = await compressImage(file, 400, 400, 0.95);
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

              <div>
                <label className={labelClasses}>LinkedIn URL</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Website / External URL</label>
                <input
                  type="url"
                  placeholder="https://srivasaviengg.ac.in"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className={inputClasses}
                />
              </div>
            </div>
          </div>

          {/* Student Leads */}
          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-slate-100">Public Office Bearers / Student Leads</h3>
              <button
                type="button"
                onClick={handleAddLead}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
              >
                <Plus className="w-3.5 h-3.5 text-indigo-400" />
                Add Lead
              </button>
            </div>

            {leads.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No student leads added yet.</p>
            ) : (
              <div className="space-y-3">
                {leads.map((lead, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <input
                      type="text"
                      placeholder="Student Lead Name"
                      value={lead.name}
                      onChange={(e) => handleLeadChange(idx, 'name', e.target.value)}
                      className={inputClasses}
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g. Club President)"
                      value={lead.role || ''}
                      onChange={(e) => handleLeadChange(idx, 'role', e.target.value)}
                      className={inputClasses}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveLead(idx)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit CTA */}
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
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-sm transition disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{saving ? 'Saving Club...' : isEdit ? 'Save Changes' : 'Create Club'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
