create or replace function email_exists(email_to_check text)
returns boolean
language plpgsql
security definer -- Allows the function to run with elevated privileges
as $$
begin
  return exists (
    select 1
    from auth.users
    where email = email_to_check
  );
end;
$$;
