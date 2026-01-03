import { Request, Response } from 'express';
import { prisma } from '../index';
import { ContentStatus } from '@prisma/client';

// GET /api/announcements - Get all announcements
export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const {
      status,
      isPublic,
      category,
      priority,
      startDate,
      endDate,
      limit,
      offset,
    } = req.query;

    const where: any = {};

    // Filter by status
    if (status) {
      where.status = status as ContentStatus;
    }

    // Filter by public/private
    if (isPublic !== undefined) {
      where.isPublic = isPublic === 'true';
    }

    // Filter by category
    if (category) {
      where.category = category as string;
    }

    // Filter by priority
    if (priority) {
      where.priority = priority as string;
    }

    // Filter by date range (active announcements)
    const now = new Date();
    if (startDate || endDate) {
      where.OR = [
        {
          startDate: null,
          endDate: null,
        },
        {
          AND: [
            {
              OR: [
                { startDate: null },
                { startDate: { lte: now } },
              ],
            },
            {
              OR: [
                { endDate: null },
                { endDate: { gte: now } },
              ],
            },
          ],
        },
      ];
    } else {
      // Default: show active announcements (within date range or no date restrictions)
      where.OR = [
        {
          startDate: null,
          endDate: null,
        },
        {
          AND: [
            {
              OR: [
                { startDate: null },
                { startDate: { lte: now } },
              ],
            },
            {
              OR: [
                { endDate: null },
                { endDate: { gte: now } },
              ],
            },
          ],
        },
      ];
    }

    const announcements = await prisma.announcement.findMany({
      where,
      orderBy: [
        { pinned: 'desc' },
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
      take: limit ? parseInt(limit as string) : undefined,
      skip: offset ? parseInt(offset as string) : undefined,
    });

    res.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
};

// GET /api/announcements/:id - Get a specific announcement
export const getAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    res.json(announcement);
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({ error: 'Failed to fetch announcement' });
  }
};

// POST /api/announcements - Create a new announcement
export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const {
      title,
      content,
      category,
      priority,
      status,
      isPublic,
      pinned,
      publishedAt,
      startDate,
      endDate,
      link,
    } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        category,
        priority,
        status: status || ContentStatus.DRAFT,
        isPublic: isPublic !== undefined ? isPublic : true,
        pinned: pinned || false,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        link,
      },
    });

    res.status(201).json(announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
};

// PUT /api/announcements/:id - Update an announcement
export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      category,
      priority,
      status,
      isPublic,
      pinned,
      publishedAt,
      startDate,
      endDate,
      link,
    } = req.body;

    // Check if announcement exists
    const existingAnnouncement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!existingAnnouncement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    // Build update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;
    if (priority !== undefined) updateData.priority = priority;
    if (status !== undefined) updateData.status = status;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (pinned !== undefined) updateData.pinned = pinned;
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt ? new Date(publishedAt) : null;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (link !== undefined) updateData.link = link;

    const updatedAnnouncement = await prisma.announcement.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedAnnouncement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
};

// DELETE /api/announcements/:id - Delete an announcement
export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const announcement = await prisma.announcement.findUnique({
      where: { id },
    });

    if (!announcement) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    await prisma.announcement.delete({
      where: { id },
    });

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
};

