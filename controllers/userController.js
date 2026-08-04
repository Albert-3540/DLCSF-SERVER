import { User } from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Admin only
export const getUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const query = {};
    
    // Filter by role
    if (req.query.role) {
      query.role = req.query.role;
    }
    
    // Filter by country
    if (req.query.country) {
      query.country = req.query.country;
    }
    
    // Search by name or email
    if (req.query.search) {
      query.$or = [
        { firstName: { $regex: req.query.search, $options: 'i' } },
        { lastName: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin or self
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Check if user is accessing their own profile or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this user'
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Admin or self
export const updateUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, phoneNumber, campus, country, bio } = req.body;
    
    // Check if user is updating their own profile or is admin
    if (req.user.id !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this user'
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update fields
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.campus = campus || user.campus;
    user.country = country || user.country;
    user.bio = bio || user.bio;
    
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin only
export const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent admin from deleting themselves
    if (req.user.id === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account'
      });
    }
    
    await user.remove();
    
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/users/:id/role
// @access  Admin only
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    
    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role is required'
      });
    }
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    user.role = role;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user role error:', error);
    next(error);
  }
};