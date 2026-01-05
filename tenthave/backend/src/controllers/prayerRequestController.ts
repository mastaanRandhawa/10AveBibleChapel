import { Request, Response } from 'express';
import { prisma } from '../index';

// GET /api/prayer-requests - Get all prayer requests
export const getPrayerRequests = async (req: Request, res: Response) => {
  try {
    const {
      isPrivate,
      isAnswered,
      limit,
      offset,
    } = req.query;

    const where: any = {};

    // Filter by private/public
    if (isPrivate !== undefined) {
      where.isPrivate = isPrivate === 'true';
    }

    // Filter by answered status
    if (isAnswered !== undefined) {
      where.isAnswered = isAnswered === 'true';
    }

    const prayerRequests = await prisma.prayerRequest.findMany({
      where,
      orderBy: [
        { createdAt: 'desc' },
      ],
      take: limit ? parseInt(limit as string) : undefined,
      skip: offset ? parseInt(offset as string) : undefined,
    });

    res.json(prayerRequests);
  } catch (error) {
    console.error('Error fetching prayer requests:', error);
    res.status(500).json({ error: 'Failed to fetch prayer requests' });
  }
};

// GET /api/prayer-requests/:id - Get a specific prayer request
export const getPrayerRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const prayerRequest = await prisma.prayerRequest.findUnique({
      where: { id },
    });

    if (!prayerRequest) {
      return res.status(404).json({ error: 'Prayer request not found' });
    }

    res.json(prayerRequest);
  } catch (error) {
    console.error('Error fetching prayer request:', error);
    res.status(500).json({ error: 'Failed to fetch prayer request' });
  }
};

// POST /api/prayer-requests - Create a new prayer request
export const createPrayerRequest = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      requester,
      isPrivate,
    } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    // Reject status, category, and priority if provided
    if (req.body.status !== undefined) {
      return res.status(400).json({ error: 'Status field is not allowed' });
    }
    if (req.body.category !== undefined) {
      return res.status(400).json({ error: 'Category field is not allowed' });
    }
    if (req.body.priority !== undefined) {
      return res.status(400).json({ error: 'Priority field is not allowed' });
    }

    const prayerRequest = await prisma.prayerRequest.create({
      data: {
        title,
        description,
        requester,
        isPrivate: isPrivate || false,
      },
    });

    res.status(201).json(prayerRequest);
  } catch (error) {
    console.error('Error creating prayer request:', error);
    res.status(500).json({ error: 'Failed to create prayer request' });
  }
};

// PUT /api/prayer-requests/:id - Update a prayer request
export const updatePrayerRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      requester,
      isPrivate,
      isAnswered,
      answeredAt,
      answerNotes,
    } = req.body;

    // Reject status, category, and priority if provided
    if (req.body.status !== undefined) {
      return res.status(400).json({ error: 'Status field is not allowed' });
    }
    if (req.body.category !== undefined) {
      return res.status(400).json({ error: 'Category field is not allowed' });
    }
    if (req.body.priority !== undefined) {
      return res.status(400).json({ error: 'Priority field is not allowed' });
    }

    // Check if prayer request exists
    const existingPrayerRequest = await prisma.prayerRequest.findUnique({
      where: { id },
    });

    if (!existingPrayerRequest) {
      return res.status(404).json({ error: 'Prayer request not found' });
    }

    // Build update data
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (requester !== undefined) updateData.requester = requester;
    if (isPrivate !== undefined) updateData.isPrivate = isPrivate;
    if (isAnswered !== undefined) {
      updateData.isAnswered = isAnswered;
      if (isAnswered && !answeredAt) {
        updateData.answeredAt = new Date();
      } else if (!isAnswered) {
        updateData.answeredAt = null;
      }
    }
    if (answeredAt !== undefined) updateData.answeredAt = answeredAt ? new Date(answeredAt) : null;
    if (answerNotes !== undefined) updateData.answerNotes = answerNotes;

    const updatedPrayerRequest = await prisma.prayerRequest.update({
      where: { id },
      data: updateData,
    });

    res.json(updatedPrayerRequest);
  } catch (error) {
    console.error('Error updating prayer request:', error);
    res.status(500).json({ error: 'Failed to update prayer request' });
  }
};

// DELETE /api/prayer-requests/:id - Delete a prayer request
export const deletePrayerRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const prayerRequest = await prisma.prayerRequest.findUnique({
      where: { id },
    });

    if (!prayerRequest) {
      return res.status(404).json({ error: 'Prayer request not found' });
    }

    await prisma.prayerRequest.delete({
      where: { id },
    });

    res.json({ message: 'Prayer request deleted successfully' });
  } catch (error) {
    console.error('Error deleting prayer request:', error);
    res.status(500).json({ error: 'Failed to delete prayer request' });
  }
};

