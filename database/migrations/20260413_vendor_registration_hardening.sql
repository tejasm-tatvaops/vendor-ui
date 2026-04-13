-- Vendor registration hardening:
-- 1) Add missing onboarding/profile fields needed by vendor profile UI.
-- 2) Prevent duplicate vendor registrations at DB level.

alter table public.vendors
  add column if not exists bank_name text,
  add column if not exists bank_account_number text,
  add column if not exists ifsc_code text,
  add column if not exists minimum_project_budget numeric(12,2),
  add column if not exists alternate_contact_number text,
  add column if not exists designation text,
  add column if not exists additional_gst_numbers text[] default '{}',
  add column if not exists gst_certificate_url text,
  add column if not exists pan_card_url text,
  add column if not exists cancelled_cheque_url text,
  add column if not exists work_sample_urls text[] default '{}',
  add column if not exists kyc_status text default 'pending' check (kyc_status in ('pending', 'verified', 'rejected')),
  add column if not exists profile_completion_percent integer default 0 check (profile_completion_percent between 0 and 100);

-- Normalize and enforce uniqueness for primary identifiers.
-- Use partial unique indexes so null/empty values remain insertable.
create unique index if not exists vendors_phone_unique_norm_idx
  on public.vendors (regexp_replace(coalesce(phone, ''), '\D', '', 'g'))
  where coalesce(trim(phone), '') <> '';

create unique index if not exists vendors_email_unique_norm_idx
  on public.vendors (lower(trim(email)))
  where coalesce(trim(email), '') <> '';

create unique index if not exists vendors_gst_unique_norm_idx
  on public.vendors (upper(regexp_replace(coalesce(gst_number, ''), '\s', '', 'g')))
  where coalesce(trim(gst_number), '') <> '';

create unique index if not exists vendors_pan_unique_norm_idx
  on public.vendors (upper(regexp_replace(coalesce(pan_number, ''), '\s', '', 'g')))
  where coalesce(trim(pan_number), '') <> '';

-- Optional banking-level duplicate guard:
create unique index if not exists vendors_bankacct_ifsc_unique_norm_idx
  on public.vendors (
    regexp_replace(coalesce(bank_account_number, ''), '\D', '', 'g'),
    upper(regexp_replace(coalesce(ifsc_code, ''), '\s', '', 'g'))
  )
  where coalesce(trim(bank_account_number), '') <> ''
    and coalesce(trim(ifsc_code), '') <> '';
