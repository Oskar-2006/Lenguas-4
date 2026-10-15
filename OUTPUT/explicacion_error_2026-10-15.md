# Explicación de error — 2026-10-15

**Error:** `ERROR: 42883: function get_teams_for_user(uuid) does not exist` (Supabase / PostgreSQL, al crear una policy)

## Tipo de error
Error de **referencia / nombre no definido**, igual que los `ReferenceError` de JS: se usa algo que la base de datos no encuentra. Aquí es una función SQL.

## Qué significa
La policy llama a `get_teams_for_user(...)`, pero Postgres no tiene ninguna función con ese nombre **y** ese tipo de argumento (`uuid`). El `HINT` lo dice: no hay coincidencia de nombre + tipos.

## Causas probables
1. **La función nunca se creó.** Usar una función en una policy no la crea.
2. **Se creó con otra firma.** En Postgres la función se identifica por nombre + tipos de argumentos. `get_teams_for_user(text)` es otra función distinta de `get_teams_for_user(uuid)`.
3. **Está en otro schema.** Si está en `private` o `app`, hay que llamarla como `private.get_teams_for_user(...)`.
4. **Nombre mal escrito** (como `herores` vs `heroes`).

## Cómo comprobarlo
```sql
select n.nspname as schema, p.proname, pg_get_function_arguments(p.oid) as args
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where p.proname ilike '%teams%';
```

## Corrección
Si no aparece, créala antes que la policy. Ejemplo (ajusta los nombres de tabla y columnas a las tuyas):
```sql
create or replace function public.get_teams_for_user(user_id uuid)
returns setof uuid
language sql
security definer
set search_path = public
stable
as $$
  select team_id from team_members where user_id = get_teams_for_user.user_id;
$$;
```
Si aparece con otra firma o schema, ajusta la llamada en la policy.

## Concepto clave
Orden de dependencias: la policy depende de la función, así que la función va primero. Es lo mismo que declarar una variable antes de usarla.
