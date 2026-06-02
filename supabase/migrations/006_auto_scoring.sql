-- ============================================================
-- MIGRACIÓN 006 - Cálculo automático de puntos al terminar partido
--
-- Flujo:
--   1. El sync de API-Football actualiza matches.status = 'finished'
--   2. El trigger `match_finished_trigger` dispara on_match_finished()
--   3. on_match_finished() llama a calculate_match_points(match_id)
--   4. La función:
--        a) Puntúa predicciones (quiniela) de todos los usuarios
--        b) Puntúa plantillas fantasy de todos los usuarios
--        c) Actualiza rankings en league_members
-- ============================================================

-- ============================================================
-- UNIQUE constraint en fantasy_points para evitar duplicados
-- ============================================================
ALTER TABLE public.fantasy_points
  ADD CONSTRAINT fantasy_points_unique
  UNIQUE (fantasy_team_id, match_id, player_id);

-- ============================================================
-- FUNCIÓN PRINCIPAL: calculate_match_points
-- ============================================================
CREATE OR REPLACE FUNCTION public.calculate_match_points(p_match_id UUID)
RETURNS JSONB AS $$
DECLARE
  v_match          RECORD;
  v_pred           RECORD;
  v_roster         RECORD;
  v_stat           RECORD;
  v_outcome        TEXT;   -- 'home' | 'away' | 'draw'
  v_pred_outcome   TEXT;
  v_pts            INTEGER;
  v_base_pts       INTEGER;
  v_pred_count     INTEGER := 0;
  v_fantasy_count  INTEGER := 0;
