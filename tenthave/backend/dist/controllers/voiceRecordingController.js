"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteVoiceRecording = exports.updateVoiceRecording = exports.createVoiceRecording = exports.getVoiceRecording = exports.getVoiceRecordings = void 0;
const index_1 = require("../index");
const client_1 = require("@prisma/client");
// GET /api/voice-recordings
const getVoiceRecordings = async (req, res) => {
    try {
        const { status, isPublic, isFeatured, category, speaker, limit, offset } = req.query;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (isPublic !== undefined) {
            where.isPublic = isPublic === 'true';
        }
        if (isFeatured !== undefined) {
            where.isFeatured = isFeatured === 'true';
        }
        if (category) {
            where.category = category;
        }
        if (speaker) {
            where.speaker = { contains: speaker };
        }
        const recordings = await index_1.prisma.voiceRecording.findMany({
            where,
            orderBy: { date: 'desc' },
            take: limit ? parseInt(limit) : undefined,
            skip: offset ? parseInt(offset) : undefined,
        });
        res.json(recordings);
    }
    catch (error) {
        console.error('Error fetching voice recordings:', error);
        res.status(500).json({ error: 'Failed to fetch voice recordings' });
    }
};
exports.getVoiceRecordings = getVoiceRecordings;
// GET /api/voice-recordings/:id
const getVoiceRecording = async (req, res) => {
    try {
        const { id } = req.params;
        const recording = await index_1.prisma.voiceRecording.findUnique({ where: { id } });
        if (!recording) {
            return res.status(404).json({ error: 'Voice recording not found' });
        }
        res.json(recording);
    }
    catch (error) {
        console.error('Error fetching voice recording:', error);
        res.status(500).json({ error: 'Failed to fetch voice recording' });
    }
};
exports.getVoiceRecording = getVoiceRecording;
// POST /api/voice-recordings
const createVoiceRecording = async (req, res) => {
    try {
        const { title, description, speaker, date, passage, category, embedUrl, embedType, status, isPublic, isFeatured, } = req.body;
        if (!title || !speaker || !date || !embedUrl) {
            return res.status(400).json({ error: 'Title, speaker, date, and embedUrl are required' });
        }
        const recording = await index_1.prisma.voiceRecording.create({
            data: {
                title,
                description,
                speaker,
                date: new Date(date),
                passage,
                category,
                embedUrl,
                embedType: embedType || 'iframe',
                status: status || client_1.ContentStatus.PUBLISHED,
                isPublic: isPublic !== undefined ? isPublic : true,
                isFeatured: isFeatured || false,
            },
        });
        res.status(201).json(recording);
    }
    catch (error) {
        console.error('Error creating voice recording:', error);
        res.status(500).json({ error: 'Failed to create voice recording' });
    }
};
exports.createVoiceRecording = createVoiceRecording;
// PUT /api/voice-recordings/:id
const updateVoiceRecording = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, speaker, date, passage, category, embedUrl, embedType, status, isPublic, isFeatured, } = req.body;
        const existing = await index_1.prisma.voiceRecording.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Voice recording not found' });
        }
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
        if (category !== undefined)
            updateData.category = category;
        if (embedUrl !== undefined)
            updateData.embedUrl = embedUrl;
        if (embedType !== undefined)
            updateData.embedType = embedType;
        if (status !== undefined)
            updateData.status = status;
        if (isPublic !== undefined)
            updateData.isPublic = isPublic;
        if (isFeatured !== undefined)
            updateData.isFeatured = isFeatured;
        const updated = await index_1.prisma.voiceRecording.update({ where: { id }, data: updateData });
        res.json(updated);
    }
    catch (error) {
        console.error('Error updating voice recording:', error);
        res.status(500).json({ error: 'Failed to update voice recording' });
    }
};
exports.updateVoiceRecording = updateVoiceRecording;
// DELETE /api/voice-recordings/:id
const deleteVoiceRecording = async (req, res) => {
    try {
        const { id } = req.params;
        const existing = await index_1.prisma.voiceRecording.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Voice recording not found' });
        }
        await index_1.prisma.voiceRecording.delete({ where: { id } });
        res.json({ message: 'Voice recording deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting voice recording:', error);
        res.status(500).json({ error: 'Failed to delete voice recording' });
    }
};
exports.deleteVoiceRecording = deleteVoiceRecording;
//# sourceMappingURL=voiceRecordingController.js.map