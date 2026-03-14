"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCalendarEvent = exports.updateCalendarEvent = exports.createCalendarEvent = exports.getCalendarEvent = exports.getCalendarEvents = void 0;
const index_1 = require("../index");
const client_1 = require("@prisma/client");
// GET /api/calendar - Get all calendar events
const getCalendarEvents = async (req, res) => {
    try {
        const { startDate, endDate, status, isPublic, category, limit, offset, } = req.query;
        const where = {};
        // Filter by date range
        if (startDate || endDate) {
            where.startDate = {};
            if (startDate) {
                where.startDate.gte = new Date(startDate);
            }
            if (endDate) {
                where.startDate.lte = new Date(endDate);
            }
        }
        // Filter by status
        if (status) {
            where.status = status;
        }
        // Filter by public/private
        if (isPublic !== undefined) {
            where.isPublic = isPublic === 'true';
        }
        // Filter by category
        if (category) {
            where.category = category;
        }
        const events = await index_1.prisma.calendarEvent.findMany({
            where,
            orderBy: {
                startDate: 'asc',
            },
            take: limit ? parseInt(limit) : undefined,
            skip: offset ? parseInt(offset) : undefined,
        });
        res.json(events);
    }
    catch (error) {
        console.error('Error fetching calendar events:', error);
        res.status(500).json({ error: 'Failed to fetch calendar events' });
    }
};
exports.getCalendarEvents = getCalendarEvents;
// GET /api/calendar/:id - Get a specific calendar event
const getCalendarEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await index_1.prisma.calendarEvent.findUnique({
            where: { id },
        });
        if (!event) {
            return res.status(404).json({ error: 'Calendar event not found' });
        }
        res.json(event);
    }
    catch (error) {
        console.error('Error fetching calendar event:', error);
        res.status(500).json({ error: 'Failed to fetch calendar event' });
    }
};
exports.getCalendarEvent = getCalendarEvent;
// POST /api/calendar - Create a new calendar event
const createCalendarEvent = async (req, res) => {
    try {
        const { title, description, startDate, endDate, isAllDay, recurrence, location, category, color, status, isPublic, link, image, } = req.body;
        // Validate required fields
        if (!title || !startDate) {
            return res.status(400).json({ error: 'Title and startDate are required' });
        }
        const event = await index_1.prisma.calendarEvent.create({
            data: {
                title,
                description,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                isAllDay: isAllDay || false,
                recurrence,
                location,
                category,
                color,
                status: status || client_1.ContentStatus.PUBLISHED,
                isPublic: isPublic !== undefined ? isPublic : true,
                link,
                image,
            },
        });
        res.status(201).json(event);
    }
    catch (error) {
        console.error('Error creating calendar event:', error);
        res.status(500).json({ error: 'Failed to create calendar event' });
    }
};
exports.createCalendarEvent = createCalendarEvent;
// PUT /api/calendar/:id - Update a calendar event
const updateCalendarEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, startDate, endDate, isAllDay, recurrence, location, category, color, status, isPublic, link, image, } = req.body;
        // Check if event exists
        const existingEvent = await index_1.prisma.calendarEvent.findUnique({
            where: { id },
        });
        if (!existingEvent) {
            return res.status(404).json({ error: 'Calendar event not found' });
        }
        // Build update data
        const updateData = {};
        if (title !== undefined)
            updateData.title = title;
        if (description !== undefined)
            updateData.description = description;
        if (startDate !== undefined)
            updateData.startDate = new Date(startDate);
        if (endDate !== undefined)
            updateData.endDate = endDate ? new Date(endDate) : null;
        if (isAllDay !== undefined)
            updateData.isAllDay = isAllDay;
        if (recurrence !== undefined)
            updateData.recurrence = recurrence;
        if (location !== undefined)
            updateData.location = location;
        if (category !== undefined)
            updateData.category = category;
        if (color !== undefined)
            updateData.color = color;
        if (status !== undefined)
            updateData.status = status;
        if (isPublic !== undefined)
            updateData.isPublic = isPublic;
        if (link !== undefined)
            updateData.link = link;
        if (image !== undefined)
            updateData.image = image;
        const updatedEvent = await index_1.prisma.calendarEvent.update({
            where: { id },
            data: updateData,
        });
        res.json(updatedEvent);
    }
    catch (error) {
        console.error('Error updating calendar event:', error);
        res.status(500).json({ error: 'Failed to update calendar event' });
    }
};
exports.updateCalendarEvent = updateCalendarEvent;
// DELETE /api/calendar/:id - Delete a calendar event
const deleteCalendarEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await index_1.prisma.calendarEvent.findUnique({
            where: { id },
        });
        if (!event) {
            return res.status(404).json({ error: 'Calendar event not found' });
        }
        await index_1.prisma.calendarEvent.delete({
            where: { id },
        });
        res.json({ message: 'Calendar event deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting calendar event:', error);
        res.status(500).json({ error: 'Failed to delete calendar event' });
    }
};
exports.deleteCalendarEvent = deleteCalendarEvent;
//# sourceMappingURL=calendarController.js.map