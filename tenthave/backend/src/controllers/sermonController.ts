import { Request, Response } from 'express';
import { prisma } from '../index';
import { ContentStatus } from '@prisma/client';

// GET /api/sermons - Get all sermons
export const getSermons = async (req: Request, res: Response) => {
  try {
    const {
      status,
      isPublic,
      isFeatured,
      series,
      speaker,
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

    // Filter by featured
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured === 'true';
    }

    // Filter by series
    if (series) {
      where.series = series as string;
    }

    // Filter by speaker
    if (speaker) {
      where.speaker = {
        contains: speaker as string,
      };
    }

    // Filter by date range
    if (startDate || endDate) {
      where.date = {};
      if (startDate) {
        where.date.gte = new Date(startDate as string);
      }
      if (endDate) {
        where.date.lte = new Date(endDate as string);
      }
    }

    const sermons = await prisma.sermon.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
      take: limit ? parseInt(limit as string) : undefined,
      skip: offset ? parseInt(offset as string) : undefined,
    });

    res.json(sermons);
  } catch (error) {
    console.error('Error fetching sermons:', error);
    res.status(500).json({ error: 'Failed to fetch sermons' });
  }
};

// GET /api/sermons/:id - Get a specific sermon
export const getSermon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const sermon = await prisma.sermon.findUnique({
      where: { id },
    });

    if (!sermon) {
      return res.status(404).json({ error: 'Sermon not found' });
    }

    res.json(sermon);
  } catch (error) {
    console.error('Error fetching sermon:', error);
    res.status(500).json({ error: 'Failed to fetch sermon' });
  }
};

// GET /api/sermons/series/:seriesName - Get all sermons in a series
export const getSermonsBySeries = async (req: Request, res: Response) => {
  try {
    const { seriesName } = req.params;

    const sermons = await prisma.sermon.findMany({
      where: {
        series: seriesName,
        status: ContentStatus.PUBLISHED,
        isPublic: true,
      },
      orderBy: {
        date: 'asc',
      },
    });

    res.json(sermons);
  } catch (error) {
    console.error('Error fetching sermon series:', error);
    res.status(500).json({ error: 'Failed to fetch sermon series' });
  }
};

// POST /api/sermons - Create a new sermon
export const createSermon = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      speaker,
      date,
      passage,
      series,
      videoUrl,
      audioUrl,
      thumbnail,
      status,
      isPublic,
      isFeatured,
    } = req.body;

    // Validate required fields
    if (!title || !speaker || !date) {
      return res.status(400).json({ error: 'Title, speaker, and date are required' });
    }

    const sermon = await prisma.sermon.create({
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
        status: status || ContentStatus.PUBLISHED,
        isPublic: isPublic !== undefined ? isPublic : true,
        isFeatured: isFeatured || false,
      },
    });

    res.status(201).json(sermon);
  } catch (error) {
    console.error('Error creating sermon:', error);
    res.status(500).json({ error: 'Failed to create sermon' });
  }
};

// PUT /api/sermons/:id - Update a sermon
export const updateSermon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      speaker,
      date,
      passage,
      series,
      videoUrl,
      audioUrl,
      thumbnail,
      status,
      isPublic,
      isFeatured,
    } = req.body;

    // Check if sermon exists
    const existingSermon = await prisma.sermon.findUnique({
      where: { id },
    });

    if (!existingSermon) {
      return res.status(404).json({ error: 'Sermon not found' });
    }

    // Build update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (speaker !== undefined) updateData.speaker = speaker;
    if (date !== undefined) updateData.date = new Date(date);
    if (passage !== undefined) updateData.passage = passage;
    if (series !== undefined) updateData.series = series;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    if (audioUrl !== undefined) updateData.audioUrl = audioUrl;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (status !== undefined) updateData.status = status;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const updatedSermon = await prisma.sermon.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedSermon);
  } catch (error) {
    console.error('Error updating sermon:', error);
    res.status(500).json({ error: 'Failed to update sermon' });
  }
};

// DELETE /api/sermons/:id - Delete a sermon
export const deleteSermon = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const sermon = await prisma.sermon.findUnique({
      where: { id },
    });

    if (!sermon) {
      return res.status(404).json({ error: 'Sermon not found' });
    }

    await prisma.sermon.delete({
      where: { id },
    });

    res.json({ message: 'Sermon deleted successfully' });
  } catch (error) {
    console.error('Error deleting sermon:', error);
    res.status(500).json({ error: 'Failed to delete sermon' });
  }
};

