import Choir from '../models/Choir.js';
import ChoirEvent from '../models/ChoirEvent.js';
import Song from '../models/Song.js';

// ============ CHOIR MEMBERS ============

// @desc    Register choir member
// @route   POST /api/choir/register
export const registerChoirMember = async (req, res) => {
  try {
    const { 
      firstName, lastName, email, phoneNumber, voicePart, 
      campus, state, country, experienceLevel, musicalSkills,
      availability, rehearsalSchedule 
    } = req.body;

    // Check if already registered
    const existingMember = await Choir.findOne({ email });
    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered in choir'
      });
    }

    const choirMember = await Choir.create({
      user: req.user?._id || null,
      firstName,
      lastName,
      email,
      phoneNumber,
      voicePart,
      campus,
      state,
      country,
      experienceLevel,
      musicalSkills: musicalSkills || [],
      availability: availability || { days: [], timePreference: 'Any' },
      rehearsalSchedule: rehearsalSchedule || {}
    });

    res.status(201).json({
      success: true,
      data: choirMember
    });
  } catch (error) {
    console.error('Choir registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all choir members
// @route   GET /api/choir/members
export const getChoirMembers = async (req, res) => {
  try {
    const { voicePart, campus, isActive, isLeader } = req.query;
    
    const filter = {};
    if (voicePart) filter.voicePart = voicePart;
    if (campus) filter.campus = campus;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (isLeader !== undefined) filter.isLeader = isLeader === 'true';

    const members = await Choir.find(filter)
      .sort({ joinedDate: -1 })
      .populate('user', 'firstName lastName email');

    res.status(200).json({
      success: true,
      count: members.length,
      data: members
    });
  } catch (error) {
    console.error('Get choir members error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single choir member
// @route   GET /api/choir/members/:id
export const getChoirMember = async (req, res) => {
  try {
    const member = await Choir.findById(req.params.id)
      .populate('user', 'firstName lastName email');
    
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
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update choir member
// @route   PUT /api/choir/members/:id
export const updateChoirMember = async (req, res) => {
  try {
    const member = await Choir.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

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
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete choir member
// @route   DELETE /api/choir/members/:id
export const deleteChoirMember = async (req, res) => {
  try {
    const member = await Choir.findByIdAndDelete(req.params.id);
    
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Choir member not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Choir member removed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Record attendance
// @route   POST /api/choir/attendance
export const recordAttendance = async (req, res) => {
  try {
    const { memberId, date, present, rehearsal } = req.body;

    const member = await Choir.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Choir member not found'
      });
    }

    member.attendance.push({
      date: date || new Date(),
      present,
      rehearsal: rehearsal || 'Regular'
    });

    await member.save();

    res.status(200).json({
      success: true,
      data: member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ============ CHOIR EVENTS ============

// @desc    Create choir event
// @route   POST /api/choir/events
export const createChoirEvent = async (req, res) => {
  try {
    const eventData = req.body;
    
    const event = await ChoirEvent.create({
      ...eventData,
      coordinator: req.user?._id
    });

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all choir events
// @route   GET /api/choir/events
export const getChoirEvents = async (req, res) => {
  try {
    const { type, status, fromDate, toDate } = req.query;
    
    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (fromDate || toDate) {
      filter.date = {};
      if (fromDate) filter.date.$gte = new Date(fromDate);
      if (toDate) filter.date.$lte = new Date(toDate);
    }

    const events = await ChoirEvent.find(filter)
      .sort({ date: 1 })
      .populate('coordinator', 'firstName lastName email')
      .populate('participants', 'firstName lastName voicePart');

    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single event
// @route   GET /api/choir/events/:id
export const getChoirEvent = async (req, res) => {
  try {
    const event = await ChoirEvent.findById(req.params.id)
      .populate('coordinator', 'firstName lastName email')
      .populate('participants', 'firstName lastName voicePart profileImage');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update event
// @route   PUT /api/choir/events/:id
export const updateChoirEvent = async (req, res) => {
  try {
    const event = await ChoirEvent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete event
// @route   DELETE /api/choir/events/:id
export const deleteChoirEvent = async (req, res) => {
  try {
    const event = await ChoirEvent.findByIdAndDelete(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Add participant to event
// @route   POST /api/choir/events/:id/participants
export const addEventParticipant = async (req, res) => {
  try {
    const { memberId } = req.body;
    
    const event = await ChoirEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    if (!event.participants.includes(memberId)) {
      event.participants.push(memberId);
      await event.save();
    }

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Remove participant from event
// @route   DELETE /api/choir/events/:id/participants/:memberId
export const removeEventParticipant = async (req, res) => {
  try {
    const event = await ChoirEvent.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    event.participants = event.participants.filter(
      id => id.toString() !== req.params.memberId
    );
    await event.save();

    res.status(200).json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ============ SONGS ============

// @desc    Add new song
// @route   POST /api/choir/songs
export const addSong = async (req, res) => {
  try {
    const songData = {
      ...req.body,
      addedBy: req.user?._id
    };

    const song = await Song.create(songData);

    res.status(201).json({
      success: true,
      data: song
    });
  } catch (error) {
    console.error('Add song error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get all songs
// @route   GET /api/choir/songs
export const getSongs = async (req, res) => {
  try {
    const { genre, difficulty, search, category } = req.query;
    
    const filter = { isActive: true };
    if (genre) filter.genre = genre;
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.categories = category;
    
    let query = Song.find(filter);
    
    if (search) {
      query = Song.find({ 
        $text: { $search: search } 
      });
    }

    const songs = await query.sort({ createdAt: -1 })
      .populate('addedBy', 'firstName lastName');

    res.status(200).json({
      success: true,
      count: songs.length,
      data: songs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Get single song
// @route   GET /api/choir/songs/:id
export const getSong = async (req, res) => {
  try {
    const song = await Song.findById(req.params.id)
      .populate('addedBy', 'firstName lastName');

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    res.status(200).json({
      success: true,
      data: song
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update song
// @route   PUT /api/choir/songs/:id
export const updateSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    res.status(200).json({
      success: true,
      data: song
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Delete song
// @route   DELETE /api/choir/songs/:id
export const deleteSong = async (req, res) => {
  try {
    const song = await Song.findByIdAndDelete(req.params.id);
    
    if (!song) {
      return res.status(404).json({
        success: false,
        message: 'Song not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Song deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// ============ STATISTICS ============

// @desc    Get choir statistics
// @route   GET /api/choir/stats
export const getChoirStats = async (req, res) => {
  try {
    const totalMembers = await Choir.countDocuments({ isActive: true });
    const leaders = await Choir.countDocuments({ isLeader: true });
    
    const voicePartStats = await Choir.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$voicePart', count: { $sum: 1 } } }
    ]);

    const campusStats = await Choir.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$campus', count: { $sum: 1 } } }
    ]);

    const upcomingEvents = await ChoirEvent.countDocuments({
      status: 'Upcoming',
      date: { $gte: new Date() }
    });

    const totalSongs = await Song.countDocuments({ isActive: true });

    res.status(200).json({
      success: true,
      data: {
        totalMembers,
        leaders,
        voicePartStats,
        campusStats,
        upcomingEvents,
        totalSongs
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};