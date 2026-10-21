-- Extend the existing private feedback inbox; keep its RLS and rate-limit guard.
begin;
set local lock_timeout = '5s';

alter table public.feedback_requests
  drop constraint feedback_requests_kind_check,
  drop constraint feedback_question_context;

alter table public.feedback_requests
  add constraint feedback_requests_kind_check
    check (kind in ('question_report', 'general_suggestion', 'question_submission')),
  add constraint feedback_question_context check (
    (kind = 'question_report' and question_id is not null and division is not null)
    or
    (kind = 'general_suggestion' and question_id is null and division is null)
    or
    (kind = 'question_submission' and question_id is null and division is not null)
  );

commit;
