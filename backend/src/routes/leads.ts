import { Router } from 'express';
import { body } from 'express-validator';
import { createLead, getLeads, getLeadById, updateLead, deleteLead, exportCSV } from '../controllers/leadController';
import { authenticate } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();
router.use(authenticate);

const leadBody = [
  body('name').trim().notEmpty().withMessage('Name required').isLength({ max: 100 }),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']),
  body('source').notEmpty().isIn(['Website', 'Instagram', 'Referral']).withMessage('Valid source required'),
  body('notes').optional().isLength({ max: 500 }),
];

router.get('/export/csv', exportCSV);
router.route('/').get(getLeads).post(leadBody, validateRequest, createLead);
router.route('/:id').get(getLeadById).put(
  [body('status').optional().isIn(['New', 'Contacted', 'Qualified', 'Lost']),
   body('source').optional().isIn(['Website', 'Instagram', 'Referral'])],
  validateRequest, updateLead
).delete(deleteLead);

export default router;
