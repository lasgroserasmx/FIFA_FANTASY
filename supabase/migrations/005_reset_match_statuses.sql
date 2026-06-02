-- ============================================================
-- MIGRACIÓN 005 - Resetear partidos a 'scheduled'
-- Los partidos del Mundial 2026 empiezan el 11 de junio.
-- El seed anterior los marcó como 'finished' por error.
-- ============================================================

UPDATE public.matches
SET status     = 'scheduled',
    home_score = NULL,
    away_score = NULL
WHERE status = 'finished';