BEGIN
  -- ── Obtener el partido ─────────────────────────────────────
  SELECT * INTO v_match FROM public.matches WHERE id = p_match_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('error', 'Partido no encontrado', 'match_id', p_match_id);
  END IF;

  IF v_match.status != 'finished' THEN
    RETURN jsonb_build_object('error', 'El partido aún no ha terminado', 'status', v_match.status);
  END IF;

  IF v_match.home_score IS NULL OR v_match.away_score IS NULL THEN
    RETURN jsonb_build_object('error', 'Faltan marcadores', 'match_id', p_match_id);
  END IF;

  -- ── Resultado real ─────────────────────────────────────────
  IF v_match.home_score > v_match.away_score THEN
    v_outcome := 'home';
  ELSIF v_match.home_score < v_match.away_score THEN
    v_outcome := 'away';
  ELSE
    v_outcome := 'draw';
  END IF;

  -- ============================================================
  -- QUINIELA: puntuar predicciones no procesadas
  -- ============================================================
  FOR v_pred IN
    SELECT
      p.id,
      p.league_id,
      p.user_id,
      p.predicted_home_score,
      p.predicted_away_score,
      l.pred_exact_score,
      l.pred_correct_diff,
      l.pred_correct_outcome
    FROM public.predictions p
    JOIN public.leagues l ON l.id = p.league_id
    WHERE p.match_id = p_match_id
      AND p.is_processed = FALSE
      AND p.predicted_home_score IS NOT NULL
      AND p.predicted_away_score IS NOT NULL
  LOOP
    v_pts := 0;

    -- Resultado predicho
    IF v_pred.predicted_home_score > v_pred.predicted_away_score THEN
      v_pred_outcome := 'home';
    ELSIF v_pred.predicted_home_score < v_pred.predicted_away_score THEN
      v_pred_outcome := 'away';
    ELSE
      v_pred_outcome := 'draw';
    END IF;

    IF  v_pred.predicted_home_score = v_match.home_score
    AND v_pred.predicted_away_score = v_match.away_score THEN
      -- Marcador exacto: puntuación máxima
      v_pts := v_pred.pred_exact_score;

    ELSIF (v_pred.predicted_home_score - v_pred.predicted_away_score)
        = (v_match.home_score - v_match.away_score) THEN
      -- Diferencia de goles exacta
      v_pts := v_pred.pred_correct_diff;

    ELSIF v_pred_outcome = v_outcome THEN
      -- Solo resultado correcto (W/D/L)
      v_pts := v_pred.pred_correct_outcome;
    END IF;

    -- Marcar predicción como procesada
    UPDATE public.predictions
    SET points_earned = v_pts,
        is_processed  = TRUE,
        updated_at    = NOW()
    WHERE id = v_pred.id;

    -- Sumar al acumulado del miembro en la liga
    UPDATE public.league_members
    SET total_prediction_points = total_prediction_points + v_pts
    WHERE league_id = v_pred.league_id
      AND user_id   = v_pred.user_id;

    v_pred_count := v_pred_count + 1;
  END LOOP;

  -- Recalcular rankings de quiniela en las ligas afectadas
  WITH ranked AS (
    SELECT
      lm.id,
      RANK() OVER (PARTITION BY lm.league_id ORDER BY lm.total_prediction_points DESC) AS new_rank
    FROM public.league_members lm
    WHERE lm.league_id IN (
      SELECT DISTINCT league_id FROM public.predictions WHERE match_id = p_match_id
    )
  )
  UPDATE public.league_members lm
  SET rank = r.new_rank
  FROM ranked r
  WHERE r.id = lm.id;

  -- ============================================================
  -- FANTASY: puntuar jugadores que participaron en el partido
  -- ============================================================
  FOR v_stat IN
    SELECT *
    FROM public.player_match_stats
    WHERE match_id = p_match_id
  LOOP
    -- Para cada plantilla fantasy que tenga a este jugador
    FOR v_roster IN
      SELECT
        fr.fantasy_team_id,
        fr.is_captain,
        fr.is_starting,
        ft.user_id,
        ft.league_id,
        l.scoring_goal,
        l.scoring_assist,
        l.scoring_clean_sheet,
        l.scoring_save,
        l.scoring_yellow_card,
        l.scoring_red_card,
        l.scoring_own_goal
      FROM public.fantasy_rosters fr
      JOIN public.fantasy_teams  ft ON ft.id = fr.fantasy_team_id
      JOIN public.leagues         l ON  l.id = ft.league_id
      WHERE fr.player_id = v_stat.player_id
    LOOP
      -- Puntos base con configuración de la liga
      v_base_pts :=
          v_stat.goals         * v_roster.scoring_goal
        + v_stat.assists       * v_roster.scoring_assist
        + v_stat.saves         * v_roster.scoring_save
        + v_stat.yellow_cards  * v_roster.scoring_yellow_card
        + v_stat.red_cards     * v_roster.scoring_red_card
        + v_stat.own_goals     * v_roster.scoring_own_goal
        + (CASE WHEN v_stat.clean_sheet THEN v_roster.scoring_clean_sheet ELSE 0 END);

      -- Los suplentes solo suman la mitad de puntos
      IF NOT v_roster.is_starting THEN
        v_base_pts := v_base_pts / 2;
      END IF;

      -- El capitán duplica los puntos
      IF v_roster.is_captain THEN
        v_base_pts := v_base_pts * 2;
      END IF;

      -- Insertar en fantasy_points (ON CONFLICT = idempotente)
      INSERT INTO public.fantasy_points
        (fantasy_team_id, match_id, player_id, points, is_captain_multiplied)
      VALUES
        (v_roster.fantasy_team_id, p_match_id, v_stat.player_id, v_base_pts, v_roster.is_captain)
      ON CONFLICT (fantasy_team_id, match_id, player_id) DO NOTHING;

      -- Sumar al total del equipo fantasy
      UPDATE public.fantasy_teams
      SET total_points = total_points + v_base_pts,
          updated_at   = NOW()
      WHERE id = v_roster.fantasy_team_id;

      -- Sumar al acumulado del miembro en la liga
      UPDATE public.league_members
      SET total_fantasy_points = total_fantasy_points + v_base_pts
      WHERE league_id = v_roster.league_id
        AND user_id   = v_roster.user_id;

      v_fantasy_count := v_fantasy_count + 1;
    END LOOP;
  END LOOP;

  -- Recalcular rankings fantasy en las ligas afectadas
  WITH ranked AS (
    SELECT
      lm.id,
      RANK() OVER (PARTITION BY lm.league_id ORDER BY lm.total_fantasy_points DESC) AS new_rank
    FROM public.league_members lm
    WHERE lm.league_id IN (
      SELECT DISTINCT ft.league_id
      FROM public.fantasy_points fp
      JOIN public.fantasy_teams  ft ON ft.id = fp.fantasy_team_id
      WHERE fp.match_id = p_match_id
    )
  )
  UPDATE public.league_members lm
  SET rank = r.new_rank
  FROM ranked r
  WHERE r.id = lm.id;

  RETURN jsonb_build_object(
    'ok',                    TRUE,
    'match_id',              p_match_id,
    'resultado',             v_match.home_score || '-' || v_match.away_score,
    'predicciones_puntuadas', v_pred_count,
    'rosters_fantasy_puntuados', v_fantasy_count
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- TRIGGER: se dispara automáticamente cuando status → 'finished'
-- ============================================================
CREATE OR REPLACE FUNCTION public.on_match_finished()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'finished' AND (OLD.status IS DISTINCT FROM 'finished') THEN
    PERFORM public.calculate_match_points(NEW.id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER match_finished_trigger
  AFTER UPDATE ON public.matches
  FOR EACH ROW
  EXECUTE FUNCTION public.on_match_finished();

-- ============================================================
-- Permitir al service role llamar la función manualmente
-- ============================================================
GRANT EXECUTE ON FUNCTION public.calculate_match_points(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.on_match_finished()           TO service_role;
