-- ============================================================
-- reset_db.sql
-- Limpia todos los datos sembrados para que DataSeeder
-- vuelva a ejecutarse con las unidades corregidas.
-- Ejecutar con:
--   psql -U postgres -d nutrichef -f reset_db.sql
-- ============================================================

-- Orden inverso a las FK
TRUNCATE TABLE ingredient_substitutions RESTART IDENTITY CASCADE;
TRUNCATE TABLE recipe_ingredients       RESTART IDENTITY CASCADE;
TRUNCATE TABLE user_inventory           RESTART IDENTITY CASCADE;
TRUNCATE TABLE recipes                  RESTART IDENTITY CASCADE;
TRUNCATE TABLE ingredients              RESTART IDENTITY CASCADE;
-- Usuarios NO se borran para no perder cuentas reales

-- Agregar columna unit a user_inventory si no existe (del backup antiguo)
ALTER TABLE user_inventory ADD COLUMN IF NOT EXISTS unit VARCHAR(50) DEFAULT 'unidades';

-- Agregar columna unit a recipe_ingredients si no existe
ALTER TABLE recipe_ingredients ADD COLUMN IF NOT EXISTS unit VARCHAR(50) DEFAULT 'unidades';

SELECT 'Reset completado. Reinicia el backend para re-sembrar.' AS resultado;
