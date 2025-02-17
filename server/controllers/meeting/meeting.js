const MeetingHistory = require('../../model/schema/meeting');
const mongoose = require('mongoose');

// This is the functiionality for adding new meeting
const add = async (req, res) => {
    try {
        const meeting = new MeetingHistory({
            ...req.body,
            timestamp: new Date(),
            deleted: false
        });
        const result = await meeting.save();
        
        const populatedMeeting = await MeetingHistory.findById(result._id)
            .populate('createBy', 'firstName lastName email')
            .populate('attendes', 'firstName lastName email')
            .populate('attendesLead', 'firstName lastName email');
        
        return res.status(200).json({
            status: 200,
            message: "Meeting added successfully",
            data: populatedMeeting
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error adding meeting",
            error: error.message
        });
    }
};

// Functionality to get all meetings
const index = async (req, res) => {
    try {
        const query = { deleted: false };
        
        // Filter if not superAdmin
        if (req.query.createBy) {
            query.createBy = new mongoose.Types.ObjectId(req.query.createBy);
        }

        // Date Ranger filder to sort meetings 
        if (req.query.startDate && req.query.endDate) {
            query.dateTime = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }

        // Serach filter implementation 
        if (req.query.search) {
            query.$or = [
                { agenda: { $regex: req.query.search, $options: 'i' } },
                { location: { $regex: req.query.search, $options: 'i' } },
                { notes: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const meetings = await MeetingHistory.find(query)
            .populate('createBy', 'firstName lastName email')
            .populate('attendes', 'firstName lastName email')
            .populate('attendesLead', 'firstName lastName email')
            .sort({ timestamp: -1 });

        return res.status(200).json({
            status: 200,
            message: "Meetings retrieved successfully",
            data: meetings
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error retrieving meetings",
            error: error.message
        });
    }
};

// Get single meeting 
const view = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid meeting ID"
            });
        }

        const meeting = await MeetingHistory.findOne({
            _id: req.params.id,
            deleted: false
        })
        .populate('createBy', 'firstName lastName email')
        .populate('attendes', 'firstName lastName email')
        .populate('attendesLead', 'firstName lastName email');

        if (!meeting) {
            return res.status(404).json({
                status: 404,
                message: "Meeting not found"
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Meeting retrieved successfully",
            data: meeting
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error retrieving meeting",
            error: error.message
        });
    }
};

// Soft delete of a single meeting 
const deleteData = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid meeting ID"
            });
        }

        const result = await MeetingHistory.findByIdAndUpdate(
            req.params.id,
            { 
                deleted: true,
                timestamp: new Date()
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                status: 404,
                message: "Meeting not found"
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Meeting deleted successfully",
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error deleting meeting",
            error: error.message
        });
    }
};

// Soft deelete multiple meeting
const deleteMany = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Invalid or empty IDs array"
            });
        }

        // IDs Validation 
        const validIds = ids.every(id => mongoose.Types.ObjectId.isValid(id));
        if (!validIds) {
            return res.status(400).json({
                status: 400,
                message: "Invalid meeting ID(s) in array"
            });
        }
        
        const result = await MeetingHistory.updateMany(
            { _id: { $in: ids } },
            { 
                deleted: true,
                timestamp: new Date()
            }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({
                status: 404,
                message: "No meetings found to delete"
            });
        }

        return res.status(200).json({
            status: 200,
            message: `Successfully deleted ${result.modifiedCount} meetings`,
            data: result
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error deleting meetings",
            error: error.message
        });
    }
};

// Functionality for update meeting 
const update = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: 400,
                message: "Invalid meeting ID"
            });
        }

        const updatedMeeting = await MeetingHistory.findOneAndUpdate(
            { 
                _id: req.params.id,
                deleted: false
            },
            {
                ...req.body,
                timestamp: new Date()
            },
            { 
                new: true,
                runValidators: true
            }
        )
        .populate('createBy', 'firstName lastName email')
        .populate('attendes', 'firstName lastName email')
        .populate('attendesLead', 'firstName lastName email');

        if (!updatedMeeting) {
            return res.status(404).json({
                status: 404,
                message: "Meeting not found"
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Meeting updated successfully",
            data: updatedMeeting
        });
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "Error updating meeting",
            error: error.message
        });
    }
};

module.exports = {
    add,
    index,
    view,
    update,
    deleteData,
    deleteMany
};