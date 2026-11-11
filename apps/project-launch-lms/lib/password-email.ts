// Supabase dashboard email links may return their session in the URL fragment.
export function routePasswordEmail() {
  const fragment = window.location.hash;
  const kind = new URLSearchParams(fragment.slice(1)).get("type");
  if (kind !== "invite" && kind !== "recovery") return false;

  window.location.replace("/set-password" + fragment);
  return true;
}
