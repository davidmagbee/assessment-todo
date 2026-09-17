import { renderToString } from 'react-dom/server'
import { expect, test } from 'vitest'
import { Unavailable, MissingPage } from '../src/ui/route-feedback'
test('route errors offer recovery without exposing server details', () => {
  expect(renderToString(<Unavailable/>)).toContain('Please try again')
  expect(renderToString(<MissingPage/>)).toContain('Back to your list')
})
