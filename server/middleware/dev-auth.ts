// Local development only: auto-authenticate as admin so the panel can be
// exercised without going through the GitHub OAuth flow. Never runs in
// production builds — `import.meta.dev` is statically false there.
export default defineEventHandler(async (event) => {
  if (!import.meta.dev) return

  const session = await getUserSession(event)
  if (session.user) return

  await setUserSession(event, {
    user: { login: 'local-dev', name: 'Local Dev', avatar: '' },
  })
})
