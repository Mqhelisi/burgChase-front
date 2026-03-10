import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { Navigate } from 'react-router-dom';

const SellerProfile = () => {
  const { user, isAuthenticated, apiCall, updateUserProfile } = useAuth();
  const [seller, setSeller] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    website: '',
    avatar: '',
    banner: ''
  });
  const [avatarPreview, setAvatarPreview] = useState('');
  const [bannerPreview, setBannerPreview] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user && user.sellerId) {
      fetchSeller();
    }
  }, [user]);

  const fetchSeller = async () => {
    try {
      const response = await apiCall(`/sellers/${user.sellerId}`);
      const data = await response.json();
      if (response.ok) {
        setSeller(data.seller);
        setFormData({
          name: data.seller.name || '',
          description: data.seller.description || '',
          phone: data.seller.phone || '',
          website: data.seller.website || '',
          avatar: data.seller.avatar || '',
          banner: data.seller.banner || ''
        });
        setAvatarPreview(data.seller.avatar || '');
        setBannerPreview(data.seller.banner || '');
      }
    } catch (err) {
      console.error('Failed to fetch seller:', err);
    }
  };

  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setFormData(prev => ({ ...prev, [field]: dataUrl }));
      if (field === 'avatar') setAvatarPreview(dataUrl);
      if (field === 'banner') setBannerPreview(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      const response = await apiCall(`/sellers/${user.sellerId}`, {
        method: 'PUT',
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setMessage('Profile updated successfully!');
        setSeller(data.seller);
        if (updateUserProfile && data.user) {
          // propagate any changes (category may be updated)
          updateUserProfile({ category: data.user.category, name: data.user.name });
        }
      } else {
        setError(data.message || 'Unable to update profile');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  if (!isAuthenticated || user.role !== 'seller') {
    return <Navigate to="/" />;
  }

  if (!seller) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-dark-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-primary-500/10 border border-primary-500/30 text-primary-300 px-6 py-4 rounded-xl"
            >
              {message}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 px-6 py-4 rounded-xl"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-2xl p-8 mb-8"
        >
          <h1 className="text-3xl font-bold text-dark-100 mb-4">Seller Profile</h1>
          <p className="text-dark-300">Manage your store information</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Banner upload */}
          <div>
            <label className="block text-dark-400 font-medium mb-2">Header Image</label>
            {bannerPreview && (
              <img
                src={bannerPreview}
                alt="Banner preview"
                className="w-full h-40 object-cover rounded-xl mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'banner')}
              className="block"
            />
          </div>

          {/* Avatar upload */}
          <div>
            <label className="block text-dark-400 font-medium mb-2">Profile Picture</label>
            {avatarPreview && (
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-24 h-24 object-cover rounded-full mb-2"
              />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChange(e, 'avatar')}
              className="block"
            />
          </div>

          {/* Business name */}
          <div>
            <label className="block text-dark-400 font-medium mb-2">Business Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input-field"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-dark-400 font-medium mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input-field min-h-[100px]"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-dark-400 font-medium mb-2">Phone</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-field"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-dark-400 font-medium mb-2">Website</label>
            <input
              type="text"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="input-field"
            />
          </div>

          <div className="flex justify-end">
            <motion.button
              type="submit"
              className="btn-primary"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Save Changes
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerProfile;
