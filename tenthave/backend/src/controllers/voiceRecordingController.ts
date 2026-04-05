import { Request, Response } from 'express';
import { prisma } from '../index';
import { ContentStatus } from '@prisma/client';

// GET /api/voice-recordings
export const getVoiceRecordings = async (req: Request, res: Response) => {
  try {
    const { status, isPublic, isFeatured, category, speaker, limit, offset } = req.query;

    const where: any = {};

    if (status) {
      where.status = status as ContentStatus;
    }
    if (isPublic !== undefined) {
      where.isPublic = isPublic === 'true';
    }
    if (isFeatured !== undefined) {
      where.isFeatured = isFeatured === 'true';
    }
    if (category) {
      where.category = category as string;
    }
    if (speaker) {
      where.speaker = { contains: speaker as string };
    }

    const recordings = await prisma.voiceRecording.findMany({
      where,
      orderBy: { date: 'desc' },
      take: limit ? parseInt(limit as string) : undefined,
      skip: offset ? parseInt(offset as string) : undefined,
    });

    res.json(recordings);
  } catch (error) {
    console.error('Error fetching voice recordings:', error);
    res.status(500).json({ error: 'Failed to fetch voice recordings' });
  }
};

// GET /api/voice-recordings/:id
export const getVoiceRecording = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const recording = await prisma.voiceRecording.findUnique({ where: { id } });

    if (!recording) {
      return res.status(404).json({ error: 'Voice recording not found' });
    }

    res.json(recording);
  } catch (error) {
    console.error('Error fetching voice recording:', error);
    res.status(500).json({ error: 'Failed to fetch voice recording' });
  }
};

// POST /api/voice-recordings
export const createVoiceRecording = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      speaker,
      date,
      passage,
      category,
      embedUrl,
      embedType,
      status,
      isPublic,
      isFeatured,
    } = req.body;

    if (!title || !speaker || !date || !embedUrl) {
      return res.status(400).json({ error: 'Title, speaker, date, and embedUrl are required' });
    }

    const recording = await prisma.voiceRecording.create({
      data: {
        title,
        description,
        speaker,
        date: new Date(date),
        passage,
        category,
        embedUrl,
        embedType: embedType || 'iframe',
        status: status || ContentStatus.PUBLISHED,
        isPublic: isPublic !== undefined ? isPublic : true,
        isFeatured: isFeatured || false,
      },
    });

    res.status(201).json(recording);
  } catch (error) {
    console.error('Error creating voice recording:', error);
    res.status(500).json({ error: 'Failed to create voice recording' });
  }
};

// PUT /api/voice-recordings/:id
export const updateVoiceRecording = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      speaker,
      date,
      passage,
      category,
      embedUrl,
      embedType,
      status,
      isPublic,
      isFeatured,
    } = req.body;

    const existing = await prisma.voiceRecording.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Voice recording not found' });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (speaker !== undefined) updateData.speaker = speaker;
    if (date !== undefined) updateData.date = new Date(date);
    if (passage !== undefined) updateData.passage = passage;
    if (category !== undefined) updateData.category = category;
    if (embedUrl !== undefined) updateData.embedUrl = embedUrl;
    if (embedType !== undefined) updateData.embedType = embedType;
    if (status !== undefined) updateData.status = status;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;

    const updated = await prisma.voiceRecording.update({ where: { id }, data: updateData });

    res.json(updated);
  } catch (error) {
    console.error('Error updating voice recording:', error);
    res.status(500).json({ error: 'Failed to update voice recording' });
  }
};

// DELETE /api/voice-recordings/:id
export const deleteVoiceRecording = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await prisma.voiceRecording.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: 'Voice recording not found' });
    }

    await prisma.voiceRecording.delete({ where: { id } });

    res.json({ message: 'Voice recording deleted successfully' });
  } catch (error) {
    console.error('Error deleting voice recording:', error);
    res.status(500).json({ error: 'Failed to delete voice recording' });
  }
};
