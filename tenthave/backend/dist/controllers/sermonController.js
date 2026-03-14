"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSermon = exports.updateSermon = exports.createSermon = exports.getSermonsBySeries = exports.getSermon = exports.getSermons = void 0;
const index_1 = require("../index");
const client_1 = require("@prisma/client");
// GET /api/sermons - Get all sermons
const getSermons = async (req, res) => {
    try {
        const { status, isPublic, isFeatured, series, speaker, startDate, endDate, limit, offset, } = req.query;
        const where = {};
        // Filter by status
        if (status) {
            where.status = status;
        }
        // Filter by public/private
        if (isPublic !== undefined) {
            where.isPublic = isPublic === 'true';
        }
        // Filter by featured
        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured === 'true';
        }
        // Filter by series
        if (series) {
            where.series = series;
        }
        // Filter by speaker
        if (speaker) {
            where.speaker = {
                contains: speaker,
            };
        }
        // Filter by date range
        if (startDate || endDate) {
            where.date = {};
            if (startDate) {
                where.date.gte = new Date(startDate);
            }
            if (endDate) {
                where.date.lte = new Date(endDate);
            }
        }
        const sermons = await index_1.prisma.sermon.findMany({
            where,
            orderBy: {
                date: 'desc',
            },
            take: limit ? parseInt(limit) : undefined,
            skip: offset ? parseInt(offset) : undefined,
        });
        res.json(sermons);
    }
    catch (error) {
        console.error('Error fetching sermons:', error);
        res.status(500).json({ error: 'Failed to fetch sermons' });
    }
};
exports.getSermons = getSermons;
// GET /api/sermons/:id - Get a specific sermon
const getSermon = async (req, res) => {
    try {
        const { id } = req.params;
        const sermon = await index_1.prisma.sermon.findUnique({
            where: { id },
        });
        if (!sermon) {
            return res.status(404).json({ error: 'Sermon not found' });
        }
        res.json(sermon);
    }
    catch (error) {
        console.error('Error fetching sermon:', error);
        res.status(500).json({ error: 'Failed to fetch sermon' });
    }
};
exports.getSermon = getSermon;
// GET /api/sermons/series/:seriesName - Get all sermons in a series
const getSermonsBySeries = async (req, res) => {
    try {
        const { seriesName } = req.params;
        const sermons = await index_1.prisma.sermon.findMany({
            where: {
                series: seriesName,
                status: client_1.ContentStatus.PUBLISHED,
                isPublic: true,
            },
            orderBy: {
                date: 'asc',
            },
        });
        res.json(sermons);
    }
    catch (error) {
        console.error('Error fetching sermon series:', error);
        res.status(500).json({ error: 'Failed to fetch sermon series' });
    }
};
exports.getSermonsBySeries = getSermonsBySeries;
// POST /api/sermons - Create a new sermon
const createSermon = async (req, res) => {
    try {
        const { title, description, speaker, date, passage, series, videoUrl, audioUrl, thumbnail, status, isPublic, isFeatured, } = req.body;
        // Validate required fields
        if (!title || !speaker || !date) {
            return res.status(400).json({ error: 'Title, speaker, and date are required' });
        }
        const sermon = await index_1.prisma.sermon.create({
            data: {
                title,
                description,
                speaker,
                date: new Date(date),
                passage,
                series,
                videoUrl,
                audioUrl,
                thumbnail,
                status: status || client_1.ContentStatus.PUBLISHED,
                isPublic: isPublic !== undefined ? isPublic : true,
                isFeatured: isFeatured || false,
            },
        });
        res.status(201).json(sermon);
    }
    catch (error) {
        console.error('Error creating sermon:', error);
        res.status(500).json({ error: 'Failed to create sermon' });
    }
};
exports.createSermon = createSermon;
// PUT /api/sermons/:id - Update a sermon
const updateSermon = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, speaker, date, passage, series, videoUrl, audioUrl, thumbnail, status, isPublic, isFeatured, } = req.body;
        // Check if sermon exists
        const existingSermon = await index_1.prisma.sermon.findUnique({
            where: { id },
        });
        if (!existingSermon) {
            return res.status(404).json({ error: 'Sermon not found' });
        }
        // Build update data
        const updateData = {};
        if (title !== undefined)
            updateData.title = title;
        if (description !== undefined)
            updateData.description = description;
        if (speaker !== undefined)
            updateData.speaker = speaker;
        if (date !== undefined)
            updateData.date = new Date(date);
        if (passage !== undefined)
            updateData.passage = passage;
        if (series !== undefined)
            updateData.series = series;
        if (videoUrl !== undefined)
            updateData.videoUrl = videoUrl;
        if (audioUrl !== undefined)
            updateData.audioUrl = audioUrl;
        if (thumbnail !== undefined)
            updateData.thumbnail = thumbnail;
        if (status !== undefined)
            updateData.status = status;
        if (isPublic !== undefined)
            updateData.isPublic = isPublic;
        if (isFeatured !== undefined)
            updateData.isFeatured = isFeatured;
        const updatedSermon = await index_1.prisma.sermon.update({
            where: { id },
            data: updateData,
        });
        res.json(updatedSermon);
    }
    catch (error) {
        console.error('Error updating sermon:', error);
        res.status(500).json({ error: 'Failed to update sermon' });
    }
};
exports.updateSermon = updateSermon;
// DELETE /api/sermons/:id - Delete a sermon
const deleteSermon = async (req, res) => {
    try {
        const { id } = req.params;
        const sermon = await index_1.prisma.sermon.findUnique({
            where: { id },
        });
        if (!sermon) {
            return res.status(404).json({ error: 'Sermon not found' });
        }
        await index_1.prisma.sermon.delete({
            where: { id },
        });
        res.json({ message: 'Sermon deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting sermon:', error);
        res.status(500).json({ error: 'Failed to delete sermon' });
    }
};
exports.deleteSermon = deleteSermon;
//# sourceMappingURL=sermonController.js.map