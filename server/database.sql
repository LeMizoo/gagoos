-- PostgreSQL
-- =========================================================
-- Core schema
-- =========================================================

create table if not exists users (
  id               uuid primary key default gen_random_uuid(),
  email            varchar(255) unique not null,
  password_hash    varchar(255) not null,
  first_name       varchar(100),
  last_name        varchar(100),
  phone            varchar(50),
  is_active        boolean not null default true,
  is_deleted       boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_users_email on users(email);

create table if not exists roles (
  id        serial primary key,
  code      varchar(50) unique not null,  -- 'ADMIN', 'GERANTE', 'ARTISAN', 'CLIENT'
  label     varchar(100) not null,
  created_at timestamptz not null default now()
);

create table if not exists user_roles (
  user_id   uuid not null references users(id) on delete cascade,
  role_id   int not null references roles(id) on delete cascade,
  assigned_at timestamptz not null default now(),
  primary key (user_id, role_id)
);

create table if not exists permissions (
  id        serial primary key,
  code      varchar(100) unique not null,  -- ex: 'user.manage', 'demand.review', 'demand.assign', 'demand.update'
  label     varchar(150) not null,
  created_at timestamptz not null default now()
);

create table if not exists role_permissions (
  role_id   int not null references roles(id) on delete cascade,
  permission_id int not null references permissions(id) on delete cascade,
  granted_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

-- =========================================================
-- Demands / Orders
-- =========================================================

create table if not exists statuses (
  id        serial primary key,
  code      varchar(50) unique not null, -- 'NEW', 'REVIEW', 'ASSIGNED', 'IN_PRODUCTION', 'READY', 'DELIVERED', 'CANCELLED'
  label     varchar(100) not null
);

create table if not exists demands (
  id               uuid primary key default gen_random_uuid(),
  requester_id     uuid references users(id) on delete set null, -- null si demande publique sans compte
  type             varchar(50) not null, -- 'PUBLIC_REQUEST', 'QUOTE', 'ORDER'
  title            varchar(200) not null,
  description      text,
  status_id        int references statuses(id) on delete restrict,
  assigned_to_id   uuid references users(id) on delete set null, -- artisan ou gérante
  due_date         date,
  priority         int default 3, -- 1=haute,2=normale,3=basse
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create index if not exists idx_demands_status on demands(status_id);
create index if not exists idx_demands_assigned_to on demands(assigned_to_id);

create table if not exists demand_items (
  id            serial primary key,
  demand_id     uuid not null references demands(id) on delete cascade,
  product_name  varchar(150) not null,   -- ex: "T-shirt coton", "Sweat"
  quantity      int not null check (quantity > 0),
  color         varchar(50),
  size          varchar(20),
  unit_price    numeric(12,2),           -- optionnel pour devis/commande
  notes         text
);

create index if not exists idx_demand_items_demand on demand_items(demand_id);

create table if not exists attachments (
  id            uuid primary key default gen_random_uuid(),
  demand_id     uuid not null references demands(id) on delete cascade,
  file_name     varchar(255) not null,
  file_url      text not null,
  mime_type     varchar(100),
  uploaded_by   uuid references users(id) on delete set null,
  created_at    timestamptz not null default now()
);

create index if not exists idx_attachments_demand on attachments(demand_id);

create table if not exists demand_status_history (
  id            serial primary key,
  demand_id     uuid not null references demands(id) on delete cascade,
  from_status_id int references statuses(id) on delete set null,
  to_status_id   int references statuses(id) on delete restrict,
  changed_by     uuid references users(id) on delete set null,
  changed_at     timestamptz not null default now(),
  note           text
);

-- =========================================================
-- Triggers for updated_at
-- =========================================================

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_users_updated on users;
create trigger trg_users_updated
before update on users
for each row execute function set_updated_at();

drop trigger if exists trg_demands_updated on demands;
create trigger trg_demands_updated
before update on demands
for each row execute function set_updated_at();

-- =========================================================
-- Seed data (roles, permissions, statuses)
-- =========================================================

insert into roles (code, label) values
  ('ADMIN', 'Administrateur'),
  ('GERANTE', 'Gérante'),
  ('ARTISAN', 'Artisan'),
  ('CLIENT', 'Client')
on conflict (code) do nothing;

insert into permissions (code, label) values
  ('user.manage', 'Gérer les utilisateurs'),
  ('role.manage', 'Gérer les rôles et permissions'),
  ('demand.create', 'Créer des demandes'),
  ('demand.review', 'Revoir et qualifier les demandes'),
  ('demand.assign', 'Assigner les demandes'),
  ('demand.update', 'Mettre à jour les demandes'),
  ('demand.view', 'Voir les demandes')
on conflict (code) do nothing;

-- Role permissions mapping minimal
with rp as (
  select r.id as role_id, p.id as permission_id, p.code
  from roles r cross join permissions p
)
insert into role_permissions (role_id, permission_id)
select role_id, permission_id from rp
where (select code from roles where id = role_id) = 'ADMIN'
on conflict do nothing;

-- GERANTE: gestion des demandes
insert into role_permissions (role_id, permission_id)
select r.id, p.id
from roles r, permissions p
where r.code = 'GERANTE'
  and p.code in ('demand.view','demand.review','demand.assign','demand.update')
on conflict do nothing;

-- ARTISAN: travail sur les demandes assignées
insert into role_permissions (role_id, permission_id)
select r.id, p.id
from roles r, permissions p
where r.code = 'ARTISAN'
  and p.code in ('demand.view','demand.update')
on conflict do nothing;

-- CLIENT: créer et voir ses demandes
insert into role_permissions (role_id, permission_id)
select r.id, p.id
from roles r, permissions p
where r.code = 'CLIENT'
  and p.code in ('demand.create','demand.view')
on conflict do nothing;

-- Statuses
insert into statuses (code, label) values
  ('NEW', 'Nouvelle demande'),
  ('REVIEW', 'En revue'),
  ('ASSIGNED', 'Assignée'),
  ('IN_PRODUCTION', 'En production'),
  ('READY', 'Prête'),
  ('DELIVERED', 'Livrée'),
  ('CANCELLED', 'Annulée')
on conflict (code) do nothing;

-- =========================================================
-- Admin test data
-- =========================================================

-- Remplace 'hashedpassword' par un vrai hash (ex: bcrypt)
insert into users (email, password_hash, first_name, last_name, phone)
values ('admin@bygagooz.com', '$2b$10$REPLACE_WITH_VALID_BCRYPT_HASH', 'Admin', 'ByGagooz', '+261XXXXXXXX')
on conflict (email) do nothing;

-- Assigner ADMIN
insert into user_roles (user_id, role_id)
select u.id, r.id
from users u join roles r on r.code = 'ADMIN'
where u.email = 'admin@bygagooz.com'
on conflict do nothing;

-- Compte Gérante (optionnel pour tests)
insert into users (email, password_hash, first_name, last_name, phone)
values ('gerante@bygagooz.com', '$2b$10$REPLACE_WITH_VALID_BCRYPT_HASH', 'Gérante', 'ByGagooz', '+261YYYYYYYY')
on conflict (email) do nothing;

insert into user_roles (user_id, role_id)
select u.id, r.id
from users u join roles r on r.code = 'GERANTE'
where u.email = 'gerante@bygagooz.com'
on conflict do nothing;
