import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'

import { Unavailable, MissingPage } from '../ui/route-feedback'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
  errorComponent: Unavailable,
  notFoundComponent: MissingPage,
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Small Wins — your next step',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

// Render the complete HTML document; Start supplies hydration scripts.
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}

        <Scripts />
      </body>
    </html>
  )
}
