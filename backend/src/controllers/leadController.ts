import { Response, NextFunction } from 'express';
import { Lead } from '../models/Lead';
import { AppError } from '../middleware/errorHandler';
import { AuthRequest } from '../types';
import { Parser } from 'json2csv';

export const createLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.create({ ...req.body, status: req.body.status || 'New', createdBy: req.user!.id });
    res.status(201).json({ success: true, message: 'Lead created', data: lead });
  } catch (e) { next(e); }
};

export const getLeads = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status, source, search, sort = 'latest', page = 1, limit = 10 } = req.query;
    const filter: Record<string, unknown> = {};

    if (req.user!.role === 'sales') filter.createdBy = req.user!.id;
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const sortOrder = sort === 'oldest' ? 1 : -1;
    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(100, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const [leads, total] = await Promise.all([
      Lead.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(limitNum).populate('createdBy', 'name email'),
      Lead.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limitNum);
    res.status(200).json({
      success: true,
      data: leads,
      meta: { total, page: pageNum, limit: limitNum, totalPages, hasNextPage: pageNum < totalPages, hasPrevPage: pageNum > 1 },
    });
  } catch (e) { next(e); }
};

export const getLeadById = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id).populate('createdBy', 'name email');
    if (!lead) throw new AppError('Lead not found', 404);
    if (req.user!.role === 'sales' && (lead.createdBy as any)._id.toString() !== req.user!.id)
      throw new AppError('Not authorized', 403);
    res.status(200).json({ success: true, data: lead });
  } catch (e) { next(e); }
};

export const updateLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new AppError('Lead not found', 404);
    if (req.user!.role === 'sales' && lead.createdBy.toString() !== req.user!.id)
      throw new AppError('Not authorized', 403);

    const allowed = ['name', 'email', 'status', 'source', 'notes'];
    const updates: Record<string, unknown> = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    const updated = await Lead.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true }).populate('createdBy', 'name email');
    res.status(200).json({ success: true, message: 'Lead updated', data: updated });
  } catch (e) { next(e); }
};

export const deleteLead = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) throw new AppError('Lead not found', 404);
    if (req.user!.role === 'sales' && lead.createdBy.toString() !== req.user!.id)
      throw new AppError('Not authorized', 403);
    await lead.deleteOne();
    res.status(200).json({ success: true, message: 'Lead deleted' });
  } catch (e) { next(e); }
};

export const exportCSV = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.user!.role === 'sales') filter.createdBy = req.user!.id;
    const { status, source, search } = req.query;
    if (status) filter.status = status;
    if (source) filter.source = source;
    if (search) filter.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];

    const leads = await Lead.find(filter).sort({ createdAt: -1 }).populate('createdBy', 'name');
    const data = leads.map((l) => ({
      Name: l.name, Email: l.email, Status: l.status, Source: l.source,
      Notes: l.notes || '', 'Created By': (l.createdBy as any)?.name || '',
      'Created At': new Date(l.createdAt).toLocaleDateString(),
    }));

    const csv = new Parser().parse(data);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.send(csv);
  } catch (e) { next(e); }
};
