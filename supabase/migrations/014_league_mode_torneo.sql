-- Añadir valores que faltan al enum league_mode
ALTER TYPE league_mode ADD VALUE IF NOT EXISTS 'torneo';
ALTER TYPE league_mode ADD VALUE IF NOT EXISTS 'all';
