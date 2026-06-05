export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    const config = useRuntimeConfig()
    if (user.login !== config.adminGithubLogin) {
      throw createError({ statusCode: 403, message: 'Access denied.' })
    }
    await setUserSession(event, {
      user: {
        login: user.login,
        name: user.name,
        avatar: user.avatar_url,
      },
    })
    return sendRedirect(event, '/admin')
  },
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/admin/login?error=1')
  },
})
