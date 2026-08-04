import { ChoirMember } from '../models/ChoirMember.js';
import { User } from '../models/User.js';

// @desc    Register choir member
// @route   POST /api/choir/register
// @access  Private
export const registerChoirMember = async (req, res, next) => {
  try {
    // Check if user is already a choir member
    const existing = await ChoirMember.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You are already a choir member'
      });
    }
    
    const choirMember = await ChoirMember.create({
      user: req.user.id,
      ...req.body
    });
    
    res.status(201).json({
      success: true,
      data: choirMember
    });
  } catch (error) {
    console.error('Register choir member error:', error);
    next(error);
  }
};

// @desc    Get all choir members
// @route   GET /api/choir/members
// @access  Public
export const getChoirMembers = async (req, res, next) => {
  try {
    const { voicePart, country, campus, isActive } = req.query;
    
    const query = {};
    if (voicePart) query.voicePart = voicePart;
    if (country) query.country = country;
    if (campus) query.campus = campus;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    const members = await ChoirMember.find(query)
      .populate('user', 'firstName lastName email profileImage country campus')
      .sort({ joinedDate: -1 });
    
    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    console.error('Get choir members error:', error);
    next(error);
  }
};

// @desc    Get single choir member
// @route   GET /api/choir/members/:id
// @access  Public
export const getChoirMember = async (req, res, next) => {
  try {
    const member = await ChoirMember.findById(req.params.id)
      .populate('user', 'firstName lastName email profileImage country campus');
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Choir member not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    console.error('Get choir member error:', error);
    next(error);
  }
};

// @desc    Update choir member
// @route   PUT /api/choir/members/:id
// @access  Private (self or admin)
export const updateChoirMember = async (req, res, next) => {
  try {
    const member = await ChoirMember.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Choir member not found'
      });
    }
    
    // Check ownership
    if (member.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this member'
      });
    }
    
    const updated = await ChoirMember.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.status(200).json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Update choir member error:', error);
    next(error);
  }
};

// @desc    Delete choir member
// @route   DELETE /api/choir/members/:id
// @access  Admin only
export const deleteChoirMember = async (req, res, next) => {
  try {
    const member = await ChoirMember.findById(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Choir member not found'
      });
    }
    
    await member.remove();
    
    res.status(200).json({
      success: true,
      message: 'Choir member removed successfully'
    });
  } catch (error) {
    console.error('Delete choir member error:', error);
    next(error);
  }
};

// @desc    Get choir statistics
// @route   GET /api/choir/stats
// @access  Public
export const getChoirStats = async (req, res, next) => {
  try {
    const totalMembers = await ChoirMember.countDocuments({ isActive: true });
    const leaders = await ChoirMember.countDocuments({ isLeader: true });
    
    const voicePartStats = await ChoirMember.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$voicePart', count: { $sum: 1 } } }
    ]);
    
    const campusStats = await ChoirMember.aggregate([
      { $match: { isActive: true } },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $group: { _id: '$user.campus', count: { $sum: 1 } } }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        leaders,
        voicePartStats,
        campusStats
      }
    });
  } catch (error) {
    console.error('Get choir stats error:', error);
    next(error);
  }
};