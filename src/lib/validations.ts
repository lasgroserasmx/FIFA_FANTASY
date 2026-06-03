import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20).regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, underscores'),
  full_name: z.string().min(2, 'Full name required'),
})

export const createLeagueSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener mínimo 3 caracteres').max(50),
  description: z.string().max(200).optional(),
  mode: z.enum(['fantasy', 'prediction', 'both', 'torneo', 'all']),
  max_members: z.number().min(2).max(100),
  entry_fee: z.number().min(0).max(10000),
  budget: z.number().min(50).max(200),
  squad_size: z.number().min(11).max(25),
  tournament_type: z.string().optional(),
})

export const joinLeagueSchema = z.object({
  invite_code: z.string().length(8, 'Invite code must be 8 characters'),
})

export const predictionSchema = z.object({
  predicted_home_score: z.number().min(0).max(20),
  predicted_away_score: z.number().min(0).max(20),
})

export const updateProfileSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  full_name: z.string().min(2).max(100).optional(),
  country: z.string().optional(),
  bio: z.string().max(300).optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CreateLeagueInput = z.infer<typeof createLeagueSchema>
export type JoinLeagueInput = z.infer<typeof joinLeagueSchema>
export type PredictionInput = z.infer<typeof predictionSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
