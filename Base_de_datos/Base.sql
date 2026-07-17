-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.perfiles (
  id uuid NOT NULL,
  email text UNIQUE,
  rol text DEFAULT 'anonimo'::text CHECK (rol = ANY (ARRAY['disenador'::text, 'microempresario'::text, 'anonimo'::text])),
  nombre_marca text,
  rubro text,
  creado_en timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT perfiles_pkey PRIMARY KEY (id),
  CONSTRAINT perfiles_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id)
);
CREATE TABLE public.paletas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid,
  color_base character varying NOT NULL,
  esquema_tipo character varying NOT NULL,
  colores jsonb NOT NULL,
  creado_en timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT paletas_pkey PRIMARY KEY (id),
  CONSTRAINT paletas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES auth.users(id)
);